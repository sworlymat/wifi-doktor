"use client";
import { useEffect, useState } from "react";
const pains=[["Wi‑Fi je pomalá","Stránky se načítají věčnost a video se seká."],["Připojení vypadává","Telefon nebo televize se pořád odpojují."],["Signál nedosáhne všude","V ložnici, patře nebo na zahradě Wi‑Fi mizí."],["Zlobí jen jedno zařízení","Ostatní fungují, ale jeden telefon či notebook ne."]];
const steps=[["01","Vyberete, co nefunguje","Žádná učebnice. Začnete rovnou svým problémem."],["02","Projdete doporučené kontroly","Průvodce rozliší Wi‑Fi, internet, pokrytí i konkrétní zařízení."],["03","Uděláte jeden bezpečný krok","Dostanete konkrétní pokyn a popis, jak ověřit výsledek."],["04","Ověříte výsledek","Teprve když krok nepomohl, pokračujete dál."]];
const faqs=[
  ["Co přesně po zaplacení dostanu?","Okamžitě se otevře interaktivní Wi‑Fi Doktor. Podle toho, co doma nefunguje, vás provede kontrolami a vždy ukáže jeden konkrétní krok, jeho smysl a způsob ověření výsledku."],
  ["Jak rychle získám přístup?","Po úspěšné platbě přes Stripe se přístup zobrazí přímo v prohlížeči. Odkaz si uložte do záložek, protože slouží jako váš osobní vstup do průvodce."],
  ["Je 299 Kč jednorázová platba?","Ano. Nejde o předplatné a žádná další pravidelná platba se nestrhává."],
  ["Musím rozumět sítím nebo routerům?","Ne. Wi‑Fi Doktor je psaný pro běžného člověka. Technické pojmy vysvětluje normální řečí a postupuje krok po kroku."],
  ["Potřebuji něco instalovat?","Ne. Průvodce funguje v běžném internetovém prohlížeči na telefonu, tabletu i počítači."],
  ["Funguje s každým routerem a poskytovatelem?","Postup je postavený na obecných kontrolách, které fungují napříč běžnými routery a poskytovateli. Pokud je některé menu pojmenované jinak, průvodce vysvětlí, co máte hledat."],
  ["Volal jsem operátorovi a linka je podle něj v pořádku. Proč mi doporučil technika?","Operátor obvykle ověří hlavně přípojku do vašeho domu nebo bytu. Potíž ale může být až za ní — v domácím routeru, nastavení Wi‑Fi, rušení, slabém pokrytí nebo konkrétním zařízení. Wi‑Fi Doktor vás provede domácí částí sítě krok za krokem, abyste zjistili pravděpodobnou příčinu a poznali, zda technika opravdu potřebujete."],
  ["Je to AI, která se připojí k mému routeru?","Ne. Je to interaktivní průvodce. Do routeru se sám nepřipojuje, nečte hesla a nic bez vašeho vědomí nemění."],
  ["Mohu něco pokazit?","Průvodce začíná bezpečnými kontrolami, mění vždy jen jednu věc a ukazuje, jak výsledek ověřit nebo změnu vrátit."],
  ["Vyřeší každý problém?","Ne každý problém lze vyřešit doma. Wi‑Fi Doktor ale pomůže rozlišit, zda je problém ve Wi‑Fi, přípojce, pokrytí nebo konkrétním zařízení — a kdy už zavolat technika či poskytovatele."],
  ["Co když si během postupu nebudu jistý?","Zastavte se před změnou a vraťte se o krok zpět. U každého zásahu je vysvětlené, co se bude dít. S dotazem můžete také napsat na pepik.kup@gmail.com."],
];
const demoResults=[
  {title:"Nejspíš jde o pokrytí",text:"Internet k routeru pravděpodobně dorazí, ale signál po cestě slábne. Průvodce nejdřív ověří umístění routeru a sílu signálu v problematickém místě."},
  {title:"Prověříme přípojku i router",text:"Když Wi‑Fi zlobí i vedle routeru, problém může být v přípojce, routeru nebo jeho nastavení. Průvodce pomůže tyto možnosti bezpečně rozlišit."},
  {title:"Začneme u zařízení",text:"Pokud ostatní zařízení fungují, příčina bývá často v jednom telefonu, počítači nebo jeho uloženém připojení. Není důvod hned měnit router."}
];
const Arrow=()=> <span aria-hidden="true">↗</span>;
export default function Home({checkout}:{checkout?:string}){const[demo,setDemo]=useState<number|null>(null);useEffect(()=>{
  const sessionId=crypto.randomUUID();
  const startedAt=Date.now();
  const seenSections=new Set<string>();
  let lastSection="top";
  let maxScrollDepth=0;
  let exitSent=false;
  const search=new URLSearchParams(window.location.search);
  let referrerHost:string|null=null;
  try{referrerHost=document.referrer?new URL(document.referrer).hostname:null;}catch{referrerHost=null;}
  const send=(eventType:string,extra:Record<string,unknown>={},beacon=false)=>{
    const payload=JSON.stringify({sessionId,eventType,path:window.location.pathname,...extra});
    if(beacon&&navigator.sendBeacon){navigator.sendBeacon("/api/analytics",new Blob([payload],{type:"application/json"}));return;}
    void fetch("/api/analytics",{method:"POST",headers:{"content-type":"application/json"},body:payload,keepalive:true}).catch(()=>{});
  };
  send("page_view",{referrerHost,utmSource:search.get("utm_source"),utmMedium:search.get("utm_medium"),utmCampaign:search.get("utm_campaign")});
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting&&entry.intersectionRatio>=.3){const section=(entry.target as HTMLElement).id;if(section){lastSection=section;if(!seenSections.has(section)){seenSections.add(section);send("section_view",{section});}}}}},{threshold:.3});
  for(const section of document.querySelectorAll<HTMLElement>("[data-track-section]"))observer.observe(section);
  const updateScroll=()=>{const available=document.documentElement.scrollHeight-window.innerHeight;maxScrollDepth=available<=0?100:Math.max(maxScrollDepth,Math.min(100,Math.round(window.scrollY/available*100)));};
  window.addEventListener("scroll",updateScroll,{passive:true});
  const checkoutForms=[...document.querySelectorAll<HTMLFormElement>('form[data-analytics="checkout-start"]')];
  const checkoutStarted=()=>send("checkout_start",{section:"objednat"},true);
  checkoutForms.forEach(form=>form.addEventListener("submit",checkoutStarted));
  const sendExit=()=>{if(exitSent)return;exitSent=true;updateScroll();send("page_exit",{section:lastSection,durationMs:Date.now()-startedAt,scrollDepth:maxScrollDepth},true);};
  const visibilityChanged=()=>{if(document.visibilityState==="hidden")sendExit();};
  window.addEventListener("pagehide",sendExit);
  document.addEventListener("visibilitychange",visibilityChanged);
  return()=>{observer.disconnect();window.removeEventListener("scroll",updateScroll);window.removeEventListener("pagehide",sendExit);document.removeEventListener("visibilitychange",visibilityChanged);checkoutForms.forEach(form=>form.removeEventListener("submit",checkoutStarted));};
},[]);return <main>
<header className="nav wrap"><a className="brand" href="#top"><span className="brandMark">W</span><span>Wi‑Fi Doktor</span></a><a className="navCta" href="#objednat">Získat průvodce <Arrow/></a></header>
<section className="hero wrap" id="top" data-track-section><div className="heroCopy"><p className="eyebrow"><span/> Interaktivní pomoc pro domácí Wi‑Fi</p><h1>Wi‑Fi zlobí?<br/><em>Opravte ji sami.</em></h1><p className="lead">Zjistěte, proč je vaše Wi‑Fi pomalá, vypadává nebo nedosáhne všude. Bez technických znalostí. Krok za krokem.</p><div className="heroActions"><a className="primary" href="#objednat">Chci vyřešit Wi‑Fi <Arrow/></a><a className="textLink" href="#jak">Jak to funguje ↓</a></div><div className="trustRow"><span>✓ Bez instalace</span><span>✓ Lidsky vysvětlené</span><span>✓ Bez zásahu naslepo</span></div></div>
<div className="productMock"><div className="mockTop"><span className="mockLogo">W</span><span>Diagnostika</span><button className="stepPill" type="button" onClick={()=>setDemo(null)}>{demo===null?"Ukázka postupu":"Začít znovu ↺"}</button></div><div className="mockProgress"><i style={{width:demo===null?"38%":"100%"}}/></div><div className="mockBody" aria-live="polite"><span className="signal">{demo===null?"⌁":"✓"}</span><p className="smallLabel">{demo===null?"RYCHLÁ KONTROLA":"VÝSLEDEK UKÁZKY"}</p>{demo===null?<><h2>Kde Wi‑Fi<br/>zlobí nejvíc?</h2>{["Jen dál od routeru","Také blízko routeru","Jen na jednom zařízení"].map((label,i)=><button className="mockOption" type="button" onClick={()=>setDemo(i)} key={label}>{label} <span>→</span></button>)}<p className="safe">● Zatím nic neměníme. Nejdřív zjistíme příčinu.</p></>:<div className="mockResult"><h2>{demoResults[demo].title}</h2><p>{demoResults[demo].text}</p><a className="mockCta" href="#objednat">Chci celý postup <span>↓</span></a></div>}</div></div></section>
<section className="problemBand"><div className="wrap"><p className="sectionKicker">Poznáváte to?</p><div className="painGrid">{pains.map(([t,b],i)=><article key={t}><b>0{i+1}</b><h3>{t}</h3><p>{b}</p></article>)}</div></div></section>
<section className="how wrap" id="jak" data-track-section><div className="sectionHead"><p className="eyebrow"><span/> Jak to funguje</p><h2>Žádné hádání.<br/><em>Jeden krok po druhém.</em></h2><p>Wi‑Fi Doktor vás nezahltí pojmy. Podle vybraného problému ukáže konkrétní kontroly a kroky.</p></div><div className="steps">{steps.map(([n,t,b])=><article key={n}><span>{n}</span><div><h3>{t}</h3><p>{b}</p></div></article>)}</div></section>
<section className="inside"><div className="wrap insideGrid"><div><p className="eyebrow light"><span/> Co získáte</p><h2>Technikův postup.<br/><em>Normální řečí.</em></h2><p className="insideLead">U každého kroku přesně víte čtyři věci:</p><div className="formula"><span>CO</span><i>→</i><span>KDE</span><i>→</i><span>PROČ</span><i>→</i><span>OVĚŘIT</span></div></div><ul><li><b>Rozlišení příčiny</b><span>Wi‑Fi, přípojka, pokrytí nebo zařízení</span></li><li><b>Návody bez zkratek</b><span>Kam kliknout a co přesně zvolit</span></li><li><b>Bezpečné změny</b><span>Jedna úprava, jeden test, možnost návratu</span></li><li><b>Jasný další krok</b><span>I když už je potřeba poskytovatel či technik</span></li></ul></div></section>
<section className="truth wrap"><div className="truthCard"><span className="quote">„</span><div><p>Neprodáváme vám další chytrou krabičku.</p><h2>Nejdřív zjistíte, co je skutečně špatně. Možná nový router vůbec nepotřebujete.</h2></div></div></section>
<section className="offer wrap" id="objednat" data-track-section><div className="offerCopy"><p className="eyebrow"><span/> Wi‑Fi Doktor</p><h2>Méně nervů.<br/><em>Více funkční Wi‑Fi.</em></h2><p>Jednorázový přístup k interaktivnímu průvodci pro běžné problémy domácí Wi‑Fi.</p><div className="featureChips"><span>Pomalá Wi‑Fi</span><span>Výpadky</span><span>Slabý signál</span><span>Jedno zařízení</span></div></div><div className="priceCard">{checkout==="error"&&<p className="checkoutNotice" role="alert">Platbu se nepodařilo připravit. Zkuste to za chvíli. Pokud jste již zaplatili, použijte potvrzení objednávky a neplaťte znovu.</p>}{checkout==="cancelled"&&<p className="checkoutNotice" role="status">Platba byla přerušena. Objednávku můžete dokončit tlačítkem níže.</p>}<p>JEDNORÁZOVÝ PŘÍSTUP</p><div className="price"><strong>299</strong><span>Kč</span></div><small>Žádné předplatné</small><form action="/api/checkout" method="post" data-analytics="checkout-start"><button className="primary full" type="submit">Koupit bezpečně přes Stripe <Arrow/></button></form><ul><li>✓ Potvrzení platby ihned</li><li>✓ Použití na mobilu i počítači</li><li>✓ Lidské vysvětlení každého kroku</li></ul><p className="note">Bezpečná jednorázová platba. Platební údaje zadáváte přímo na stránce Stripe.</p></div></section>
<section className="faq wrap" id="faq" data-track-section><div className="sectionHead compact"><p className="eyebrow"><span/> Rychlé otázky a odpovědi</p><h2>Vše důležité bez rozklikávání.</h2><p>Odpovědi jsou otevřené rovnou, abyste mohli rychle posoudit, zda je Wi‑Fi Doktor pro vás.</p></div><div className="faqList">{faqs.map(([q,a])=><article className="faqItem" key={q}><h3>{q}</h3><p>{a}</p></article>)}</div></section>
<section className="finalCta"><div className="wrap"><p className="eyebrow light"><span/> Udělejte první krok</p><h2>Než koupíte nový router,<br/><em>zjistěte, kde je problém.</em></h2><a className="primary white" href="#objednat">Chci vyřešit Wi‑Fi <Arrow/></a></div></section>
<footer className="wrap"><a className="brand" href="#top"><span className="brandMark">W</span><span>Wi‑Fi Doktor</span></a><nav className="footerLinks"><a href="/obchodni-podminky">Obchodní podmínky</a><a href="/ochrana-soukromi">Ochrana soukromí</a></nav><span>© 2026</span></footer><form className="mobileBuyForm" action="/api/checkout" method="post" data-analytics="checkout-start"><button className="mobileBuy" type="submit">Koupit Wi‑Fi Doktora · 299 Kč <Arrow/></button></form></main>}
