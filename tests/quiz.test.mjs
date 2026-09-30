import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url);

test('free prediagnostic asks four questions, shows a result, and can restart',()=>{
 const states=[];let cursor=0;
 const exports={};
 const code=ts.transpileModule(readFileSync(new URL('../app/Home.tsx',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 new Function('require','exports',code)(id=>id==='react'?{useEffect(){},useState(initial){const i=cursor++;if(!(i in states))states[i]=initial;return [states[i],v=>{states[i]=typeof v==='function'?v(states[i]):v;}];}}:id==='../lib/google-analytics'?{googleEvent(){}}:require(id),exports);
 function render(){cursor=0;return exports.default({});}
 function nodes(v){if(v==null||typeof v==='boolean')return [];if(Array.isArray(v))return v.flatMap(nodes);return [v,...(v.props?nodes(v.props.children):[])];}
 function text(v){return nodes(v).filter(x=>typeof x==='string'||typeof x==='number').join(' ');}
 function click(label){const b=nodes(render()).find(x=>x.type==='button'&&text(x).includes(label));assert.ok(b,label);b.props.onClick();}
 assert.match(text(render()),/OTÁZKA\s+1\s+ZE\s+4/);
 click('Pomalá Wi-Fi (načítání stránek');assert.match(text(render()),/OTÁZKA\s+2\s+ZE\s+4/);
 click('Hlavně večer');assert.match(text(render()),/OTÁZKA\s+3\s+ZE\s+4/);
 click('Schovaný ve skříni');assert.match(text(render()),/OTÁZKA\s+4\s+ZE\s+4/);
 click('Starší než 4 roky');assert.match(text(render()),/VÝSLEDEK VAŠÍ PŘEDDIAGNOSTIKY/);
 click('Spustit test znovu');assert.match(text(render()),/OTÁZKA\s+1\s+ZE\s+4/);
});
