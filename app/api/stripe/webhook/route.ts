import Stripe from "stripe";
import { eq, sql } from "drizzle-orm";
import { getDb } from "../../../../db";
import { orders } from "../../../../db/schema";
import { createClickUpOrderTask } from "../../../../lib/clickup";
import { sendOrderEmail } from "../../../../lib/email";
import { getStripeClient } from "../../../../lib/stripe";
import { SITE_ORIGIN } from "../../../../lib/site";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) return new Response("Webhook is not configured.", { status: 400 });

  let event: Stripe.Event;
  try {
    event = await getStripeClient().webhooks.constructEventAsync(await request.text(), signature, webhookSecret, undefined, Stripe.createSubtleCryptoProvider());
  } catch {
    return new Response("Invalid webhook signature.", { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object;
    if (session.payment_status === "paid" && session.metadata?.product === "wifi-doktor" && session.mode === "payment" && (session.amount_total === 29900 || session.amount_total === 59000) && session.currency === "czk") {
      const values = {
        checkoutSessionId: session.id,
        product: "wifi-doktor",
        status: "paid" as const,
        amountTotal: session.amount_total ?? 29900,
        currency: session.currency ?? "czk",
        customerEmail: session.customer_details?.email ?? null,
        stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
        paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
        paidAt: sql<string>`CURRENT_TIMESTAMP`,
        updatedAt: sql<string>`CURRENT_TIMESTAMP`,
      };

      const db = getDb();
      await db.insert(orders).values(values).onConflictDoUpdate({
        target: orders.checkoutSessionId,
        set: {
          status: values.status,
          amountTotal: values.amountTotal,
          currency: values.currency,
          customerEmail: values.customerEmail,
          stripeCustomerId: values.stripeCustomerId,
          paymentIntentId: values.paymentIntentId,
          paidAt: values.paidAt,
          updatedAt: values.updatedAt,
        },
      });

      // Atomic lease prevents simultaneous Stripe deliveries creating duplicate notifications.
      const claimed = await db.update(orders)
        .set({ fulfillmentLease: sql<string>`datetime('now', '+90 seconds')` })
        .where(sql`${orders.checkoutSessionId} = ${session.id} AND (${orders.fulfillmentLease} IS NULL OR ${orders.fulfillmentLease} < CURRENT_TIMESTAMP)`)
        .returning({ id: orders.checkoutSessionId });
      if (!claimed.length) return new Response("Order processing; retry later.", { status: 503 });
      try {
      const [order] = await db
        .select({ clickupTaskId: orders.clickupTaskId, orderEmailSentAt: orders.orderEmailSentAt })
        .from(orders)
        .where(eq(orders.checkoutSessionId, session.id))
        .limit(1);

      let failed = false;
      try {
      if (!order?.clickupTaskId) {
        const clickupTaskId = await createClickUpOrderTask({
          checkoutSessionId: session.id,
          customerEmail: values.customerEmail,
          amountTotal: values.amountTotal,
          currency: values.currency,
        });

        if (clickupTaskId) {
          await db
            .update(orders)
            .set({ clickupTaskId, updatedAt: sql<string>`CURRENT_TIMESTAMP` })
            .where(eq(orders.checkoutSessionId, session.id));
        }
      }
      } catch {
        failed = true;
        console.error("ClickUp delivery failed; Stripe should retry.");
      }

      try {
      if (values.customerEmail && !order?.orderEmailSentAt) {
        const origin = SITE_ORIGIN;
        const sent = await sendOrderEmail({
          to: values.customerEmail,
          accessUrl: `${origin}/pruvodce?session_id=${encodeURIComponent(session.id)}`,
          checkoutSessionId: session.id,
        });
        if (sent) await db.update(orders).set({orderEmailSentAt:sql<string>`CURRENT_TIMESTAMP`,updatedAt:sql<string>`CURRENT_TIMESTAMP`}).where(eq(orders.checkoutSessionId,session.id));
      }
      } catch {
        failed = true;
        console.error("Order email delivery failed; Stripe should retry.");
      }
      if (failed) return new Response("Delivery incomplete; retry later.", { status: 503 });
      } finally {
        await db.update(orders).set({ fulfillmentLease: null }).where(eq(orders.checkoutSessionId, session.id));
      }
    }
  }
  return Response.json({ received: true });
}
