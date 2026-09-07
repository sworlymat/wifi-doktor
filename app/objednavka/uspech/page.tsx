import Link from "next/link";
import { getStripeClient } from "../../../lib/stripe";

export const dynamic = "force-dynamic";

export default async function OrderSuccess({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;
  let paid = false;
  let email: string | null = null;

  if (sessionId?.startsWith("cs_")) {
    try {
      const session = await getStripeClient().checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid" && session.metadata?.product === "wifi-doktor";
      email = session.customer_details?.email ?? null;
    } catch {
      paid = false;
    }
  }

  return <main className="orderResult"><section className="resultCard">
    <Link className="brand" href="/"><span className="brandMark">W</span><span>Wi-Fi Doktor</span></Link>
    {paid ? <><p className="resultIcon" aria-hidden="true">✓</p><p className="eyebrow"><span/> Platba ověřena</p><h1>Děkujeme za objednávku.</h1><p>Platba 299 Kč proběhla úspěšně{email ? <> pro objednávku na <strong>{email}</strong></> : null}.</p><p className="resultNote">Váš průvodce je připravený. Tento odkaz si uložte; po zapnutí e-mailů jej dostanete také do schránky.</p></> : <><p className="eyebrow"><span/> Platbu nelze ověřit</p><h1>Objednávka zatím není zaplacená.</h1><p>Vraťte se prosím k nabídce a zkuste platbu znovu.</p></>}
    <a className="primary" href={paid ? `/pruvodce?session_id=${encodeURIComponent(sessionId ?? "")}` : "/#objednat"}>{paid ? "Otevřít Wi‑Fi Doktora" : "Zkusit znovu"} <span aria-hidden="true">→</span></a>
  </section></main>;
}
