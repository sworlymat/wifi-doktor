export const advice = {
  "wifi-vypadava": {
    title: "Wi-Fi vypadává: jak najít příčinu výpadků",
    description: "Vypadává domácí Wi-Fi? Rozlište slabý signál, problém zařízení a výpadek přípojky pomocí jednoduchých kontrol.",
    intro: "Odpojení od Wi-Fi a výpadek internetu nejsou totéž. Telefon může zůstat připojený k routeru, i když router nemá spojení s internetem. Než začnete měnit nastavení, zjistěte, co přesně při výpadku přestane fungovat.",
    sections: [
      ["Zmizí Wi-Fi, nebo jen nejdou stránky?", "Při dalším výpadku zkontrolujte, zda zařízení stále ukazuje připojení k vaší síti. Vyzkoušejte více webů. Nefunkční jediná služba ještě neznamená výpadek celé domácí sítě."],
      ["Porovnejte dvě zařízení", "Ve stejnou chvíli vyzkoušejte telefon a počítač. Na telefonu dočasně vypněte mobilní data, aby výpadek neschovalo automatické přepnutí. Pokud zlobí jen jedno zařízení, začněte jeho připojením; pokud všechna, prověřte router a přípojku."],
      ["Vyzkoušejte připojení poblíž routeru", "Přesuňte se s týmž zařízením blíž k routeru. Pokud výpadky ustoupí, může jít o pokrytí nebo rušení. Když přetrvávají, samotné přemístění routeru nemusí stačit. Porovnání s připojením síťovým kabelem může pomoci oddělit Wi-Fi od přípojky."],
      ["Zapište si čas a rozsah výpadku", "Poznamenejte si čas, délku výpadku a dotčená zařízení. Tyto informace pomohou při ověření u poskytovatele. Bez dalšího ověření neprovádějte tovární reset routeru: můžete ztratit nastavení připojení."],
    ],
  },
  "slaby-signal-wifi": {
    title: "Slabý signál Wi-Fi v jiné místnosti: co ověřit",
    description: "Wi-Fi nedosáhne do ložnice nebo patra? Zjistěte, jak ověřit vliv zdí, umístění routeru a pokrytí, než koupíte další zařízení.",
    intro: "Slabý signál v jedné místnosti nemusí znamenat pomalou internetovou přípojku. Signál ovlivňuje vzdálenost, překážky, umístění routeru i použité zařízení. Počet čárek je jen orientační ukazatel, nikoli měření rychlosti internetu.",
    sections: [
      ["Porovnejte stejné zařízení na dvou místech", "Vyzkoušejte stejnou činnost nejprve blízko routeru a potom v problémové místnosti. Ostatní podmínky držte podobné. Výrazné zlepšení poblíž routeru je stopou k pokrytí, nikoli jistým důkazem, že je přípojka bez chyby."],
      ["Zkontrolujte umístění routeru", "Router zavřený ve skříni, na zemi nebo za televizí může mít horší podmínky pro šíření signálu. Pokud to kabely bezpečně dovolí, vyzkoušejte otevřenější, vyvýšené místo. Nezakrývejte větrací otvory a nemanipulujte s optickým zakončením přípojky."],
      ["Zvažte překážky a pásmo", "Zdi a stropy mohou dosah výrazně omezit. Pásmo 2,4 GHz obvykle dosáhne dál než 5 GHz, ale může být více rušené; 5 GHz může nabídnout vyšší rychlost poblíž routeru. Výsledek závisí na konkrétním prostředí a zařízení."],
      ["Další zařízení vybírejte až po kontrole", "Opakovač umístěný až v místě téměř bez signálu často nepomůže dostatečně. Mesh ani nový router automaticky nevyřeší každou situaci. Nejdřív zjistěte, kde je ještě stabilní spojení a zda lze využít kabelové připojení dalšího přístupového bodu."],
    ],
  },
  "pomala-wifi": {
    title: "Pomalá Wi-Fi: jak odlišit síť, zařízení a přípojku",
    description: "Pomalé načítání a sekající se video? Projděte základní kontroly Wi-Fi a zjistěte, co porovnat před výměnou routeru.",
    intro: "Pomalé načítání může způsobit domácí Wi-Fi, vytížená přípojka, konkrétní zařízení i samotná služba. Jediný test rychlosti zpravidla nestačí k určení příčiny. Užitečnější je porovnat stejné podmínky na více místech a zařízeních.",
    sections: [
      ["Ověřte, zda je pomalé všechno", "Vyzkoušejte jiný web nebo video a potom druhé zařízení. Pokud se problém týká jen jedné aplikace, nejprve prověřte ji. Pokud všechna zařízení právě stahují aktualizace nebo zálohy, může být přípojka dočasně vytížená."],
      ["Porovnejte rychlost u routeru a dál od něj", "Použijte stejné zařízení a stejný test. Pozastavte vlastní velká stahování a na telefonu vypněte mobilní data. Výsledek si zapište spolu s místem a časem. Při porovnávání měňte vždy jen jednu podmínku."],
      ["Pokud můžete, porovnejte Wi-Fi s kabelem", "Připojte vhodný počítač síťovým kabelem k LAN portu routeru. Výrazně lepší výsledek po kabelu ukazuje spíše na bezdrátovou část. Špatný výsledek u obou způsobů může souviset s routerem, vytížením nebo přípojkou; sám o sobě neurčuje viníka."],
      ["Sledujte opakování problému", "Je rozdíl mezi jedním pomalým večerem a pravidelným zhoršením každý den. Několik srovnatelných měření pomůže při další diagnostice i při komunikaci s poskytovatelem. Neobjednávejte vyšší tarif, dokud nevíte, co vás omezuje."],
    ],
  },
} as const;
