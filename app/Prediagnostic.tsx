"use client";

import { useEffect, useRef, useState } from "react";
import { classify, questions, results } from "../lib/prediagnostic";
import { track } from "../lib/analytics";

// Future feature: render only after an existing technician lead destination is approved.
// No new lead backend, fabricated availability or dead button is exposed to visitors.
export function TechnicianCTA({ href }: { href?: string }) {
  if (!href) return null;
  return <a className="preTechnician" href={href} onClick={() => track("technician_cta_clicked", { section: "prediagnostic:B" }, true)}>Raději chci pomoc technika</a>;
}

export default function Prediagnostic() {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<string[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const counted = useRef(new Set<string>());
  const startedAt = useRef(0);
  const section = "prediagnostic:B";
  const category = classify(answers);
  const result = results[category];

  useEffect(() => {
    if (step >= 0) heading.current?.focus();
  }, [step]);

  function start() {
    counted.current.clear();
    startedAt.current = Date.now();
    setAnswers([]);
    setStep(0);
    track("prediagnostic_started", { section });
  }

  function answer(value: string) {
    const next = [...answers.slice(0, step), value];
    setAnswers(next);
    if (step < 3) {
      const event = `prediagnostic_step_${step + 1}` as "prediagnostic_step_1" | "prediagnostic_step_2" | "prediagnostic_step_3";
      if (!counted.current.has(event)) { counted.current.add(event); track(event, { section }); }
    } else {
      if (!counted.current.has("completed")) {
        counted.current.add("completed");
        track("prediagnostic_completed", { section, durationMs: Date.now() - startedAt.current });
      }
      const event = `prediagnostic_result_${classify(next)}` as const;
      if (!counted.current.has(event)) { counted.current.add(event); track(event, { section }); }
    }
    setStep(step + 1);
  }

  return <section className="preSection wrap" id="prediagnostika" aria-labelledby="pre-heading" data-track-section>
    <div className="preIntro">
      <p className="eyebrow"><span /> Nejdřív malá nápověda</p>
      <h2>Nevíte, jestli vám<br />Wi-Fi Doktor pomůže?</h2>
      <p>Odpovězte na 4 jednoduché otázky a za 60 sekund zjistěte, kde pravděpodobně hledat problém.</p>
      <span className="preFree">ZDARMA</span><span className="preNoSignup">Bez registrace a bez e-mailu</span>
    </div>
    <div className="preCard">
      {step === -1 ? <>
        <p className="smallLabel">4 OTÁZKY · PŘIBLIŽNĚ 60 SEKUND</p>
        <h3 id="pre-heading">Začněte tím, co doma pozorujete.</h3>
        <p>Nemusíte znát typ routeru ani technické pojmy. Když si nebudete jistí, zvolte „Nevím“.</p>
        <button type="button" className="primary full" onClick={start}>Zjistit problém za 60 sekund <span aria-hidden="true">→</span></button>
        <p className="preNote">Orientační předdiagnostika. Nic ve vaší síti nemění.</p>
      </> : step < 4 ? <>
        <div className="preMeta"><span>Otázka {step + 1}/4</span><button type="button" onClick={() => setStep(-1)}>Zavřít</button></div>
        <progress aria-label="Průběh předdiagnostiky" value={step + 1} max={4} />
        <h3 ref={heading} id="pre-heading" tabIndex={-1}>{questions[step].title}</h3>
        <div className="preOptions" role="group" aria-labelledby="pre-heading">
          {questions[step].options.map(([value, label]) => <button key={`${step}-${value}`} className="preOption" type="button" aria-pressed={answers[step] === value} onClick={() => answer(value)}>{label}<span aria-hidden="true">→</span></button>)}
        </div>
        {step > 0 && <button type="button" className="preBack" onClick={() => setStep(step - 1)}>← Zpět</button>}
        <p className="preNote">Vyberte odpověď, která je vaší situaci nejblíž.</p>
      </> : <>
        <p className="smallLabel">{category === "E" ? "VÝSLEDEK PŘEDDIAGNOSTIKY" : "MÁME STOPU"} <span aria-hidden="true">🔎</span></p>
        <h3 ref={heading} id="pre-heading" tabIndex={-1}>{result.title}</h3>
        <p>{result.description}</p><p className="preHint">{result.hint}</p>
        <p>Wi-Fi Doktor BASIC vás provede kompletní diagnostikou krok za krokem, pomůže ověřit jednotlivé možné příčiny a ukáže vám, co konkrétně udělat.</p>
        <div className="preOffer">
          <p>Kompletní Wi-Fi diagnostika krok za krokem</p>
          <div className="prePrice"><strong>Wi-Fi Doktor BASIC</strong><span>299 Kč</span></div>
          <form action="/api/checkout" method="post" onSubmit={() => {
            track("basic_cta_clicked", { section }, true);
            track("checkout_start", { section }, true);
          }}>
            <button type="submit" className="primary full">Vyřešit problém s Wi-Fi Doktorem <span aria-hidden="true">→</span></button>
          </form>
          <p className="preNote">Jednorázově · žádné předplatné · 14denní garance vrácení peněz</p>
          <TechnicianCTA />
        </div>
        <div className="preResultActions"><button className="preBack" type="button" onClick={() => setStep(3)}>← Upravit odpovědi</button><button className="preBack" type="button" onClick={start}>Začít znovu</button></div>
      </>}
    </div>
  </section>;
}
