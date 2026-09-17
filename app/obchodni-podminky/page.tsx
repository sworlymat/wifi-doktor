import Link from "next/link";

const CONTACT_EMAIL = "pepik.kup@gmail.com";

export default function Terms() {
  return (
    <main className="legalPage">
      <article>
        <Link className="brand" href="/">
          <span className="brandMark">W</span>
          <span>Wi‑Fi Doktor</span>
        </Link>
        <h1>Obchodní podmínky</h1>

        <h2>Prodávající</h2>
        <p>
          Josef Kupilík, IČO 04190025, se sídlem č.p. 50, 330 11 Hromnice,
          Česká republika. Kontaktní e-mail: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2>Produkt a cena</h2>
        <p>
          Wi‑Fi Doktor je digitální interaktivní průvodce pro řešení běžných problémů
          domácí Wi‑Fi. Cena jednorázového přístupu je 299 Kč. Nejde o předplatné.
          Konečná cena je zákazníkovi zobrazena před odesláním platby.
        </p>

        <h2>Objednávka a platba</h2>
        <p>
          Objednávka se uskutečňuje přes tuto webovou stránku a platba probíhá
          prostřednictvím zabezpečené platební brány Stripe. Smlouva je uzavřena
          dokončením objednávky a úspěšným přijetím platby.
        </p>

        <h2>Doručení</h2>
        <p>
          Přístup je zpřístupněn po úspěšném ověření platby na potvrzovací stránce.
          Odkaz na přístup může být zaslán také na e-mail uvedený zákazníkem při platbě.
          Pokud odkaz po zaplacení nefunguje, zákazník kontaktuje prodávajícího na
          e-mailu <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> a uvede e-mail
          použitý při objednávce.
        </p>

        <h2>Reklamace</h2>
        <p>
          Vadu digitálního obsahu nebo problém s přístupem lze reklamovat na e-mailu
          <a href={`mailto:${CONTACT_EMAIL}`}> {CONTACT_EMAIL}</a>. Prodávající reklamaci
          posoudí a vyřídí bez zbytečného odkladu v zákonné lhůtě. Reklamace nemá vliv
          na práva spotřebitele, která mu přiznávají právní předpisy.
        </p>

        <h2>Dobrovolná 14denní garance vrácení peněz</h2>
        <p>
          Nad rámec zákonných práv poskytuje prodávající zákazníkovi dobrovolnou
          garanci spokojenosti. Pokud zákazník do 14 dnů od zaplacení zjistí, že mu
          Wi‑Fi Doktor nevyhovuje, může z e-mailové adresy použité při objednávce napsat
          na <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> a požádat o vrácení
          peněz. Důvod uvádět nemusí; pro dohledání platby stačí e-mail použitý při nákupu
          nebo identifikace objednávky. Po ověření objednávky prodávající vrátí celou
          uhrazenou cenu stejnou platební metodou, a to bez zbytečného odkladu, nejpozději
          do 14 dnů od obdržení žádosti. Tato dobrovolná garance nijak neomezuje zákonná
          práva spotřebitele, zejména práva z vadného plnění ani případné právo na
          odstoupení od smlouvy.
        </p>

        <h2>Odpovědnost</h2>
        <p>
          Průvodce poskytuje bezpečné diagnostické postupy, ale nemůže zaručit odstranění
          každé závady. Uživatel provádí doporučené kroky vědomě; pokud si není jistý,
          má postup zastavit a obrátit se na poskytovatele internetu nebo technika.
        </p>

        <h2>Digitální obsah a odstoupení</h2>
        <p>
          Právo spotřebitele odstoupit od smlouvy se řídí platnými právními předpisy.
          K zániku práva odstoupit před uplynutím zákonné lhůty může dojít pouze tehdy,
          pokud zákazník před zpřístupněním digitálního obsahu udělí výslovný souhlas
          s okamžitým plněním a vezme na vědomí, že tím právo odstoupit ztrácí.
        </p>

        <h2>Mimosoudní řešení spotřebitelských sporů</h2>
        <p>
          Pokud se spotřebitelský spor nepodaří vyřešit přímo s prodávajícím, může
          spotřebitel podat návrh na mimosoudní řešení České obchodní inspekci,
          Ústřední inspektorát – oddělení ADR, Gorazdova 1969/24, 120 00 Praha 2,
          e-mail adr@coi.gov.cz. Podrobnosti jsou na webu
          <a href="https://coi.gov.cz/informace-o-adr/"> coi.gov.cz/informace-o-adr/</a>.
        </p>

        <p>Tyto podmínky jsou účinné od 17. září 2026.</p>
      </article>
    </main>
  );
}
