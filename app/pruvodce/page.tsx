import Link from "next/link";
import { getStripeClient } from "../../lib/stripe";
import Guide from "./Guide";

export const dynamic = "force-dynamic";

export default async function GuidePage({searchParams}:{searchParams:Promise<{session_id?:string}>}) {
  const {session_id:sessionId}=await searchParams;
  let paid=false;
  if(sessionId?.startsWith("cs_")) try {
    const session=await getStripeClient().checkout.sessions.retrieve(sessionId);
    paid=session.payment_status==="paid"&&session.metadata?.product==="wifi-doktor";
  } catch { paid=false; }

  if(!paid) return <main className="orderResult"><section className="resultCard"><Link className="brand" href="/"><span className="brandMark">W</span><span>Wi‑Fi Doktor</span></Link><p className="eyebrow"><span/> Přístup není ověřen</p><h1>Průvodce je pro zákazníky.</h1><p>Otevřete odkaz z potvrzení objednávky, nebo si průvodce nejprve zakupte.</p><Link className="primary" href="/#objednat">Získat průvodce →</Link></section></main>;

  return <main className="guidePage"><header className="guideHeader"><Link className="brand" href="/"><span className="brandMark">W</span><span>Wi‑Fi Doktor</span></Link><span>Zakoupený přístup</span></header><Guide/></main>;
}
