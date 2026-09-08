import Link from "next/link";

const CONTACT_EMAIL = "pepik.kup@gmail.com";

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

        <p>Tyto informace jsou účinné od 8. září 2026.</p>
      </article>
    </main>
  );
}
