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
    {paid ? <><p className="resultIcon" aria-hidden="true">✓</p><p className="eyebrow"><span/> Platba ověřena</p><h1>Děkujeme za objednávku.</h1><p>Platba 299 Kč proběhla úspěšně{email ? <>. Potvrzení jsme poslali na <strong>{email}</strong></> : null}.</p><p className="resultNote">Váš přístup k průvodci nyní připravujeme.</p></> : <><p className="eyebrow"><span/> Platbu nelze ověřit</p><h1>Objednávka zatím není zaplacená.</h1><p>Vraťte se prosím k nabídce a zkuste platbu znovu.</p></>}
    <Link className="primary" href={paid ? "/" : "/#objednat"}>{paid ? "Zpět na hlavní stránku" : "Zkusit znovu"} <span aria-hidden="true">→</span></Link>
  </section></main>;
}
