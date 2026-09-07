import Stripe from "stripe";

let stripeClient: Stripe | undefined;

export function getStripeClient() {
  const apiKey = process.env.STRIPE_RESTRICTED_KEY;
  if (!apiKey) throw new Error("Stripe is not configured.");

  stripeClient ??= new Stripe(apiKey, { apiVersion: "2026-07-29.dahlia", timeout: 10000, maxNetworkRetries: 1 });
  return stripeClient;
}
