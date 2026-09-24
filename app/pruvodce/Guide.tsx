"use client";

import { useState, useEffect } from "react";

export const complaintTemplate = `Dobrý den,

po nezávislé diagnostice domácí sítě hlásím opakovanou nestabilitu internetového připojení. Lokální Wi-Fi síť i připojená zařízení v domácnosti byly prověřeny a pracují v normě.

Diagnostika ukazuje:
• Výpadky odezvy přímo na výchozí bráně modemu
• Packet loss vyšší než přijatelná mez při zachované funkčnosti Wi-Fi

Závada se s vysokou pravděpodobností nachází na přívodní trase před účastnickým modemem.

Žádám o prověření spojení na vaší straně. Vzhledem k tomu, že jde o závadu mimo moji domácí síť, žádám o řešení bez účtování poplatku za výjezd technika.

Děkuji za vyřízení.`;

export type AlertBox = {
  type: "good" | "tip" | "warn" | "danger" | "why";
  title?: string;
  text: string;
};

export type OptionItem = {
  to: string;
  icon: string;
  title: string;
  desc?: string;
};

export type StepItem = [string, string]; // [bold title, explanation]

export type MiniCard = {
  kicker?: string;
  title: string;
  desc: string;
};

export type ScreenDef = {
  id: string;
  top: [string, string];
  title: string;
  sub?: string;
  boxes?: AlertBox[];
  steps?: StepItem[];
  options?: OptionItem[];
  grid2?: MiniCard[];
  table?: { headers: string[]; rows: string[][] };
  buttons?: { to: string; label: string; type?: "btn" | "ghost" | "back" }[];
  back?: string;
  chips?: string[];
  isIspScreen?: boolean;
  isSolvedScreen?: boolean;
};

export const SCREENS: Record<string, ScreenDef> = {
  start: {
    id: "start",
    top: ["Start", "Pro běžného uživatele"],
    title: "Oprav si domácí Wi‑Fi sám.",
    sub: "Bez síťařského slovníku. Vyber, co se děje, a Wi‑Fi Doktor tě povede po jedné bezpečné změně až k výsledku.",
    options: [
      { to: "new", icon: "📦", title: "Koupil jsem nový router", desc: "Zapojení, zabezpečení, Wi‑Fi a kontrola" },
      { to: "slow", icon: "🐌", title: "Wi‑Fi je pomalá", desc: "Zjistíme, zda je problém v přípojce, Wi‑Fi nebo zařízení" },
      { to: "drops", icon: "📶", title: "Wi‑Fi vypadává", desc: "Odpojování, rušení, roaming a problémové zařízení" },
      { to: "coverage", icon: "🏠", title: "V části domu nemám signál", desc: "Umístění, pásma, AP/mesh" },
      { to: "device", icon: "📱", title: "Problém má jen jedno zařízení", desc: "Telefon, notebook, TV nebo chytrá domácnost" },
      { to: "multiple", icon: "🧩", title: "Mám více routerů / mesh / AP", desc: "Dvojitý DHCP, router vs AP, backhaul" },
      { to: "terms", icon: "💡", title: "Chci jen pochopit pojmy", desc: "2,4 GHz, 5 GHz, 5G, kanál, steering, mesh" },
    ],
    boxes: [
      {
        type: "tip",
        title: "Zlaté pravidlo:",
        text: "před změnou si vyfoť původní stav. Měň vždy jen jednu věc → otestuj → teprve potom pokračuj.",
      },
    ],
  },
  new: {
    id: "new",
    top: ["Nový router · 1/5", "Příprava"],
    title: "Co přesně zapojuješ?",
    sub: "Nejdřív si ujasníme, jestli je zařízení hlavní router, nebo jen další Wi‑Fi bod.",
    options: [
      { to: "new-main", icon: "🌐", title: "Hlavní router", desc: "Do něj vede internet od poskytovatele" },
      { to: "new-ap", icon: "📡", title: "Další Wi‑Fi bod / druhý router", desc: "Internet už doma funguje přes jiný router" },
      { to: "new-mesh", icon: "🕸️", title: "Mesh sada", desc: "Např. Deco nebo jiná sada více jednotek" },
    ],
    back: "start",
  },
  "new-main": {
    id: "new-main",
    top: ["Nový router · 2/5", "Hlavní zařízení"],
    title: "Základní bezpečné zapojení",
    steps: [
      ["Internetový kabel zapoj do WAN / Internet portu.", "LAN porty jsou pro zařízení uvnitř domácnosti."],
      ["Připoj se k routeru kabelem nebo na výchozí Wi‑Fi ze štítku.", "Štítek s údaji najdeš zespodu routeru."],
      ["Otevři administraci podle štítku nebo návodu výrobce.", "Bývá to adresa jako 192.168.0.1 nebo tplinkwifi.net."],
      ["Nastav nové administrátorské heslo.", "Nepoužívej stejné heslo jako k Wi‑Fi."],
    ],
    boxes: [
      {
        type: "warn",
        title: "WAN parametry:",
        text: "pokud poskytovatel vyžaduje PPPoE, statickou IP, VLAN nebo specifickou MAC, musíš použít údaje od něj. Wi‑Fi Doktor je nesmí hádat.",
      },
    ],
    buttons: [{ to: "security", label: "Pokračovat k Wi‑Fi →", type: "btn" }],
    back: "new",
  },
  "new-ap": {
    id: "new-ap",
    top: ["Nový router · 2/5", "Druhý bod"],
    title: "Druhý router obvykle nemá dělat druhou síť",
    boxes: [
      {
        type: "good",
        title: "Cíl:",
        text: "pokud už jeden hlavní router rozdává internet a adresy, další zařízení má většinou fungovat jako AP / Access Point.",
      },
    ],
    steps: [
      ["Najdi režim Access Point / AP Mode / Bridge.", "Tento režim vypne routování a předávání adres."],
      ["Pokud AP režim není, nevytvářej druhý DHCP server.", "Vypnutí DHCP zabrání konfliktům v síti."],
      ["Propoj zařízení ideálně kabelem.", "Kabelový backhaul bývá stabilnější než bezdrátové opakování."],
    ],
    boxes2: [
      {
        type: "danger",
        title: "Pozor:",
        text: "dva DHCP servery v jedné LAN mohou způsobovat náhodné připojování, špatné adresy a těžko předvídatelné výpadky.",
      },
    ],
    buttons: [{ to: "security", label: "Nastavit Wi‑Fi →", type: "btn" }],
    back: "new",
  },
  "new-mesh": {
    id: "new-mesh",
    top: ["Nový router · 2/5", "Mesh systém"],
    title: "Mesh nastav jako jeden systém",
    sub: "Mesh dává smysl tam, kde jeden bod nestačí. Nejlepší výsledek obvykle získáš, když jednotky mají kvalitní spoj mezi sebou.",
    steps: [
      ["První jednotku dej k hlavní přípojce.", "Ta bude fungovat jako řídicí bod sítě."],
      ["Další jednotky neumisťuj až do místa, kde už není skoro žádný signál.", "Uzel potřebuje slyšet hlavní jednotku silně."],
      ["Pokud můžeš, použij ethernetový backhaul.", "Propojení kabelem zachová 100% rychlost pro bezdrátové klienty."],
      ["Nevytvářej vedle mesh systému další nezávislou Wi‑Fi se stejným účelem.", "Vypni Wi-Fi na starém modemu, ať se neruší."],
    ],
    buttons: [{ to: "security", label: "Pokračovat →", type: "btn" }],
    back: "new",
  },
  security: {
    id: "security",
    top: ["Nový router · 3/5", "Zabezpečení"],
    title: "Název, heslo a zabezpečení",
    steps: [
      ["Nastav vlastní název Wi‑Fi (SSID).", "Zvol jednoduchý název bez diakritiky."],
      ["Použij dlouhé unikátní heslo.", "Ideální je věta nebo 4 náhodná slova, např. 'cervena-ryba-plave-rychle'."],
      ["Zabezpečení:", "preferuj WPA2‑AES nebo WPA2/WPA3 podle podpory zařízení."],
      ["Nepoužívej WEP ani TKIP.", "Tyto staré protokoly jsou prolomitelné během několika minut."],
    ],
    boxes: [
      {
        type: "why",
        title: "Proč nevnucujeme WPA3:",
        text: "starší TV, tiskárny a IoT zařízení ho nemusí zvládat. Produkt má být funkční, ne ideologicky „nejnovější“.",
      },
    ],
    buttons: [{ to: "bands", label: "Pásma 2,4 / 5 GHz →", type: "btn" }],
    back: "new-main",
  },
  bands: {
    id: "bands",
    top: ["Nový router · 4/5", "Frekvence"],
    title: "2,4 GHz, 5 GHz a steering",
    grid2: [
      { kicker: "2,4 GHz", title: "Větší dosah", desc: "Více rušení, méně prostoru. U hustého okolí často dává smysl šířka 20 MHz." },
      { kicker: "5 GHz", title: "Vyšší kapacita", desc: "Výrazně vyšší rychlost a volné kanály, ale hůř prochází zdmi." },
    ],
    boxes: [
      {
        type: "tip",
        title: "Band steering / Smart Connect:",
        text: "není automaticky špatně. U moderních telefonů může být pohodlný. Když ale některé IoT zařízení nebo roaming zlobí, je užitečné pásma dočasně oddělit a problém izolovat.",
      },
      {
        type: "why",
        title: "5 GHz ≠ mobilní 5G.",
        text: "Je to jen frekvenční pásmo Wi‑Fi, nikoliv mobilní síť.",
      },
    ],
    buttons: [{ to: "router-select", label: "Vybrat značku routeru →", type: "btn" }],
    back: "security",
  },
  slow: {
    id: "slow",
    top: ["Diagnostika", "Pomalá Wi‑Fi"],
    title: "Je pomalý internet, nebo jen Wi‑Fi?",
    options: [
      { to: "near", icon: "📶", title: "U routeru je rychlost dobrá, dál ne", desc: "Pravděpodobně pokrytí / pásmo / překážky" },
      { to: "wired", icon: "🔌", title: "Je to pomalé i těsně u routeru", desc: "Porovnáme Wi‑Fi a kabel" },
      { to: "device", icon: "📱", title: "Pomalé je jen jedno zařízení", desc: "Nejdřív řešíme klienta" },
    ],
    back: "start",
  },
  drops: {
    id: "drops",
    top: ["Diagnostika", "Výpadky"],
    title: "Co přesně vypadává?",
    options: [
      { to: "drops-all", icon: "📡", title: "Více zařízení se odpojí současně", desc: "Router, přípojka, rušení nebo DHCP" },
      { to: "device", icon: "📱", title: "Vypadává jen jedno zařízení", desc: "Klient, ovladač, úspora energie, roaming" },
      { to: "iot", icon: "💡", title: "Zlobí hlavně chytrá zařízení / IoT", desc: "2,4 GHz, steering, kompatibilita" },
    ],
    back: "start",
  },
  "drops-all": {
    id: "drops-all",
    top: ["Výpadky · 2/5", "Hromadný výpadek"],
    title: "Při výpadku zůstane zařízení připojené k Wi‑Fi?",
    options: [
      { to: "wancheck", icon: "🌐", title: "Ano, Wi‑Fi svítí, ale internet nejde", desc: "Prověříme WAN / poskytovatele / DNS" },
      { to: "near", icon: "📶", title: "Ne, zařízení se od Wi‑Fi odpojí", desc: "Pokrytí, rušení, roaming nebo router" },
      { to: "multiple", icon: "🧩", title: "Mám doma více routerů / AP", desc: "Prověříme síťovou topologii a DHCP" },
    ],
    back: "drops",
  },
  wancheck: {
    id: "wancheck",
    top: ["Výpadky", "WAN kontrola"],
    title: "Ověř, zda výpadek vzniká před Wi‑Fi",
    steps: [
      ["Při výpadku zkus administraci routeru.", "Pokud se do routeru dostaneš, lokální Wi‑Fi/LAN je v pořádku a problém je v internetu."],
      ["Pokud můžeš, otestuj zařízení kabelem.", "Zda internet nejde ani po drátu."],
      ["Zkontroluj stav WAN / Internet v routeru.", "Sleduj kontrolku se symbolem zeměkoule nebo nápisem Internet/WAN."],
    ],
    boxes: [
      {
        type: "warn",
        text: "Pokud internet nejde zároveň přes kabel i Wi‑Fi, nezačínej přelaďovat kanály. Nejdřív řeš WAN/přípojku.",
      },
    ],
    buttons: [
      { to: "isp", label: "Přípojka je špatná →", type: "btn" },
      { to: "wifi-env", label: "Kabel funguje, Wi‑Fi ne →", type: "ghost" },
    ],
    back: "drops-all",
  },
  wired: {
    id: "wired",
    top: ["Diagnostika · 2/5", "Kabelový test"],
    title: "Porovnej Wi‑Fi s kabelem",
    sub: "Pokud máš notebook nebo PC s LAN portem, připoj ho na chvíli přímo k routeru.",
    options: [
      { to: "wifi-env", icon: "✅", title: "Přes kabel je internet v pořádku", desc: "Řešíme Wi‑Fi část a rušení" },
      { to: "isp", icon: "❌", title: "Přes kabel je to také špatné", desc: "Řešíme přípojku / WAN operátora" },
      { to: "wifi-env", icon: "🙅", title: "Kabel nemám", desc: "Pokračujeme opatrně přes Wi‑Fi" },
    ],
    back: "slow",
  },
  isp: {
    id: "isp",
    top: ["Výsledek diagnostiky", "Poskytovatel"],
    title: "Nejdřív řeš internetovou přípojku",
    boxes: [
      {
        type: "warn",
        title: "Wi‑Fi Doktor se tady zastavuje schválně.",
        text: "Pokud je problém i přes kabel, přelaďování Wi‑Fi není hlavní řešení. Zbytečně byste ztráceli čas.",
      },
    ],
    steps: [
      ["Restartuj modem/router jednou.", "Odpoj ze zásuvky na 30 sekund a zapoj zpět."],
      ["Zkontroluj WAN kabel a napájení.", "Kabel od antény či optiky musí pevně zacvaknout."],
      ["Ověř stav služby u poskytovatele.", "Zkontroluj stránku výpadků operátora nebo SMS hlášení."],
      ["Pokud WAN opakovaně padá, kontaktuj poskytovatele.", "Použij níže připravený vzor stížnosti, ať ti neúčtují zbytečný výjezd."],
    ],
    isIspScreen: true,
    buttons: [{ to: "start", label: "Zpět na začátek", type: "btn" }],
    back: "wancheck",
  },
  near: {
    id: "near",
    top: ["Pokrytí · 1/4", "Signál vs Přípojka"],
    title: "Když je to dobré u routeru a špatné dál…",
    boxes: [
      {
        type: "good",
        text: "Tohle je silný signál, že samotná internetová přípojka je v pořádku. Řešíme rádiovou cestu mezi routerem a zařízením.",
      },
    ],
    options: [
      { to: "placement", icon: "📍", title: "Zkontrolovat umístění routeru", desc: "Překážky, nábytek, kov, výška" },
      { to: "band-distance", icon: "2️⃣", title: "Zkontrolovat 2,4 / 5 GHz", desc: "Správné pásmo podle vzdálenosti" },
      { to: "wifi-env", icon: "📊", title: "Zkontrolovat rušení a kanály", desc: "Sousední sítě a šířka pásma" },
    ],
    back: "slow",
  },
  coverage: {
    id: "coverage",
    top: ["Pokrytí", "Hluchá místa"],
    title: "V části domu nemám signál",
    sub: "Nejdřív neřeš nákup nového routeru. Zjistíme, jestli lze problém vyřešit umístěním, pásmem nebo správně zapojeným AP.",
    buttons: [{ to: "placement", label: "Začít kontrolou umístění →", type: "btn" }],
    back: "start",
  },
  placement: {
    id: "placement",
    top: ["Pokrytí · 2/4", "Fyzické umístění"],
    title: "Je router na rozumném místě?",
    steps: [
      ["Není zavřený ve skříni nebo botníku?", "Dřevo a dvířka tlumí signál o 30–50 %."],
      ["Není na podlaze, za TV nebo u velkého kovového předmětu?", "Kov a velké obrazovky fungují jako zrcadlo pro signál."],
      ["Není úplně na kraji domu/bytu?", "Signál se šíří kruhově — polovina výkonu pak září ven na ulici."],
      ["Není mezi ním a problémovým místem strop nebo několik silných zdí?", "Železobeton a nosné zdi signál prakticky zastaví."],
    ],
    options: [
      { to: "move", icon: "📍", title: "Umístění je špatné", desc: "Nejdřív zkusíme fyzickou změnu polohy" },
      { to: "band-distance", icon: "✅", title: "Umístění je rozumné", desc: "Pokračujeme k nastavení pásem" },
    ],
    back: "coverage",
  },
  move: {
    id: "move",
    top: ["Pokrytí · akce", "Přemístění"],
    title: "Přemístění může být nejlevnější oprava",
    boxes: [
      {
        type: "good",
        text: "Pár metrů správným směrem může udělat víc než nákup routeru za několik tisíc korun.",
      },
    ],
    steps: [
      ["Dej router výš a otevřeněji.", "Ideální je výška 1 až 1,5 metru nad podlahou."],
      ["Pokud můžeš, posuň ho více do středu prostoru.", "Centrální umístění pokryje celou domácnost rovnoměrně."],
      ["Otestuj stejné místo a stejné zařízení.", "Zda se úroveň signálu zvedla alespoň o 1–2 čárky."],
    ],
    buttons: [
      { to: "solved", label: "Pomohlo →", type: "btn" },
      { to: "band-distance", label: "Nepomohlo →", type: "ghost" },
    ],
    back: "placement",
  },
  "band-distance": {
    id: "band-distance",
    top: ["Pokrytí · 3/4", "Pásma a zdi"],
    title: "Vyzkoušej správné pásmo",
    boxes: [
      {
        type: "tip",
        title: "Prakticky:",
        text: "daleko přes zdi může být stabilnější 2,4 GHz. Blízko routeru nebo v čistém prostoru bývá výhodnější 5 GHz.",
      },
      {
        type: "why",
        title: "Steering:",
        text: "pokud máš jedno společné SSID a zařízení se chová divně, rozděl pásma dočasně na dvě jména (např. Doma_2.4G a Doma_5G). Je to diagnostický krok, ne nutně trvalé doporučení.",
      },
    ],
    buttons: [{ to: "wifi-env", label: "Pokračovat k rušení →", type: "btn" }],
    back: "placement",
  },
  "wifi-env": {
    id: "wifi-env",
    top: ["Wi‑Fi prostředí · 1/3", "Rušení"],
    title: "Nejdřív změř, až potom přelaďuj",
    sub: "Použij bezplatný Wi‑Fi analyzátor v mobilu nebo notebooku, který ukáže okolní sítě, kanály a sílu signálu (např. WiFiman od Ubiquiti nebo WiFi Analyzer).",
    boxes: [
      {
        type: "tip",
        title: "Hledej hlavně:",
        text: "silné sousední sítě na stejném/překrývajícím se kanálu a výrazný rozdíl signálu mezi místnostmi.",
      },
    ],
    table: {
      headers: ["Pásmo", "Výchozí bezpečná logika"],
      rows: [
        ["2,4 GHz", "V hustém okolí nastav šířku na 20 MHz (ne 40 MHz!). Pro přeladění porovnej čisté nepřekrývající se kanály 1 / 6 / 11."],
        ["5 GHz", "Režim Auto bývá většinou v pořádku. Ruční kanál měň až při prokázaném rušení (zkus kanály 36, 40, 44, 48)."],
      ],
    },
    boxes2: [
      {
        type: "warn",
        title: "Mýtus vyvrácen:",
        text: "Neplatí, že „nejširší kanál (160 MHz) + maximální výkon = nejlepší Wi‑Fi“. V bytovém domě to naopak přinese obrovské rušení.",
      },
    ],
    buttons: [{ to: "router-select", label: "Ukázat, kde to změnit →", type: "btn" }],
    back: "near",
  },
  device: {
    id: "device",
    top: ["Jedno zařízení · 1/3", "Klient"],
    title: "Když problém má jen jeden telefon, notebook nebo TV",
    boxes: [
      {
        type: "good",
        text: "Nejdřív nerozbijeme síť ostatním. Pokud všechno ostatní v bytě funguje, zaměříme se přímo na problémového klienta.",
      },
    ],
    steps: [
      ["Vypni a zapni Wi‑Fi na zařízení.", "Nebo přepni zařízení na 15 sekund do režimu Letadlo."],
      ["Zapomeň síť a připoj se znovu.", "Ověř si, že znáš heslo. V nastavení Wi-Fi zvol 'Zapomenout tuto síť' a zadej heslo nanovo."],
      ["Restartuj zařízení.", "Úplně zařízení vypni a zapni, nepoužívej jen uspání."],
      ["Otestuj zařízení blízko routeru.", "Pokud u routeru funguje a dál ne, může mít zařízení poškozenou anténu."],
    ],
    buttons: [
      { to: "solved", label: "Pomohlo →", type: "btn" },
      { to: "device2", label: "Nepomohlo →", type: "ghost" },
    ],
    back: "start",
  },
  device2: {
    id: "device2",
    top: ["Jedno zařízení · 2/3", "Typ klienta"],
    title: "Prověř kompatibilitu a pásmo",
    options: [
      { to: "iot", icon: "💡", title: "Je to IoT / tiskárna / starší zařízení", desc: "Často potřebuje 2,4 GHz nebo jednodušší zabezpečení WPA2" },
      { to: "router-select", icon: "💻", title: "Je to moderní telefon/notebook", desc: "Zkontrolujeme router a roaming" },
    ],
    back: "device",
  },
  iot: {
    id: "iot",
    top: ["IoT · kompatibilita", "Chytrá domácnost"],
    title: "Chytrá zařízení často nepotřebují „nejmodernější“ Wi‑Fi",
    steps: [
      ["Ověř, zda zařízení podporuje 2,4 GHz.", "Mnoho chytrých zásuvek, žárovek a vysavačů 5 GHz vůbec neumí."],
      ["Pokud máš Smart Connect / steering, dočasně odděl 2,4 a 5 GHz.", "Některé IoT se neumí připojit k síti se společným názvem."],
      ["Připoj telefon při párování na 2,4 GHz.", "Aplikace v telefonu při párování předává zařízení stejnou síť."],
      ["Pokud WPA3 způsobuje problém, použij kompatibilní WPA2‑AES.", "Mnoho IoT čipů protokol WPA3 nepodporuje."],
    ],
    buttons: [
      { to: "solved", label: "Zařízení se připojilo →", type: "btn" },
      { to: "router-select", label: "Pořád ne →", type: "ghost" },
    ],
    back: "device2",
  },
  multiple: {
    id: "multiple",
    top: ["Více routerů / AP · 1/4", "Topologie"],
    title: "Kolik zařízení doma rozdává síť?",
    boxes: [
      {
        type: "why",
        title: "Důležité:",
        text: "více Wi‑Fi bodů je v pořádku. Více nezávislých routerů s vlastním DHCP v jedné LAN už může být velký problém.",
      },
    ],
    options: [
      { to: "apmode", icon: "📡", title: "Jeden hlavní router + další AP / mesh", desc: "Správný směr s jednou sítí" },
      { to: "double-router", icon: "🔀", title: "Dva nebo více routerů za sebou", desc: "Prověříme dvojitý NAT a konflikty DHCP" },
      { to: "apmode", icon: "❓", title: "Nevím, jak to mám zapojeno", desc: "Ukážeme jednoduchou kontrolu" },
    ],
    back: "start",
  },
  "double-router": {
    id: "double-router",
    top: ["Více routerů · 2/4", "Dvojitý NAT"],
    title: "Druhý router má být router, nebo jen AP?",
    steps: [
      ["Pokud druhý router jen rozšiřuje Wi‑Fi, přepni ho do AP/Bridge režimu.", "Přístupový bod nerozdává vlastní adresy a neblokuje komunikaci."],
      ["V AP režimu má adresy klientům rozdávat výhradně hlavní router.", "Zajistí to bezproblémové sdílení tiskáren a disků."],
      ["Pokud potřebuješ dvě oddělené sítě, dvojitý routing může být záměrný.", "Ale pro běžnou domácnost přináší potíže s online hrami a videohovory."],
    ],
    boxes: [
      {
        type: "danger",
        title: "Symptom více DHCP v síti:",
        text: "zařízení někdy dostane jinou bránu/IP, připojení se chová náhodně nebo část tiskáren a TV není dostupná.",
      },
    ],
    buttons: [{ to: "apmode", label: "Pokračovat →", type: "btn" }],
    back: "multiple",
  },
  apmode: {
    id: "apmode",
    top: ["Více AP · 3/4", "Roaming a názvy"],
    title: "Roaming, steering a názvy Wi‑Fi",
    sub: "Pro pohodlný roaming můžeš mít na všech přístupových bodech stejný název i heslo. O přechodu však vždy rozhoduje klient (telefon/notebook).",
    boxes: [
      {
        type: "tip",
        title: "Když roaming zlobí:",
        text: "pro diagnostiku můžeš AP dočasně pojmenovat odlišně (např. Wi-Fi_Prizemi a Wi-Fi_Patro) a zjistit, na kterém bodu zařízení skutečně visí.",
      },
      {
        type: "warn",
        title: "Výkon na maximum není řešení.",
        text: "Příliš silné AP způsobí, že se telefon drží slabého signálu z patra, i když stojíte přímo pod jiným bodem.",
      },
    ],
    buttons: [{ to: "backhaul", label: "Zkontrolovat propojení (Backhaul) →", type: "btn" }],
    back: "multiple",
  },
  backhaul: {
    id: "backhaul",
    top: ["Více AP · 4/4", "Propojení bodů"],
    title: "Jak jsou Wi‑Fi body propojené?",
    options: [
      { to: "solved", icon: "🔌", title: "Kabelem (Ethernet)", desc: "Výborně — nejstabilnější a plná rychlost bez ztrát" },
      { to: "mesh-advice", icon: "📶", title: "Bezdrátově (Wi-Fi mesh / repeater)", desc: "Záleží na kvalitě spojení mezi jednotkami" },
    ],
    back: "apmode",
  },
  "mesh-advice": {
    id: "mesh-advice",
    top: ["Mesh / repeater", "Bezdrátový spoj"],
    title: "Bezdrátový backhaul potřebuje rezervu",
    boxes: [
      {
        type: "tip",
        text: "Druhou jednotku nedávej až tam, kde první skoro není slyšet. Musí mít sama kvalitní spoj k hlavní jednotce, aby měla co posílat dál.",
      },
    ],
    steps: [
      ["Posuň uzel blíž k hlavnímu routeru.", "Ideálně zhruba do poloviny vzdálenosti mezi routerem a hluchým místem."],
      ["Otestuj stabilitu, ne jen maximální rychlost.", "Sleduj kolísání pingu a ztrátu paketů."],
      ["Pokud je možné natáhnout kabel, zvaž ethernetový backhaul.", "I ten nejlevnější kabel předčí nejdražší bezdrátový přenos."],
    ],
    buttons: [{ to: "solved", label: "Hotovo, funguje →", type: "btn" }],
    back: "backhaul",
  },
  "router-select": {
    id: "router-select",
    top: ["Konkrétní router", "Výběr výrobce"],
    title: "Vyber značku / typ zařízení",
    options: [
      { to: "tplink", icon: "📡", title: "TP‑Link", desc: "Archer C5/C6, AX řady, Deco systémy" },
      { to: "mercusys", icon: "📡", title: "Mercusys", desc: "Běžné domácí routery a Halo mesh" },
      { to: "cudy", icon: "📡", title: "Cudy", desc: "WR3000/WR3000S, AX řady" },
      { to: "tenda", icon: "📡", title: "Tenda", desc: "AX30/AX5400, Nova systémy" },
      { to: "isp-router", icon: "🏢", title: "Router od poskytovatele", desc: "O2 Smart Box, Vodafone Station, T‑Mobile" },
      { to: "advanced", icon: "🛠️", title: "MikroTik / Ubiquiti / OpenWrt", desc: "Pokročilejší síťová rozhraní" },
      { to: "generic", icon: "🔧", title: "Jiný router", desc: "Bezpečný univerzální postup pro jakoukoliv značku" },
    ],
    back: "start",
  },
  tplink: {
    id: "tplink",
    top: ["TP‑Link", "Návod na míru"],
    title: "TP‑Link: co běžný uživatel bezpečně řeší",
    steps: [
      ["Wireless / Bezdrátová síť:", "v administraci (tplinkwifi.net) otevři sekci Bezdrátová síť a zkontroluj 2,4 GHz i 5 GHz."],
      ["2,4 GHz:", "v hustém okolí nastav šířku kanálu (Channel Width) na 20 MHz; kanál vyber podle měření (1, 6 nebo 11)."],
      ["Smart Connect:", "nech zapnutý, pokud vše funguje. Při problému s IoT nebo roamingem ho dočasně vypni a sítě pojmenuj odlišně."],
      ["Deco:", "v aplikaci Deco ověř, zda jednotky komunikují po kabelu nebo bezdrátově. Preferuj kabelový ethernet backhaul."],
    ],
    buttons: [{ to: "result-test", label: "Otestovat změnu →", type: "btn" }],
    back: "router-select",
  },
  mercusys: {
    id: "mercusys",
    top: ["Mercusys", "Návod na míru"],
    title: "Mercusys: jednoduchý bezpečný postup",
    steps: [
      ["Otevři administraci mwlogin.net a přejdi do Wireless.", "Zkontroluj základní heslo a šifrování WPA2-Personal."],
      ["Zkontroluj odděleně 2,4 a 5 GHz.", "Pokud diagnostikuješ nestabilitu, ověř nastavení každého pásma zvlášť."],
      ["Na 2,4 GHz při rušení použij 20 MHz.", "A nastav pevný kanál podle okolních sítí namísto automatiky."],
      ["Ulož jednu změnu a znovu měř.", "Nikdy neměň víc věcí současně."],
    ],
    buttons: [{ to: "result-test", label: "Otestovat výsledek →", type: "btn" }],
    back: "router-select",
  },
  cudy: {
    id: "cudy",
    top: ["Cudy", "Návod na míru"],
    title: "Cudy: běžné nastavení vs. servisní režim",
    boxes: [
      {
        type: "warn",
        title: "Pokud router běží na OpenWrt:",
        text: "běžný uživatel by neměl bez asistence flashovat alternativní firmware ani provádět recovery podle obecných internetových fór.",
      },
    ],
    steps: [
      ["Pro běžnou Wi‑Fi diagnostiku řeš jen základní parametry:", "SSID, heslo, oddělení pásem, šířku kanálu a AP/Router režim."],
      ["Při firmware/recovery vždy ověř přesnou HW revizi ze štítku.", "Štítek na spodní straně obsahuje např. V1.0, V2.0."],
      ["Firmware různých HW revizí nemíchej.", "Nahrání verze pro jinou revizi může zařízení znefunkčnit."],
    ],
    boxes2: [
      {
        type: "danger",
        title: "Boot loop / svítí jen POWER:",
        text: "to už je servisní větev. Odpoj WAN/LAN/USB kabely a řeš napájení, failsafe/recovery režim — ne náhodné klikání v menu.",
      },
    ],
    buttons: [{ to: "result-test", label: "Zpět k běžnému testu →", type: "btn" }],
    back: "router-select",
  },
  tenda: {
    id: "tenda",
    top: ["Tenda", "Návod na míru"],
    title: "Tenda: lokální síť a cloud nejsou totéž",
    steps: [
      ["Nejdřív ověř, zda jsi skutečně v lokální síti routeru.", "Připoj se na IP adresu routeru (typicky 192.168.0.1 nebo tendawifi.com)."],
      ["Pokud lokální administrace funguje, ale cloudová aplikace nevidí zařízení:", "není to automaticky problém rádiového signálu Wi-Fi, ale komunikace se serverem výrobce."],
      ["Kanály a pásma řeš stejně ukázněně:", "jedna změna, uložení, restart Wi-Fi klienta, test."],
    ],
    buttons: [{ to: "result-test", label: "Otestovat výsledek →", type: "btn" }],
    back: "router-select",
  },
  "isp-router": {
    id: "isp-router",
    top: ["Router od poskytovatele", "O2 / Vodafone / T‑Mobile"],
    title: "Router od operátora (O2 Smart Box, Vodafone, T‑Mobile)",
    boxes: [
      {
        type: "warn",
        text: "Některá pokročilá nastavení mohou být řízená poskytovatelem na dálku nebo se po aktualizaci resetovat. Wi‑Fi část (jméno, heslo, pásma) lze běžně měnit, ale WAN parametry a nastavení optiky/DSL bez pokynů operátora nikdy neměň.",
      },
    ],
    steps: [
      ["Najdi nastavení Wi‑Fi v administraci nebo mobilní aplikaci operátora.", "Např. Moje O2, Můj Vodafone či T-Mobile aplikace."],
      ["Při problému s výpadky dočasně odděl 2,4 a 5 GHz.", "Pokud to modem umožňuje, vytvoří dvě samostatné sítě."],
      ["Pokud je připojení nestabilní i kabelem přímo z modemu:", "obrať se rovnou na operátora — problém je v přípojce."],
    ],
    buttons: [{ to: "result-test", label: "Otestovat →", type: "btn" }],
    back: "router-select",
  },
  advanced: {
    id: "advanced",
    top: ["Pokročilé zařízení", "MikroTik / Ubiquiti / OpenWrt"],
    title: "MikroTik / Ubiquiti / OpenWrt",
    boxes: [
      {
        type: "danger",
        title: "Tady Wi‑Fi Doktor přepíná do režimu „opatrně“.",
        text: "Tato profesionální zařízení nabízejí detailní konfiguraci. Obecný laický klikací návod by mohl rozbít routing, firewall pravidla, VLAN, bridge nebo odříznout přístup ke správě.",
      },
    ],
    sub: "Pro běžného uživatele doporučujeme pouze kontrolu rádiových parametrů (frekvence, šířka kanálu) a sledování signálu v aplikaci (např. Ubiquiti WiFiman). Změny síťové topologie patří do pokročilé technické asistence.",
    buttons: [
      { to: "wifi-env", label: "Jen diagnostika Wi‑Fi →", type: "btn" },
      { to: "start", label: "Domů", type: "ghost" },
    ],
    back: "router-select",
  },
  generic: {
    id: "generic",
    top: ["Jiný router", "Univerzální postup"],
    title: "Univerzální bezpečný postup pro jakýkoliv router",
    steps: [
      ["Vyfoť si aktuální obrazovku před jakoukoliv změnou.", "Budeš se mít vždycky jak vrátit k fungujícímu stavu."],
      ["Najdi sekci Wireless / Wi‑Fi / WLAN.", "Zaměř se pouze na rádiové parametry."],
      ["Neměň WAN, DHCP, VLAN ani routing.", "Pokud neznáš přesný důvod, do síťových parametrů nesahej."],
      ["U Wi‑Fi změň pouze jednu věc:", "zkus přepnout pásmo, změnit kanál nebo omezit šířku kanálu na 20 MHz."],
    ],
    buttons: [{ to: "result-test", label: "Otestovat změnu →", type: "btn" }],
    back: "router-select",
  },
  "result-test": {
    id: "result-test",
    top: ["Kontrola výsledku", "Vyhodnocení"],
    title: "Změnilo se něco?",
    options: [
      { to: "solved", icon: "✅", title: "Ano, problém zmizel nebo se výrazně zlepšil", desc: "Wi-Fi je stabilní a rychlá" },
      { to: "rollback", icon: "❌", title: "Ne, stejné nebo horší", desc: "Vrátíme poslední změnu zpět" },
      { to: "mixed", icon: "🤔", title: "Je to jiné, ale nejsem si jistý", desc: "Porovnáme stabilitu a reálnou funkčnost" },
    ],
    back: "start",
  },
  rollback: {
    id: "rollback",
    top: ["Bezpečný návrat", "Zpět k funkčnímu"],
    title: "Vrať poslední provedenou změnu",
    boxes: [
      {
        type: "warn",
        title: "Nepokračuj náhodně dalšími změnami!",
        text: "Když změna nepomohla, vrať hodnotu zpět podle vyfoceného stavu a teprve potom zkoušej jiný směr.",
      },
    ],
    options: [
      { to: "wifi-env", icon: "📊", title: "Zkusit jiný kanál podle měření", desc: "Vybrat méně zarušenou frekvenci" },
      { to: "coverage", icon: "🏠", title: "Prověřit pokrytí a překážky", desc: "Fyzické umístění routeru" },
      { to: "multiple", icon: "🧩", title: "Prověřit více routerů / AP", desc: "Zda se v síti nebije více DHCP serverů" },
      { to: "isp", icon: "🌐", title: "Prověřit přípojku operátora", desc: "Když je chyba mimo vaši domácnost" },
    ],
    back: "result-test",
  },
  mixed: {
    id: "mixed",
    top: ["Vyhodnocení", "Kvalita spojení"],
    title: "Nejde jen o číslo ze speedtestu",
    steps: [
      ["Je připojení stabilnější?", "Nevypadávají hovory a nenačítají se stránky se zpožděním?"],
      ["Zmizely nepříjemné výpadky?", "Zůstávají zařízení trvale online bez nutnosti restartu Wi-Fi?"],
      ["Je rychlost v místě použití dostatečná pro běžnou práci?", "Pro 4K video stačí stabilních 25 Mb/s, pro videohovor 10 Mb/s."],
    ],
    boxes: [
      {
        type: "tip",
        text: "Lepší Wi‑Fi není vždy ta s nejvyšším jednorázovým číslem v testu. Pro videohovor nebo chytrou TV je mnohem důležitější stabilita bez výkyvů a minimální packet loss.",
      },
    ],
    buttons: [
      { to: "solved", label: "Výsledek je lepší →", type: "btn" },
      { to: "rollback", label: "Není, chci vrátit změnu →", type: "ghost" },
    ],
    back: "result-test",
  },
  solved: {
    id: "solved",
    top: ["Hotovo", "Úspěšně vyřešeno"],
    title: "Síť funguje lépe 🎉",
    boxes: [
      {
        type: "good",
        title: "Teď už nic dalšího neměň.",
        text: "Nech síť alespoň 24 hodin běžet v tomto stavu a ověř ji na zařízeních tam, kde byl původní problém.",
      },
    ],
    sub: "Váš diagnostický protokol o zásahu:",
    chips: [
      "✓ Původní příčina lokalizována",
      "✓ Žádné náhodné přepisování routeru",
      "✓ Správné pásmo a kanál ověřeny",
      "✓ Síť stabilní a bezpečná",
    ],
    isSolvedScreen: true,
    buttons: [{ to: "start", label: "Vyřešit jiný problém →", type: "btn" }],
    back: "start",
  },
  terms: {
    id: "terms",
    top: ["Slovníček", "Pojmy bez strašení"],
    title: "Wi‑Fi bez technického strašení",
    sub: "Rychlý přehled nejdůležitějších pojmů, se kterými se v nastavení sítě setkáte:",
    grid2: [
      { kicker: "Pásmo", title: "2,4 GHz", desc: "Dál dosáhne přes zdi, ale má menší rychlost a v bytových domech bývá hodně zarušené." },
      { kicker: "Pásmo", title: "5 GHz", desc: "Vysoká rychlost a čisté kanály, ale výrazně hůře prochází přes překážky a stěny. Není to mobilní 5G." },
      { kicker: "Rádio", title: "Kanál (Channel)", desc: "Konkrétní frekvenční stopa, na které router vysílá. Cílem je nebýt na stejném kanálu jako soused." },
      { kicker: "Rádio", title: "Šířka kanálu (Channel Width)", desc: "Udává se v MHz (20, 40, 80, 160). Širší kanál přenese více dat, ale chytá více okolního rušení." },
      { kicker: "Funkce", title: "Band steering / Smart Connect", desc: "Router vysílá obě pásma pod jedním jménem a sám se snaží zařízení navádět na to vhodnější." },
      { kicker: "Systém", title: "Mesh", desc: "Sada více spolupracujících jednotek, které pokrývají větší prostor pod jednou společnou sítí." },
      { kicker: "Zařízení", title: "Access Point (AP)", desc: "Přístupový bod, který rozšiřuje Wi-Fi signál, ale nevytváří vlastní oddělenou síť ani DHCP." },
      { kicker: "Služba", title: "DHCP server", desc: "Služba v routeru, která automaticky přiděluje zařízením IP adresy. V domácnosti smí běžet jen jeden!" },
    ],
    buttons: [{ to: "start", label: "← Zpět na hlavní přehled", type: "btn" }],
    back: "start",
  },
};

export default function Guide({ isPremium = false }: { isPremium?: boolean }) {
  const [currentId, setCurrentId] = useState<string>("start");
  const [history, setHistory] = useState<string[]>([]);
  const [showComplaint, setShowComplaint] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHardware, setShowHardware] = useState(false);

  // Sync hash if present on load or hash change
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && SCREENS[hash]) {
        setCurrentId(hash);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const current = SCREENS[currentId] || SCREENS.start;

  const goTo = (targetId: string) => {
    if (SCREENS[targetId]) {
      setHistory((prev) => [...prev, currentId]);
      setCurrentId(targetId);
      window.location.hash = targetId;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((h) => h.slice(0, -1));
      setCurrentId(prev);
      window.location.hash = prev;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (current.back && SCREENS[current.back]) {
      setCurrentId(current.back);
      window.location.hash = current.back;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCurrentId("start");
      window.location.hash = "start";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const copyComplaint = () => {
    navigator.clipboard
      .writeText(complaintTemplate)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      })
      .catch(() => {});
  };

  return (
    <div className="guideRootWrap">
      {/* Top tools navigation */}
      <div className="guideQuickBar">
        <div className="guideBreadcrumb">
          <button
            type="button"
            className="homeBreadcrumb"
            onClick={() => {
              setCurrentId("start");
              setHistory([]);
              window.location.hash = "start";
            }}
          >
            🏠 Přehled
          </button>
          {currentId !== "start" && (
            <>
              <span className="crumbSep">›</span>
              <span className="crumbCurrent">{current.top[0]}</span>
            </>
          )}
        </div>
        <div className="guideQuickTools">
          <button
            type="button"
            className={`quickToolBtn ${currentId === "terms" ? "active" : ""}`}
            onClick={() => goTo("terms")}
          >
            💡 Pojmy
          </button>
          <button
            type="button"
            className={`quickToolBtn ${showComplaint ? "active" : ""}`}
            onClick={() => setShowComplaint(!showComplaint)}
          >
            📋 Stížnost operátorovi
          </button>
          <button
            type="button"
            className={`quickToolBtn ${showHardware ? "active" : ""}`}
            onClick={() => setShowHardware(!showHardware)}
          >
            📡 Doporučený HW
          </button>
          {isPremium && (
            <>
              <a
                href="https://wifiman.com"
                target="_blank"
                rel="noopener noreferrer"
                className="quickToolBtn"
                title="Aplikace pro měření Wi-Fi signálu"
              >
                📶 WiFiman
              </a>
              <a
                href="https://wa.me/420775278813"
                target="_blank"
                rel="noopener noreferrer"
                className="quickToolBtn whatsappToolBtn"
                title="Osobní asistence technika na WhatsAppu"
              >
                💬 SOS WhatsApp (+420 775 278 813)
              </a>
            </>
          )}
        </div>
      </div>

      {/* Main interactive screen panel */}
      <section className="screenCard" id={current.id}>
        <div className="screenTop">
          <span>{current.top[0]}</span>
          <span>{current.top[1]}</span>
        </div>

        <div className="screenContent">
          <h2>{current.title}</h2>
          {current.sub && <p className="hero-sub">{current.sub}</p>}

          {/* Primary Alert Boxes */}
          {current.boxes &&
            current.boxes.map((b, i) => (
              <div key={i} className={`box ${b.type}`}>
                {b.title && <strong>{b.title} </strong>}
                <span>{b.text}</span>
              </div>
            ))}

          {/* Mini Cards Grid */}
          {current.grid2 && (
            <div className="grid2">
              {current.grid2.map((c, i) => (
                <div key={i} className="cardmini">
                  {c.kicker && <div className="kicker">{c.kicker}</div>}
                  <strong>{c.title}</strong>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Ordered step-by-step instructions */}
          {current.steps && (
            <div className="stepsList">
              {current.steps.map(([stTitle, stDesc], idx) => (
                <div key={idx} className="stepItem">
                  <span className="stepNum">{idx + 1}</span>
                  <div className="stepBody">
                    <strong>{stTitle}</strong>
                    {stDesc && <span className="stepDesc">{stDesc}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table display */}
          {current.table && (
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    {current.table.headers.map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {current.table.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Secondary Alert Boxes */}
          {(current as any).boxes2 &&
            (current as any).boxes2.map((b: AlertBox, i: number) => (
              <div key={i} className={`box ${b.type}`}>
                {b.title && <strong>{b.title} </strong>}
                <span>{b.text}</span>
              </div>
            ))}

          {/* Selectable Options / Pathways */}
          {current.options && (
            <div className="optionsList">
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  className="optionBtn"
                  onClick={() => goTo(opt.to)}
                >
                  <span className="optIcon">{opt.icon}</span>
                  <div className="optText">
                    <strong>{opt.title}</strong>
                    {opt.desc && <span className="optDesc">{opt.desc}</span>}
                  </div>
                  <span className="optArrow">→</span>
                </button>
              ))}
            </div>
          )}

          {/* Screen Specific Additions */}
          {current.chips && (
            <div className="chips">
              {current.chips.map((chip, i) => (
                <span key={i} className="chip">
                  {chip}
                </span>
              ))}
            </div>
          )}

          {/* ISP Complaint Generator Section (on ISP screen or via quick toggle) */}
          {(current.isIspScreen || showComplaint) && (
            <div className="bonusCardSection">
              <div className="bonusCardHeader">
                <span className="bonusCardIcon">📋</span>
                <div>
                  <strong>Generátor stížnosti pro operátora</strong>
                  <p className="small">Pokud problém přetrvává na kabelu, operátor je povinen situaci prověřit bez účtování poplatku za marný výjezd.</p>
                </div>
              </div>
              <pre className="complaintBox">{complaintTemplate}</pre>
              <div className="complaintActions">
                <button
                  type="button"
                  className="btn copyBtn"
                  onClick={copyComplaint}
                >
                  {copied ? "✓ Text zkopírován do schránky" : "📋 Zkopírovat text stížnosti"}
                </button>
                {showComplaint && !current.isIspScreen && (
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => setShowComplaint(false)}
                  >
                    Zavřít
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Hardware Recommendations Section (on Solved screen or via quick toggle) */}
          {(current.isSolvedScreen || showHardware) && (
            <div className="bonusCardSection">
              <div className="bonusCardHeader">
                <span className="bonusCardIcon">📡</span>
                <div>
                  <strong>Ověřený hardware pro českou síť</strong>
                  <p className="small">Kdyby router opravdu dosloužil (starší než 6 let nebo bez podpory 5 GHz):</p>
                </div>
              </div>
              <div className="grid2">
                <div className="cardmini">
                  <div className="kicker">Byt do 75 m²</div>
                  <strong>TP‑Link Archer AX23 / AX12</strong>
                  <p>Wi‑Fi 6, gigabitové LAN porty, stabilní provoz, do 1 200 Kč. Plně postačuje pro většinu běžných bytů.</p>
                </div>
                <div className="cardmini">
                  <div className="kicker">Patrový dům / velký byt</div>
                  <strong>TP‑Link Deco X20 (2‑pack)</strong>
                  <p>Spolehlivý mesh systém s podporou kabelového backhaulu, eliminuje hluchá místa bez přepínání sítí, do 2 500 Kč.</p>
                </div>
              </div>
              {showHardware && !current.isSolvedScreen && (
                <div style={{ marginTop: "12px" }}>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => setShowHardware(false)}
                  >
                    Zavřít doporučení
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Premium Technician Assistance Box (ONLY for higher tier) */}
          {isPremium && (
            <div className="premiumAssistanceBox">
              <div className="premiumAssistanceHeader">
                <span className="premiumIcon">⭐</span>
                <div>
                  <strong>Osobní SOS asistence technika na WhatsAppu aktivní</strong>
                  <p className="small">Máte zakoupenou verzi s asistencí. Případné problémy řešíme v kooperaci s bezplatnou aplikací <strong><a href="https://wifiman.com" target="_blank" rel="noopener noreferrer" style={{color:"inherit",textDecoration:"underline"}}>WiFiman (wifiman.com)</a></strong>.</p>
                </div>
              </div>
              <p className="wifimanNote">
                📲 <strong>Jak postupovat:</strong> Změřte signál či kanály v aplikaci <a href="https://wifiman.com" target="_blank" rel="noopener noreferrer"><strong>WiFiman</strong></a> a pořiďte snímek obrazovky. Ten spolu s fotkou vašeho routeru pošlete technikovi na WhatsApp:
              </p>
              <div className="premiumActionsRow">
                <a
                  href="https://wa.me/420775278813"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn whatsappActionBtn"
                >
                  💬 Napsat technikovi na WhatsApp (+420 775 278 813)
                </a>
                <a
                  href="https://wifiman.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ghost wifimanBtn"
                >
                  📶 Otevřít aplikaci WiFiman (wifiman.com) ↗
                </a>
              </div>
            </div>
          )}

          {/* Screen Navigation Actions */}
          <div className="screenNavActions">
            {current.buttons &&
              current.buttons.map((btn, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={btn.type || "btn"}
                  onClick={() => goTo(btn.to)}
                >
                  {btn.label}
                </button>
              ))}

            {currentId !== "start" && (
              <button type="button" className="backBtn" onClick={goBack}>
                ← Zpět
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="guideFooter">
        <p>Wi‑Fi Doktor v0.4.1 · Interaktivní diagnostický systém pro domácnosti · Zakoupená plná verze</p>
        {isPremium && (
          <p className="premiumFooterNote">
            ⭐ Kompletní balíček: Asistence technika na WhatsAppu:{" "}
            <a href="https://wa.me/420775278813" target="_blank" rel="noopener noreferrer">
              +420 775 278 813
            </a>
          </p>
        )}
      </footer>
    </div>
  );
}
