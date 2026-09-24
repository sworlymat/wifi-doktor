import { verifyAccess } from "../../../lib/access";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function OrderSuccess({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;
  const result = await verifyAccess(sessionId);
  const paid = result.state === "paid";
  const email = result.email;
  if (result.state === "unavailable" || result.state === "pending") return <main className="orderResult"><section className="resultCard"><h1>Platbu zatím nelze potvrdit.</h1><p>Platba se ještě zpracovává nebo ověření dočasně neodpovídá. Neplaťte znovu, zkuste za chvíli obnovit tuto stránku.</p><a className="primary" href={`/objednavka/uspech?session_id=${encodeURIComponent(sessionId ?? "")}`}>Znovu ověřit platbu</a></section></main>;
  return <main className="orderResult"><section className="resultCard">
    <a className="brand" href="/"><span className="brandMark">W</span><span>Wi-Fi Doktor</span></a>
    {paid ? <><p className="resultIcon" aria-hidden="true">✓</p><p className="eyebrow"><span/> Platba ověřena</p><h1>Děkujeme za objednávku.</h1><p>Platba proběhla úspěšně{email ? <> pro objednávku na <strong>{email}</strong></> : null}.</p><p className="resultNote">Váš průvodce je připravený. Uložte si jeho adresu do záložek — je to váš osobní přístup, který nesdílejte s ostatními.</p><div className="whatsappHelpBox"><p><strong>📱 Potřebujete poradit s technikem?</strong></p><p>Pokud jste zvolili balíček s asistencí (nebo budete mít jakýkoli dotaz), pošlete fotku svého routeru, kabelů či kontrolek na e-mail <strong>pepik.kup@gmail.com</strong> nebo na WhatsApp. Technik vaši situaci projde a odpoví do 24 hodin.</p></div></> : <><p className="eyebrow"><span/> Platbu nelze ověřit</p><h1>Objednávka zatím není zaplacená.</h1><p>Pokud jste již zaplatili, otevřete původní odkaz z potvrzení objednávky. Jinak se vraťte k nabídce.</p></>}
    <a className="primary" href={paid ? `/pruvodce?session_id=${encodeURIComponent(sessionId ?? "")}` : "/#objednat"}>{paid ? "Otevřít Wi‑Fi Doktora" : "Zkusit znovu"} <span aria-hidden="true">→</span></a>
  </section></main>;
}
