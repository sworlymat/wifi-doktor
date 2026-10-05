export function initializeLanding(){const controller=new AbortController();const listen=(target,type,handler)=>target.addEventListener(type,handler,{signal:controller.signal});
const menu = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
listen(menu,'click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open); });
navigation.querySelectorAll('a').forEach(link => listen(link,'click', () => { navigation.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }));
listen(document,'keydown', event => { if(event.key === 'Escape' && navigation.classList.contains('open')){ navigation.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.focus(); } });
const questions = [
 { title:'Co vás nejvíc trápí?', choices:[['slow','Pomalá Wi-Fi'],['drops','Připojení vypadává'],['signal','Slabý signál v jiné místnosti'],['device','Zlobí jen jedno zařízení']] },
 { title:'Na kolika zařízeních se problém objevuje?', choices:[['one','Jen na jednom'],['many','Na více zařízeních'],['unknown','Zatím nevím']] },
 { title:'Je připojení těsně u routeru lepší?', choices:[['better','Ano, je znatelně lepší'],['same','Ne, problém zůstává'],['untested','Ještě jsem to nezkoušel/a']] },
 { title:'Funguje internet přes síťový kabel?', choices:[['works','Ano, přes kabel funguje dobře'],['bad','Ne, zlobí i přes kabel'],['nocable','Kabel nemám nebo nevím']] }
];
let answers = []; let step = 0;
const content = document.getElementById('quiz-content'), label = document.getElementById('quiz-label'), progress = document.getElementById('quiz-progress'), back = document.getElementById('quiz-back'), reset = document.getElementById('quiz-reset');
function render(focus = false){
 back.hidden = step === 0 || step === questions.length; reset.hidden = step === 0;
 progress.style.width = `${Math.min(100,(step+1)*25)}%`;
 if(step < questions.length){
  label.textContent = `OTÁZKA ${step+1} ZE 4`;
  content.replaceChildren(); const title = document.createElement('h3'); title.textContent = questions[step].title; title.tabIndex = -1; content.append(title);
  const group = document.createElement('div'); group.className='quiz-options'; content.append(group);
  for(const [value,text] of questions[step].choices){ const button = document.createElement('button'); button.textContent = text; listen(button,'click',()=>{answers[step]=value; step++; render(true);}); group.append(button); }
  if(focus) title.focus({preventScroll:true});
 }else{
  label.textContent = 'VAŠE ORIENTAČNÍ VYHODNOCENÍ';
  let title, explanation, action;
  if(answers[1]==='one'){title='Začněte konkrétním zařízením.';explanation='Pokud ostatní zařízení fungují, může být příčina v připojení nebo nastavení právě tohoto zařízení.';action='Porovnejte na stejném místě připojení s jiným telefonem nebo počítačem.';}
  else if(answers[3]==='bad'){title='Prověřte internetovou přípojku.';explanation='Když problém přetrvává i přes kabel, nemusí být příčina jen ve Wi-Fi. Roli může hrát přípojka, router nebo poskytovatel.';action='Poznamenejte si, kdy se problém objevuje a zda se týká všech zařízení. S těmito informacemi kontaktujte poskytovatele.';}
  else if(answers[2]==='better'){title='Zaměřte se na pokrytí.';explanation='Lepší připojení u routeru naznačuje, že roli může hrát vzdálenost, překážky nebo rušení.';action='Porovnejte stejné zařízení u routeru a v místnosti, kde připojení zlobí. Než něco kupujete, zkuste hledat vhodnější umístění routeru.';}
  else if(answers[3]==='works'){title='Začněte domácí Wi-Fi.';explanation='Funkční připojení přes kabel naznačuje, že se vyplatí zaměřit na bezdrátovou část sítě.';action='Porovnejte dvě zařízení těsně u routeru. Při dalších změnách upravujte vždy jen jednu věc a ověřte výsledek.';}
  else{title='Nejdřív oddělte Wi-Fi od přípojky.';explanation='Z odpovědí zatím nelze spolehlivě rozlišit příčinu. Jednoduché srovnání vám pomůže vybrat další směr.';action='Zkuste stejné zařízení blízko routeru a porovnejte ho s jiným zařízením. Pokud je to možné, ověřte také připojení přes kabel.';}
  content.replaceChildren(); const kicker=document.createElement('p');kicker.className='result-kicker';kicker.textContent='KDE ZAČÍT';const heading=document.createElement('h3');heading.textContent=title;heading.tabIndex=-1;const explanationNode=document.createElement('p');explanationNode.textContent=explanation;const actionNode=document.createElement('p');const strong=document.createElement('strong');strong.textContent='První krok: ';actionNode.append(strong,action);const caveat=document.createElement('p');caveat.className='card-note';caveat.textContent='Jde o orientační doporučení podle odpovědí, ne o změřenou diagnózu.';const link=document.createElement('a');link.className='button';link.href='#cena';link.textContent='Prohlédnout kompletního průvodce';content.append(kicker,heading,explanationNode,actionNode,caveat,link);if(focus)heading.focus({preventScroll:true});
 }
}
listen(back,'click',()=>{if(step>0){step--;answers=answers.slice(0,step);render(true);}});
listen(reset,'click',()=>{step=0;answers=[];render(true);});
document.querySelectorAll('[data-problem]').forEach(button=>listen(button,'click',()=>{answers=[button.dataset.problem];step=1;render();document.getElementById('diagnostika').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}));
render();
return()=>controller.abort();}
