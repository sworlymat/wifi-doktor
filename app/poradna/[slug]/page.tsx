import Link from "next/link";
import { notFound } from "next/navigation";
import { advice } from "../../../lib/advice";
import { SITE_ORIGIN } from "../../../lib/site";

function article(slug: string) { return Object.prototype.hasOwnProperty.call(advice, slug) ? advice[slug as keyof typeof advice] : undefined; }
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }) {
  const {slug} = await params; const item = article(slug); if (!item) return {};
  return { title: item.title + " | Wi-Fi Doktor", description: item.description, alternates: {canonical: SITE_ORIGIN + "/poradna/" + slug}, openGraph: {title:item.title,description:item.description,url:SITE_ORIGIN + "/poradna/" + slug,type:"article",locale:"cs_CZ"} };
}
export default async function AdvicePage({params}: {params: Promise<{slug:string}>}) {
  const {slug} = await params; const item = article(slug); if (!item) notFound();
  const structured = {"@context":"https://schema.org","@type":"Article",headline:item.title,description:item.description,inLanguage:"cs",mainEntityOfPage:SITE_ORIGIN+"/poradna/"+slug,author:{"@type":"Organization",name:"Wi-Fi Doktor",url:SITE_ORIGIN}};
  return <main className="legalPage"><article>
    <Link className="brand" href="/">Wi-Fi Doktor</Link>
    <p className="eyebrow">Poradna pro domácí Wi-Fi</p><h1>{item.title}</h1><p>{item.intro}</p>
    {item.sections.map(([title,text])=><section key={title}><h2>{title}</h2><p>{text}</p></section>)}
    <h2>Chcete zjistit, kde začít u vás doma?</h2><p>Vyzkoušejte bezplatnou předdiagnostiku se čtyřmi otázkami. Výsledek je orientační; nic ve vaší síti nemění.</p>
    <p><Link className="primary" href="/#prediagnostika">Spustit předdiagnostiku zdarma →</Link></p>
    <p>Kompletní Wi-Fi Doktor BASIC nabízí postup krok za krokem za 299 Kč. Doživotní přístup získáte ihned po zaplacení a odkaz také e-mailem.</p>
    <p><Link href="/#objednat">Prohlédnout nabídku Wi-Fi Doktora →</Link></p>
    <h2>Související návody</h2><ul>{Object.entries(advice).filter(([key])=>key!==slug).map(([key,value])=><li key={key}><Link href={"/poradna/"+key}>{value.title}</Link></li>)}</ul>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,"\\u003c")}} />
  </article></main>;
}
