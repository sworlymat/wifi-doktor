import Link from "next/link";

export const metadata = { title: 'Ochrana soukromí | Wi-Fi Doktor', alternates: { canonical: 'https://wifi-doktor.com/ochrana-soukromi' } };

const CONTACT_EMAIL = "podpora@wifi-doktor.com";

export default function Privacy() {
  return (
    <main className="legalPage">
      <article>
        <Link className="brand" href="/">
          <span className="brandMark">W</span>
          <span>Wi‑Fi Doktor</span>
        </Link>
        <h1>Ochrana osobních údajů</h1>

        <h2>Správce osobních údajů</h2>
        <p>
          Správcem je Josef Kupilík, IČO 04190025, se sídlem č.p. 50, 330 11 Hromnice,
          Česká republika. Ve věcech osobních údajů můžete napsat na
          <a href={`mailto:${CONTACT_EMAIL}`}> {CONTACT_EMAIL}</a>.
        </p>

        <h2>Jaké údaje zpracováváme a proč</h2>
        <p>
          Při objednávce zpracováváme zejména e-mail zákazníka, identifikátor objednávky,
          částku, měnu a stav platby. Údaje používáme k uzavření a plnění smlouvy,
          ověření platby, doručení přístupu, evidenci objednávky, zákaznické podpoře
          a splnění účetních a dalších zákonných povinností.
        </p>

        <h2>Platby, evidence a příjemci</h2>
        <p>
          Platební údaje zadáváte přímo společnosti Stripe. Wi‑Fi Doktor neukládá číslo
          platební karty ani bezpečnostní kód. Pro nezbytné zpracování mohou údaje obdržet
          poskytovatel plateb Stripe, nástroj pro evidenci objednávek ClickUp, poskytovatel
          e-mailového doručení a poskytovatel hostingu. Těmto příjemcům předáváme pouze
          údaje potřebné pro daný účel.
        </p>

        <h2>Doba uchování</h2>
        <p>
          Údaje uchováváme po dobu potřebnou k vyřízení objednávky, zpřístupnění produktu,
          řešení reklamací a po dobu vyžadovanou účetními, daňovými a dalšími právními
          předpisy. Po uplynutí příslušné doby údaje vymažeme nebo anonymizujeme.
        </p>

        <h2>Vaše práva</h2>
        <p>
          Můžete požádat o přístup ke svým osobním údajům, jejich opravu, výmaz nebo
          omezení zpracování a v příslušných případech také o přenositelnost údajů nebo
          vznést námitku. Žádost pošlete na <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          Máte také právo podat stížnost u Úřadu pro ochranu osobních údajů.
        </p>

        <h2>Technické cookies</h2>
        <p>
          Stránka může používat nezbytné technické cookies potřebné pro bezpečnost,
          fungování objednávky a platebního procesu. Na stránce v současnosti nepoužíváme
          marketingové nebo reklamní sledování.
        </p>

        <h2>Základní měření návštěvnosti</h2>
        <p>
          Pro zlepšování stránky evidujeme zdroj návštěvy (pouze název odkazujícího webu
          a případné UTM označení kampaně), zobrazené části stránky, zahájení přechodu
          k platbě, největší dosaženou hloubku stránky a přibližnou dobu návštěvy.
          Neukládáme obsah formulářů, odpovědi z průvodce, celou adresu odkazující stránky,
          e-mail ani IP adresu. Náhodný identifikátor návštěvy existuje jen po dobu otevření
          stránky a neukládá se do cookies ani do místního úložiště prohlížeče. Tyto údaje
          zpracováváme v souhrnné podobě na základě oprávněného zájmu zjistit, kde návštěvníci
          potřebují lepší vysvětlení, a po vyhodnocení je odstraníme.
        </p>

        <h2>Google Analytics se souhlasem</h2>
        <p>Pokud povolíte analytiku, používáme také Google Analytics 4 od společnosti Google pro statistiky návštěvnosti a používání webu. Google může ukládat analytické cookies a zpracovávat online identifikátory, technické údaje prohlížeče a interakce s veřejnými stránkami. Tyto údaje mohou být zpracovávány i mimo Evropský hospodářský prostor podle podmínek a záruk společnosti Google. Reklamní personalizaci a Google Signals nezapínáme.</p>
        <p>Google Analytics se před souhlasem nenačítá. Naše implementace mu neposílá e-mail, odpovědi v průvodci ani osobní přístupové odkazy. Měření nezapínáme v placeném průvodci a na potvrzení objednávky. Základní vlastní měření popsané výše je samostatné.</p>
        <p>Volbu ukládáme v tomto prohlížeči na 180 dní. Souhlas můžete odmítnout nebo odvolat tlačítkem „Nastavení měření“. Odvolání zastaví další měření a odstraní dostupné cookies Google Analytics; již dříve odeslaná data tím nejsou automaticky smazána. Více: <a href="https://policies.google.com/privacy">zásady ochrany soukromí Google</a>.</p>
        <p>Tyto informace jsou účinné od 22. září 2026.</p>
      </article>
    </main>
  );
}
