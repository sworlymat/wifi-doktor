import Stripe from "stripe";
import { eq, sql } from "drizzle-orm";
import { getDb } from "../../../../db";
import { orders } from "../../../../db/schema";
import { createClickUpOrderTask } from "../../../../lib/clickup";
import { getStripeClient } from "../../../../lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) return new Response("Webhook is not configured.", { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripeClient().webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch {
    return new Response("Invalid webhook signature.", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.payment_status === "paid" && session.metadata?.product === "wifi-doktor") {
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

      const [order] = await db
        .select({ clickupTaskId: orders.clickupTaskId })
        .from(orders)
        .where(eq(orders.checkoutSessionId, session.id))
        .limit(1);

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
    }
  }
  return Response.json({ received: true });
}
