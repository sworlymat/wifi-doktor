"use client";
import { useEffect, useState } from "react";
const pains=[["Wi‑Fi je pomalá","Stránky se načítají věčnost a video se seká."],["Připojení vypadává","Telefon nebo televize se pořád odpojují."],["Signál nedosáhne všude","V ložnici, patře nebo na zahradě Wi‑Fi mizí."],["Zlobí jen jedno zařízení","Ostatní fungují, ale jeden telefon či notebook ne."]];
const steps=[["01","Vyberete, co nefunguje","Žádná učebnice. Začnete rovnou svým problémem."],["02","Projdete doporučené kontroly","Průvodce rozliší Wi‑Fi, internet, pokrytí i konkrétní zařízení."],["03","Uděláte jeden bezpečný krok","Dostanete konkrétní pokyn a popis, jak ověřit výsledek."],["04","Ověříte výsledek","Teprve když krok nepomohl, pokračujete dál."]];
const faqs=[
  ["Co přesně po zaplacení dostanu?","Okamžitě se otevře interaktivní Wi‑Fi Doktor. Podle toho, co doma nefunguje, vás provede kontrolami a vždy ukáže jeden konkrétní krok, jeho smysl a způsob ověření výsledku."],
  ["Jak rychle získám přístup?","Po úspěšné platbě přes Stripe se přístup zobrazí přímo v prohlížeči. Odkaz si uložte do záložek, protože slouží jako váš osobní vstup do průvodce."],
  ["Je 299 Kč jednorázová platba?","Ano. Nejde o předplatné a žádná další pravidelná platba se nestrhává."],
  ["Jak funguje 14denní garance vrácení peněz?","Když zjistíte, že Wi‑Fi Doktor není pro vás, napište do 14 dnů od zaplacení z e-mailu použitého při nákupu na pepik.kup@gmail.com. Stačí uvést, že žádáte vrácení peněz. Po ověření objednávky vrátíme celých 299 Kč stejnou platební metodou."],
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
const demoQ2=["Všechna zařízení v domácnosti","Jen jedno konkrétní (telefon, TV, notebook)"];
const demoQ3=["Nový (do 2 let)","Starší než 4 roky / od operátora"];
const quizQuestions=[
  {
    q:"Co vaši Wi‑Fi nejvíce trápí?",
    options:[
      {text:"Pomalé načítání stránek a sekání videa"},
      {text:"Připojení nahodile padá a odpojuje se"},
      {text:"Slabý signál v patře nebo v jiné místnosti"},
      {text:"Zlobí jen jedno konkrétní zařízení (ostatní fungují)"}
    ]
  },
  {
    q:"Kdy se problém projevuje nejčastěji?",
    options:[
      {text:"Neustále, po celý den i noc"},
      {text:"Hlavně večer ve špičce, když jsou doma sousedé"},
      {text:"Jen když se vzdálím od routeru o pár metrů"},
      {text:"Zcela nahodile několikrát za týden"}
    ]
  },
  {
    q:"Kde máte router doma fyzicky umístěný?",
    options:[
      {text:"Na volném stolku nebo otevřené polici v prostoru"},
      {text:"Schovaný ve skříni, za televizí nebo na podlaze"},
      {text:"V technické místnosti / v plechové rozvodné skříni"},
      {text:"Nevím přesně, kde router je"}
    ]
  },
  {
    q:"Jak starý je váš router / modem?",
    options:[
      {text:"Novější (zakoupený do 2 let)"},
      {text:"Starší než 4 roky (černá krabička od operátora)"},
      {text:"Starý více než 6–8 let"},
      {text:"Nevím, dostal jsem ho při zřízení internetu"}
    ]
  }
];
const Arrow=()=> <span aria-hidden="true">↗</span>;
export default function Home({checkout}:{checkout?:string}){
  const[demo,setDemo]=useState<number|null>(null);
  const[demoStep,setDemoStep]=useState(0);
  const[quizStep,setQuizStep]=useState(0);
  const[quizAnswers,setQuizAnswers]=useState<number[]>([]);
  const resetDemo=()=>{setDemo(null);setDemoStep(0);};
  const progressWidth=demoStep===0?"33%":demoStep===1?"66%":"100%";
  useEffect(()=>{
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
  window.addEventListener("pagehide",sendExit);
  return()=>{observer.disconnect();window.removeEventListener("scroll",updateScroll);window.removeEventListener("pagehide",sendExit);checkoutForms.forEach(form=>form.removeEventListener("submit",checkoutStarted));};
},[]);return <main>
<header className="nav wrap"><a className="brand" href="#top"><span className="brandMark">W</span><span>Wi‑Fi Doktor</span></a><a className="navCta" href="#objednat">Získat průvodce <Arrow/></a></header>
<section className="hero wrap" id="top" data-track-section><div className="heroCopy"><p className="eyebrow"><span/> Interaktivní pomoc pro domácí Wi‑Fi</p><h1>Wi‑Fi zlobí?<br/><em>Opravte ji sami.</em></h1><p className="lead">Zjistěte, proč je vaše Wi‑Fi pomalá, vypadává nebo nedosáhne všude. Bez technických znalostí. Krok za krokem.</p><div className="heroActions"><a className="primary" href="#objednat">Chci vyřešit Wi‑Fi <Arrow/></a><a className="textLink" href="#prediagnostika">Předdiagnostika zdarma ↓</a></div><div className="trustRow"><span>✓ Bez instalace</span><span>✓ Lidsky vysvětlené</span><span>✓ Bez zásahu naslepo</span></div></div>
<div className="productMock"><div className="mockTop"><span className="mockLogo">W</span><span>Diagnostika</span><button className="stepPill" type="button" onClick={resetDemo}>{demo===null&&demoStep===0?"Ukázka postupu":"Začít znovu ↺"}</button></div><div className="mockProgress"><i style={{width:demo!==null?progressWidth:"38%"}}/></div><div className="mockBody" aria-live="polite"><span className="signal">{demoStep<2&&demo===null?"⌁":"✓"}</span><p className="smallLabel">{demoStep===2?"VÝSLEDEK UKÁZKY":`RYCHLÁ KONTROLA · KROK ${demoStep+1}/3`}</p>{demoStep===0&&demo===null?<><h2>Kde Wi‑Fi<br/>zlobí nejvíc?</h2>{["Jen dál od routeru","Také blízko routeru","Jen na jednom zařízení"].map((label,i)=><button className="mockOption" type="button" onClick={()=>{setDemo(i);setDemoStep(1);}} key={label}>{label} <span>→</span></button>)}<p className="safe">● Zatím nic neměníme. Nejdřív zjistíme příčinu.</p></>:demoStep===1?<><h2>Která zařízení<br/>mají problém?</h2>{demoQ2.map((label,i)=><button className="mockOption" type="button" onClick={()=>setDemoStep(2)} key={label}>{label} <span>→</span></button>)}<p className="safe">● Krok 2 ze 3. Odpověď nás dovede k příčině.</p></>:<div className="mockResult"><h2>{demoResults[demo??0].title}</h2><p>{demoResults[demo??0].text}</p><p className="diagBadge">🎯 Pravděpodobnost vyřešení bez nového routeru: <strong>88 %</strong></p><a className="mockCta" href="#objednat">Odemknout celý postup za 299 Kč <span>↓</span></a></div>}</div></div></section>
<section className="preSection wrap" id="prediagnostika" aria-labelledby="pre-heading" data-track-section><div className="preIntro"><p className="eyebrow"><span/> Rychlá předdiagnostika</p><h2 id="pre-heading">Nevíte, jestli vám<br/><em>Wi‑Fi Doktor pomůže?</em></h2><p>Odpovězte na 4 bleskové otázky a za 60 sekund zjistěte, kde je pravděpodobně zakopaný pes.</p><div className="preBadges"><span className="preFree">ZDARMA</span><span className="preNoSignup">✓ Bez registrace a bez e‑mailu</span></div></div><div className="preCard">{quizStep<quizQuestions.length?<> <div className="preQuizHeader"><p className="smallLabel">OTÁZKA {quizStep+1} ZE 4</p><span className="quizStepNumber">{quizStep+1}/4</span></div><div className="mockProgress"><i style={{width:`${((quizStep+1)/4)*100}%`}}/></div><h3>{quizQuestions[quizStep].q}</h3><div className="preOptions">{quizQuestions[quizStep].options.map((opt,i)=><button key={opt.text} type="button" className="mockOption" onClick={()=>{setQuizAnswers(prev=>[...prev,i]);setQuizStep(prev=>prev+1);}}><span>{opt.text}</span><span aria-hidden="true">→</span></button>)}</div></>:<div className="preResult"><span className="signal">🎯</span><p className="smallLabel">VÝSLEDEK VAŠÍ PŘEDDIAGNOSTIKY</p><h3>{quizAnswers[0]===0&&"Rušení frekvence 2,4 GHz a nevhodný vysílací kanál"}{quizAnswers[0]===1&&"Nestabilita spojení a kolísání odezvy routeru"}{quizAnswers[0]===2&&"Stínění signálu překážkami a nevhodná pozice routeru"}{quizAnswers[0]===3&&"Konflikt nastavení síťové karty konkrétního zařízení"}{quizAnswers[0]===undefined&&"Zarušené pásmo a nevhodná pozice routeru"}</h3><p className="preResultText">Podle vašich odpovědí je přívodní kabel od operátora v pořádku. Potíž vzniká v domácí části sítě.</p><p className="diagBadge">🎯 Pravděpodobnost vyřešení bez koupě nového routeru: <strong>88 %</strong></p><div className="preResultActions"><a className="primary full" href="#objednat">Vybrat způsob řešení níže ↓</a><button type="button" className="secondary full" onClick={()=>{setQuizStep(0);setQuizAnswers([]);}}>Spustit test znovu ↺</button></div></div>}</div></section>
<section className="problemBand" id="problemy" data-track-section><div className="wrap"><p className="sectionKicker">Poznáváte to?</p><div className="painGrid">{pains.map(([t,b],i)=><article key={t}><b>0{i+1}</b><h3>{t}</h3><p>{b}</p></article>)}</div></div></section>
<section className="how wrap" id="jak" data-track-section><div className="sectionHead"><p className="eyebrow"><span/> Jak to funguje</p><h2>Žádné hádání.<br/><em>Jeden krok po druhém.</em></h2><p>Wi‑Fi Doktor vás nezahltí pojmy. Podle vybraného problému ukáže konkrétní kontroly a kroky.</p></div><div className="steps">{steps.map(([n,t,b])=><article key={n}><span>{n}</span><div><h3>{t}</h3><p>{b}</p></div></article>)}</div></section>
<section className="inside" id="obsah" data-track-section><div className="wrap insideGrid"><div><p className="eyebrow light"><span/> Co získáte</p><h2>Technikův postup.<br/><em>Normální řečí.</em></h2><p className="insideLead">U každého kroku přesně víte čtyři věci:</p><div className="formula"><span>CO</span><i>→</i><span>KDE</span><i>→</i><span>PROČ</span><i>→</i><span>OVĚŘIT</span></div></div><ul><li><b>Rozlišení příčiny</b><span>Wi‑Fi, přípojka, pokrytí nebo zařízení</span></li><li><b>Návody bez zkratek</b><span>Kam kliknout a co přesně zvolit</span></li><li><b>Bezpečné změny</b><span>Jedna úprava, jeden test, možnost návratu</span></li><li><b>Jasný další krok</b><span>I když už je potřeba poskytovatel či technik</span></li></ul></div></section>
<section className="truth wrap" id="proc" data-track-section><div className="truthCard"><span className="quote">„</span><div><p>Neprodáváme vám další chytrou krabičku.</p><h2>Nejdřív zjistíte, co je skutečně špatně. Možná nový router vůbec nepotřebujete.</h2></div></div></section>
<section className="offer wrap" id="objednat" data-track-section><div className="offerCopy"><p className="eyebrow"><span/> Wi‑Fi Doktor · Výběr balíčku</p><h2>Méně nervů.<br/><em>Více funkční Wi‑Fi.</em></h2><p>Vyberte si úroveň řešení. Projděte si sami interaktivního průvodce, nebo získejte jistotu s technikem v zádech.</p><div className="featureChips"><span>Pomalá Wi‑Fi</span><span>Výpadky</span><span>Slabý signál</span><span>Jedno zařízení</span></div></div>{checkout==="error"&&<p className="checkoutNotice" role="alert">Platbu se nepodařilo připravit. Zkuste to za chvíli. Pokud jste již zaplatili, použijte potvrzení objednávky a neplaťte znovu.</p>}{checkout==="cancelled"&&<p className="checkoutNotice" role="status">Platba byla přerušena. Objednávku můžete dokončit tlačítkem níže.</p>}<div className="pricingGrid"><div className="priceCard"><p className="planKicker">ZÁKLADNÍ BALÍČEK</p><h3>Samoobslužný průvodce</h3><div className="price"><strong>299</strong><span>Kč</span></div><small>Jednorázová platba · Žádné předplatné</small><div className="priceAnchor"><span>❌ Výjezd technika: 1 500 Kč</span><span>❌ Nový router naslepo: 2 500 Kč</span><span>✅ Wi‑Fi Doktor: <strong>299 Kč</strong></span></div><div className="guarantee"><span aria-hidden="true">14</span><p><strong>14 dní na vyzkoušení</strong>Když vám průvodce nesedne, vrátíme vám celých 299 Kč.</p></div><form action="/api/checkout" method="post" data-analytics="checkout-start"><input type="hidden" name="plan" value="basic"/><button className="primary full" type="submit">Koupit bezpečně přes Stripe <Arrow/></button></form><div className="guaranteeBadge">🛡️ <strong>100% garance vrácení peněz.</strong> Pokud vám průvodce nepomůže, vrátíme 299 Kč bez otázek.</div><ul><li>✓ Doživotní přístup k interaktivnímu průvodci</li><li>✓ Postup krok za krokem bez IT žargonu</li><li>✓ Generátor stížnosti pro operátora</li><li>✓ Doporučení ověřeného hardware</li><li>✓ Použití na mobilu i počítači</li><li>✓ 14denní garance vrácení peněz</li></ul><p className="note">Bezpečná jednorázová platba. Platební údaje zadáváte přímo na stránce Stripe.</p></div><div className="priceCard featured"><div className="popularRibbon">⭐ NEJOBLÍBENĚJŠÍ VOLBA</div><p className="planKicker">KOMPLETNÍ BALÍČEK</p><h3>Průvodce + Asistence technika</h3><div className="price"><strong>590</strong><span>Kč</span></div><small>Jednorázová platba · Doživotní přístup + SOS podpora</small><div className="priceAnchor"><span>❌ Samostatný výjezd servisního technika: 1 500 Kč</span><span>✅ Kompletní asistence na dálku: <strong>590 Kč</strong></span></div><div className="guarantee"><span aria-hidden="true">14</span><p><strong>100% jistota vyřešení</strong>Pokud problém neodstraníme ani s technikem, vrátíme vám peníze.</p></div><form action="/api/checkout" method="post" data-analytics="checkout-start"><input type="hidden" name="plan" value="premium"/><button className="primary full featuredBtn" type="submit">Zvolit Komplet s asistencí (590 Kč) <Arrow/></button></form><div className="guaranteeBadge">🛡️ <strong>100% garance vyřešení.</strong> Technik se vaší síti osobně pověnuje.</div><ul><li>✓ <strong>Vše z balíčku Základ</strong></li><li>✓ <strong>SOS asistence na WhatsAppu / e‑mailu</strong></li><li>✓ <strong>Kooperace při měření s aplikací WiFiman</strong></li><li>✓ <strong>Možnost poslat fotky routeru, kabeláže a kontrolek</strong></li><li>✓ <strong>Osobní zhodnocení situace technikem do 24 hod</strong></li><li>✓ Doporučení přesného postupu na míru vašemu bytu</li><li>✓ 14denní garance vrácení peněz</li></ul><p className="note">Bezpečná jednorázová platba přes Stripe. Žádné předplatné ani skryté poplatky.</p></div></div></section>
<section className="faq wrap" id="faq" data-track-section><div className="sectionHead compact"><p className="eyebrow"><span/> Rychlé otázky a odpovědi</p><h2>Vše důležité bez rozklikávání.</h2><p>Odpovědi jsou otevřené rovnou, abyste mohli rychle posoudit, zda je Wi‑Fi Doktor pro vás.</p></div><div className="faqList">{faqs.map(([q,a])=><article className="faqItem" key={q}><h3>{q}</h3><p>{a}</p></article>)}</div></section>
<section className="finalCta" id="zaver" data-track-section><div className="wrap"><p className="eyebrow light"><span/> Udělejte první krok</p><h2>Než koupíte nový router,<br/><em>zjistěte, kde je problém.</em></h2><a className="primary white" href="#objednat">Chci vyřešit Wi‑Fi <Arrow/></a></div></section>
<footer className="wrap"><a className="brand" href="#top"><span className="brandMark">W</span><span>Wi‑Fi Doktor</span></a><nav className="footerLinks"><a href="/obchodni-podminky">Obchodní podmínky</a><a href="/ochrana-soukromi">Ochrana soukromí</a></nav><span>© 2026</span></footer><form className="mobileBuyForm" action="/api/checkout" method="post" data-analytics="checkout-start"><input type="hidden" name="plan" value="basic"/><button className="mobileBuy" type="submit">Koupit Wi‑Fi Doktora · 299 Kč <Arrow/></button></form></main>}
