import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url);
function load(path,mocks={}){const exports={};new Function('require','exports',ts.transpileModule(readFileSync(new URL('../'+path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText)(id=>mocks[id]??require(id),exports);return exports;}
const logic=load('lib/prediagnostic.ts');
test('all 180 answer combinations produce supported deterministic results',()=>{
 const reached=new Set();let count=0;
 for(const [p] of logic.questions[0].options)for(const [l] of logic.questions[1].options)for(const [n] of logic.questions[2].options)for(const [w] of logic.questions[3].options){const a=[p,l,n,w];const r=logic.classify(a);assert.ok(logic.results[r]);assert.equal(r,logic.classify(a));reached.add(r);count++;}
 assert.equal(count,180);assert.deepEqual([...reached].sort(),['A','B','C','D','E']);
});
test('evidence precedence, ambiguity and incomplete input',()=>{
 for(const [answers,expected] of [
  [['signal','rooms','yes','yes'],'A'],[['signal','rooms','unknown','yes'],'A'],
  [['drops','unknown','no','no'],'B'],[['slow','everywhere','yes','no'],'B'],
  [['video','device','yes','yes'],'C'],[['slow','everywhere','no','yes'],'D'],
  [['other','unknown','unknown','unknown'],'E'],[['signal','rooms','no','yes'],'E'],
  [['video','device','no','no'],'E'],[[],'E'],[['invalid','rooms','yes','yes'],'E']])assert.equal(logic.classify(answers),expected,answers.join(','));
});
function harness(){let cursor=0;const state=[],refs=[],events=[];const hooks={useEffect(){},useState(initial){const i=cursor++;if(!(i in state))state[i]=initial;return[state[i],v=>state[i]=v];},useRef(initial){const i=cursor++;return refs[i]??=( {current:initial});}};const component=load('app/Prediagnostic.tsx',{'react':hooks,'../lib/prediagnostic':logic,'../lib/analytics':{track:(...args)=>events.push(args)}});function render(){cursor=0;return component.default();}function nodes(v){if(v==null||typeof v==='boolean')return[];if(Array.isArray(v))return v.flatMap(nodes);return[v,...(v.props?nodes(v.props.children):[])];}function text(v){return nodes(v).filter(x=>typeof x==='string'||typeof x==='number').join(' ').replace(/\s+/g,' ').trim();}function click(label){const b=nodes(render()).find(x=>x.type==='button'&&text(x)===label);assert.ok(b,label);b.props.onClick();}return{render,nodes,text,click,events,component};}
test('four steps, back, answer changes, event deduplication, BASIC form and restart',()=>{
 const h=harness();h.click('Zjistit problém za 60 sekund →');
 for(const [i,label] of ['Slabý signál →','Jen v některých místnostech →','Ano →'].entries()){assert.equal(h.nodes(h.render()).find(x=>x.type==='progress').props.value,i+1);h.click(label);}
 assert.equal(h.nodes(h.render()).find(x=>x.type==='progress').props.value,4);
 h.click('← Zpět');h.click('Ano →');h.click('Ano →');assert.match(h.text(h.render()),/Stopa vede k pokrytí/);
 const form=h.nodes(h.render()).find(x=>x.type==='form');assert.equal(form.props.action,'/api/checkout');assert.equal(form.props.method,'post');form.props.onSubmit();
 assert.deepEqual(h.events.map(x=>x[0]),['prediagnostic_started','prediagnostic_step_1','prediagnostic_step_2','prediagnostic_step_3','prediagnostic_completed','prediagnostic_result_A','basic_cta_clicked','checkout_start']);
 h.click('← Upravit odpovědi');h.click('Ne →');assert.equal(h.events.filter(x=>x[0]==='prediagnostic_completed').length,1);
 h.click('Začít znovu');assert.equal(h.nodes(h.render()).find(x=>x.type==='progress').props.value,1);
 assert.equal(h.component.TechnicianCTA({}),null);
 assert.ok(h.events.every(([,data])=>!('answers' in data)));
});
test('analytics endpoint accepts every funnel event and rejects unknown/cross-origin events',async()=>{
 const {eventTypes}=load('lib/analytics-events.ts');const stored=[];
 const {POST}=load('app/api/analytics/route.ts',{'../../../db':{getDb:()=>({insert:()=>({values:async v=>stored.push(v)})})},'../../../db/schema':{analyticsEvents:{}},'../../../lib/analytics-events':{eventTypes}});
 const request=(eventType,origin='https://wifi-doktor.com')=>new Request('https://wifi-doktor.com/api/analytics',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({sessionId:'qa',path:'/',eventType,answers:['private'],email:'not-stored@example.com',section:'prediagnostic:B'})});
 for(const e of eventTypes)assert.equal((await POST(request(e))).status,204,e);
 assert.equal((await POST(request('unrecognized'))).status,400);assert.equal((await POST(request('prediagnostic_started','https://other.example'))).status,403);
 assert.equal(stored.length,eventTypes.length);assert.ok(stored.every(x=>!('email'in x)&&!('answers'in x)));
});
