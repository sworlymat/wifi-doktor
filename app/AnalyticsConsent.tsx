"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_KEY, publicAnalyticsPage, startGoogleAnalytics, stopGoogleAnalytics, clearGoogleCookies } from "../lib/google-analytics";

export default function AnalyticsConsent() {
  const path = usePathname();
  const [choice, setChoice] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { try { const saved = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null"); if (saved && saved.until > Date.now() && ["yes","no"].includes(saved.value)) setChoice(saved.value); } catch {} setReady(true); }, []);
  useEffect(() => {
    if (ready && choice === "yes") startGoogleAnalytics(path);
    else stopGoogleAnalytics();
    return () => stopGoogleAnalytics();
  }, [ready, choice, path]);
  function choose(value: "yes" | "no") {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({value, until:Date.now()+180*86400000})); } catch {}
    if (value === "no") { stopGoogleAnalytics(); clearGoogleCookies(); }
    setChoice(value); setOpen(false);
    // Reload after revocation to unload Google's script and its listeners completely.
    if (choice === "yes" && value === "no") window.location.reload();
  }
  if (!ready || !publicAnalyticsPage(path)) return null;
  return <><button className="analyticsSettings" type="button" onClick={()=>setOpen(true)}>Nastavení měření</button>
    {(choice === null || open) && <section className="analyticsConsent" role="region" aria-label="Souhlas s měřením návštěvnosti"><h2>Můžeme měřit návštěvnost?</h2><p>S vaším souhlasem použijeme Google Analytics a analytické cookies pro měření návštěv a používání webu. Odmítnutí neovlivní nákup ani průvodce. Volbu můžete kdykoli změnit v nastavení měření.</p><a href="/ochrana-soukromi">Podrobnosti o soukromí</a><div><button type="button" onClick={()=>choose("no")}>Odmítnout</button><button type="button" onClick={()=>choose("yes")}>Povolit analytiku</button>{choice !== null && <button type="button" onClick={()=>setOpen(false)}>Zavřít</button>}</div></section>}
  </>;
}
