import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url);
test('quiz asks three questions, uses device and router answers, and resets',()=>{
 const states=[];let cursor=0;
 const exports={};
 const code=ts.transpileModule(readFileSync(new URL('../app/Home.tsx',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 new Function('require','exports',code)(id=>id==='react'?{useEffect(){},useState(initial){const i=cursor++;if(!(i in states))states[i]=initial;return [states[i],v=>{states[i]=v;}];}}:require(id),exports);
 function render(){cursor=0;return exports.default({});}
 function nodes(v){if(v==null||typeof v==='boolean')return [];if(Array.isArray(v))return v.flatMap(nodes);return [v,...(v.props?nodes(v.props.children):[])];}
 function text(v){return nodes(v).filter(x=>typeof x==='string'||typeof x==='number').join(' ');}
 function click(label){const b=nodes(render()).find(x=>x.type==='button'&&text(x).includes(label));assert.ok(b,label);b.props.onClick();}
 assert.match(text(render()),/KROK 1\/3/);
 click('Jen dál od routeru');assert.match(text(render()),/KROK 2\/3/);
 click('Jen jedno konkrétní');assert.match(text(render()),/KROK 3\/3/);
 assert.doesNotMatch(text(render()),/VÝSLEDEK UKÁZKY/);
 click('Starší než 4 roky');assert.match(text(render()),/Začneme u zařízení/);assert.match(text(render()),/U staršího routeru/);
 click('Začít znovu');assert.match(text(render()),/KROK 1\/3/);
 click('Také blízko routeru');click('Všechna zařízení');click('Nevím');assert.match(text(render()),/Prověříme přípojku i router/);
});
