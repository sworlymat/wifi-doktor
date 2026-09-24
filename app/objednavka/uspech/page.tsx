import { verifyAccess } from "../../../lib/access";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function OrderSuccess({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;
  const result = await verifyAccess(sessionId);
  const paid = result.state === "paid";
  const email = result.email;
  const isPremium = Boolean(result.isPremium);

  if (result.state === "unavailable" || result.state === "pending") return <main className="orderResult"><section className="resultCard"><h1>Platbu zatím nelze potvrdit.</h1><p>Platba se ještě zpracovává nebo ověření dočasně neodpovídá. Neplaťte znovu, zkuste za chvíli obnovit tuto stránku.</p><a className="primary" href={`/objednavka/uspech?session_id=${encodeURIComponent(sessionId ?? "")}`}>Znovu ověřit platbu</a></section></main>;
  return <main className="orderResult"><section className="resultCard">
    <a className="brand" href="/"><span className="brandMark">W</span><span>Wi-Fi Doktor</span></a>
    {paid ? <>
      <p className="resultIcon" aria-hidden="true">✓</p>
      <p className="eyebrow"><span/> Platba ověřena · {isPremium ? "Kompletní balíček s asistencí" : "Základní balíček"}</p>
      <h1>Děkujeme za objednávku.</h1>
      <p>Platba proběhla úspěšně{email ? <> pro objednávku na <strong>{email}</strong></> : null}.</p>
      <p className="resultNote">Váš průvodce je připravený. Uložte si jeho adresu do záložek — je to váš osobní přístup, který nesdílejte s ostatními.</p>
      {isPremium ? (
        <div className="whatsappHelpBox">
          <p><strong>📱 Vaše SOS asistence technika je aktivní</strong></p>
          <p>Máte zakoupenou verzi s asistencí. Případné problémy s Wi‑Fi řešíme v kooperaci s bezplatnou aplikací <strong><a href="https://wifiman.com" target="_blank" rel="noopener noreferrer">WiFiman (wifiman.com)</a></strong>.</p>
          <div className="wifimanBox">
            <p><strong>📶 Jak postupovat při diagnostice:</strong></p>
            <p>Stáhněte si do mobilu aplikaci <a href="https://wifiman.com" target="_blank" rel="noopener noreferrer"><strong>WiFiman</strong></a> (dostupná zdarma pro iOS i Android). Změřte v ní signál či rychlost a snímek obrazovky pošlete technikovi na WhatsApp spolu s fotkou vašeho routeru a kontrolek. Technik situaci vyhodnotí:</p>
          </div>
          <div className="premiumActionsRow">
            <a
              href="https://wa.me/420775278813"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsappConnectBtn"
            >
              💬 Otevřít WhatsApp s technikem (+420 775 278 813)
            </a>
            <a
              href="https://wifiman.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ghost wifimanBtn"
            >
              📶 Stáhnout aplikaci WiFiman (wifiman.com) ↗
            </a>
          </div>
        </div>
      ) : null}
    </> : <>
      <p className="eyebrow"><span/> Platbu nelze ověřit</p>
      <h1>Objednávka zatím není zaplacená.</h1>
      <p>Pokud jste již zaplatili, otevřete původní odkaz z potvrzení objednávky. Jinak se vraťte k nabídce.</p>
    </>}
    <a className="primary" href={paid ? `/pruvodce?session_id=${encodeURIComponent(sessionId ?? "")}` : "/#objednat"}>{paid ? "Otevřít Wi‑Fi Doktora" : "Zkusit znovu"} <span aria-hidden="true">→</span></a>
  </section></main>;
}
