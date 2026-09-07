import { getStripeClient } from "../../../lib/stripe";
import { getDb } from "../../../db";
import { orders } from "../../../db/schema";
import { SITE_ORIGIN } from "../../../lib/site";

export const runtime = "nodejs";

function integrationIdentifier() {
  const suffix = Array.from(crypto.getRandomValues(new Uint8Array(8)), (value) =>
    String.fromCharCode(97 + (value % 26)),
  ).join("");
  return `wifi_doktor_${suffix}`;
}

export async function POST(request: Request) {
  const origin = SITE_ORIGIN;
  const source = request.headers.get("origin");
  if (source && source !== new URL(request.url).origin) return new Response("Forbidden", { status: 403 });
  try {
    const session = await getStripeClient().checkout.sessions.create({
      mode: "payment",
      integration_identifier: integrationIdentifier(),
      line_items: [{
        price_data: {
          currency: "czk",
          unit_amount: 29900,
          product_data: {
            name: "Wi-Fi Doktor",
            description: "Jednorázový přístup k interaktivnímu průvodci domácí Wi-Fi",
          },
        },
        quantity: 1,
      }],
      customer_creation: "always",
      billing_address_collection: "auto",
      success_url: `${origin}/objednavka/uspech?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled#objednat`,
      metadata: { product: "wifi-doktor", access: "one-time" },
    });
    if (!session.url) throw new Error("Stripe did not return a Checkout URL.");
    await getDb().insert(orders).values({
      checkoutSessionId: session.id,
      product: "wifi-doktor",
      amountTotal: session.amount_total ?? 29900,
      currency: session.currency ?? "czk",
      customerEmail: session.customer_details?.email ?? null,
      stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
    }).onConflictDoNothing();
    return Response.redirect(session.url, 303);
  } catch (error) {
    console.error("Unable to create Stripe Checkout Session", { type: error instanceof Error ? error.name : "Unknown error" });
    return Response.redirect(`${origin}/?checkout=error#objednat`, 303);
  }
}
