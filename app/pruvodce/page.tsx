import { verifyAccess } from "../../lib/access";
import Guide from "./Guide";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function GuidePage({searchParams}:{searchParams:Promise<{session_id?:string}>}) {
  const {session_id:sessionId}=await searchParams;
  const result = await verifyAccess(sessionId);
  if (result.state === "unavailable" || result.state === "pending") return <main className="orderResult"><section className="resultCard"><h1>Přístup teď nelze ověřit.</h1><p>Neplaťte znovu. Platba se ještě zpracovává nebo ověření dočasně neodpovídá.</p><a className="primary" href={`/pruvodce?session_id=${encodeURIComponent(sessionId ?? "")}`}>Znovu ověřit přístup</a></section></main>;
  if(result.state !== "paid") return <main className="orderResult"><section className="resultCard"><a className="brand" href="/"><span className="brandMark">W</span><span>Wi‑Fi Doktor</span></a><p className="eyebrow"><span/> Přístup není ověřen</p><h1>Průvodce je pro zákazníky.</h1><p>Otevřete odkaz z potvrzení objednávky, nebo si průvodce nejprve zakupte.</p><a className="primary" href="/#objednat">Získat průvodce →</a></section></main>;

  return <main className="guidePage"><header className="guideHeader"><a className="brand" href="/"><span className="brandMark">W</span><span>Wi‑Fi Doktor</span></a><span>Zakoupený přístup</span></header><Guide/></main>;
}
