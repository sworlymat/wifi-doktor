import { getStripeClient } from "./stripe";

export async function verifyAccess(sessionId: unknown): Promise<{
  state: "paid" | "unpaid" | "pending" | "unavailable";
  email?: string | null;
}> {
  if (typeof sessionId !== "string" || !/^cs_(test_|live_)?[A-Za-z0-9]+$/.test(sessionId) || sessionId.length > 255) return { state: "unpaid" };
  try {
    const session = await getStripeClient().checkout.sessions.retrieve(sessionId);
    const allowedAmounts = [29900, 59000];
    if (session.metadata?.product !== "wifi-doktor" || session.mode !== "payment" || !allowedAmounts.includes(session.amount_total ?? 0) || session.currency !== "czk") return { state: "unpaid" };
    return { state: session.payment_status === "paid" ? "paid" : session.status === "complete" ? "pending" : "unpaid", email: session.customer_details?.email };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "resource_missing") return { state: "unpaid" };
    return { state: "unavailable" };
  }
}
