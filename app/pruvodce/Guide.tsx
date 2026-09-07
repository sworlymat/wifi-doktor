"use client";

import { useState } from "react";

const paths = {
  slow: {
    title: "Wi‑Fi je pomalá",
    intro: "Nejdřív oddělíme problém signálu od problému internetové přípojky.",
    steps: [
      ["Přejděte blízko routeru", "Postavte se přibližně 2–3 metry od routeru a spusťte stejnou stránku nebo video jako předtím.", "Blízko routeru je rychlost v pořádku? Pak je problém hlavně v pokrytí domácnosti."],
      ["Restartujte pouze router", "Odpojte napájení routeru na 30 sekund, znovu jej zapojte a vyčkejte 3–5 minut.", "Počkejte, až kontrolky přestanou blikat, a zkuste internet znovu."],
      ["Porovnejte dvě zařízení", "Na stejném místě vyzkoušejte telefon a notebook. Nemusíte instalovat žádnou aplikaci.", "Pokud zlobí jen jedno zařízení, pokračujte cestou „Jedno zařízení“."]
    ]
  },
  drops: {
    title: "Připojení vypadává",
    intro: "Zjistíme, zda padá jen Wi‑Fi, nebo celé internetové připojení.",
    steps: [
      ["Sledujte kontrolky routeru", "Při dalším výpadku se podívejte, zda zhasne nebo změní barvu kontrolka Internet/WAN.", "Změna kontrolky Internet obvykle znamená problém přípojky nebo poskytovatele."],
      ["Zkontrolujte kabely", "Jemně domáčkněte napájecí a internetový kabel. Nic nerozebírejte.", "Kabel musí držet pevně a nesmí být výrazně zlomený nebo poškozený."],
      ["Otestujte jiné zařízení", "Při výpadku zkuste otevřít stránku na druhém telefonu nebo počítači.", "Když vypadnou všechna zařízení současně, problém není v jednom telefonu." ]
    ]
  },
  signal: {
    title: "Slabý signál",
    intro: "Najdeme místo, kde se signál ztrácí, a zlepšíme umístění routeru.",
    steps: [
      ["Najděte hranici signálu", "Pomalu se vzdalujte od routeru a sledujte, ve které místnosti začne připojení zpomalovat.", "Poznamenejte si první problematické místo."],
      ["Uvolněte okolí routeru", "Router dejte výš, mimo skříň, kovové předměty, televizi a mikrovlnnou troubu.", "Po přesunutí zopakujte test na problematickém místě."],
      ["Zvažte přístupový bod", "Pokud problém zůstává přes několik zdí nebo pater, samotné nastavení nemusí stačit.", "Nejspolehlivější bývá další přístupový bod připojený kabelem; Wi‑Fi extender je až druhá volba."]
    ]
  },
  device: {
    title: "Zlobí jedno zařízení",
    intro: "Když ostatní zařízení fungují, router většinou není hlavní příčina.",
    steps: [
      ["Vypněte a zapněte Wi‑Fi", "Na problematickém zařízení Wi‑Fi vypněte, počkejte 10 sekund a znovu ji zapněte.", "Ověřte načtením jedné běžné webové stránky."],
      ["Zapomeňte síť", "Nejprve si ověřte, že znáte heslo své Wi‑Fi. Pokud ho nemáte, tento krok přeskočte. Pak v nastavení Wi‑Fi zvolte svou síť, klepněte na Zapomenout a znovu se připojte heslem.", "Tím se odstraní chybné uložené nastavení. U firemní nebo školní sítě se nejprve obraťte na správce."],
      ["Restartujte zařízení", "Zařízení úplně restartujte, nejen zamkněte obrazovku.", "Pokud problém přetrvá jen zde, zkontrolujte aktualizace systému nebo servis zařízení."]
    ]
  }
} as const;

type PathKey = keyof typeof paths;

export default function Guide() {
  const [path, setPath] = useState<PathKey | null>(null);
  const [step, setStep] = useState(0);
  const [solved, setSolved] = useState(false);
  const selected = path ? paths[path] : null;
  if (solved) return <section className="guidePanel"><h1>Wi‑Fi zase funguje.</h1><p className="guideIntro">Další změny už nejsou potřeba. Ověřte ještě připojení na místě, kde problém vznikal.</p><button className="primary" onClick={() => {setSolved(false);setPath(null);setStep(0);}}>Vyřešit jiný problém →</button></section>;

  if (!selected) return <section className="guidePanel">
    <p className="eyebrow"><span/> Začněte svým problémem</p>
    <h1>Co vaše Wi‑Fi právě dělá?</h1>
    <div className="guideChoices">
      {Object.entries(paths).map(([key, value]) => <button key={key} onClick={() => {setPath(key as PathKey); setStep(0);}}>{value.title}<span>→</span></button>)}
    </div>
    <p className="safeBox">Průvodce se k routeru nepřipojuje a nic nemění automaticky. Při restartu se připojení na chvíli přeruší. Nechte tuto kartu otevřenou; při potížích použijte mobilní data. Nedržte tlačítko RESET — vymazalo by nastavení routeru.</p>
  </section>;

  const current = selected.steps[step];
  return <section className="guidePanel">
    <button className="guideBack" onClick={() => setPath(null)}>← Změnit problém</button>
    <p className="eyebrow"><span/> {selected.title}</p>
    <h1>{current[0]}</h1>
    <p className="guideIntro">{step === 0 ? selected.intro : "Pokračujte až po dokončení předchozího kroku."}</p>
    <div className="instruction"><b>CO UDĚLAT</b><p>{current[1]}</p></div>
    <div className="verify"><b>JAK OVĚŘIT VÝSLEDEK</b><p>{current[2]}</p></div>
    <div className="guideProgress"><span>Krok {step + 1} z {selected.steps.length}</span><i><b style={{width:`${((step + 1) / selected.steps.length) * 100}%`}}/></i></div>
    <div className="guideActions">
      <button className="secondary" onClick={() => setSolved(true)}>Už to funguje</button>
      {step > 0 && <button className="secondary" onClick={() => setStep(step - 1)}>Zpět</button>}
      {step < selected.steps.length - 1 ? <button className="primary" onClick={() => setStep(step + 1)}>Hotovo, další krok →</button> : <button className="primary" onClick={() => setPath(null)}>Vyřešit jiný problém →</button>}
    </div>
    {step === selected.steps.length - 1 && <p className="safeBox">Pokud problém trvá, poznamenejte si, na kterých zařízeních a místech se projevuje, a kontaktujte poskytovatele internetu nebo technika. Neprovádějte tovární reset bez znalosti nastavení přípojky.</p>}
  </section>;
}
