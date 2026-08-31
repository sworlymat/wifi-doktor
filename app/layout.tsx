import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
export async function generateMetadata():Promise<Metadata>{
  const h=await headers();
  const host=h.get("x-forwarded-host")??h.get("host")??"localhost:3000";
  const protocol=h.get("x-forwarded-proto")??(host.startsWith("localhost")?"http":"https");
  const image=`${protocol}://${host}/og.png`;
  const title="Wi‑Fi Doktor | Opravte si domácí Wi‑Fi krok za krokem";
  const description="Interaktivní průvodce, který pomůže zjistit, proč Wi‑Fi zlobí, a ukáže co přesně udělat. Bez technických znalostí.";
  return {title,description,openGraph:{title,description,images:[image]},twitter:{card:"summary_large_image",title,description,images:[image]}};
}
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="cs"><body>{children}</body></html>}
