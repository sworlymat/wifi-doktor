import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
function setup(path='/',search='') {
 const scripts=[];const writes=[];const w={location:{origin:'https://wifi-doktor.com',pathname:path,hostname:'wifi-doktor.com',search}};
 const d={title:'Wi-Fi Doktor',referrer:'https://example.com/private?secret=hidden',head:{appendChild:s=>scripts.push(s)},createElement:()=>({})};
 Object.defineProperty(d,'cookie',{get:()=> '_ga=abc; _ga_C82SCYPJR0=def; other=keep',set:v=>writes.push(v)});
 const exports={};const code=ts.transpileModule(readFileSync(new URL('../lib/google-analytics.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 new Function('exports','window','document',code)(exports,w,d);
 return {api:exports,w,d,scripts,writes,events:()=>w.dataLayer?.map(x=>Array.from(x))||[]};
}
test('GA remains unloaded before consent and excludes private access URLs',()=>{
 const a=setup();a.api.googleEvent('checkout_start');assert.equal(a.scripts.length,0);assert.equal(a.events().length,0);
 for(const [path,search] of [['/pruvodce','?session_id=secret'],['/objednavka/uspech','?session_id=secret'],['/','?session_id=secret']]){const b=setup(path,search);b.api.startGoogleAnalytics(path);assert.equal(b.scripts.length,0);}
});
test('GA loads once, redacts URL parameters, emits only allowed events and stops on withdrawal',()=>{
 const a=setup('/','?email=secret#token');a.api.startGoogleAnalytics('/');a.api.startGoogleAnalytics('/');
 assert.equal(a.scripts.length,1);assert.match(a.scripts[0].src,/G-C82SCYPJR0/);
 assert.equal(a.events().filter(x=>x[1]==='page_view').length,1);
 a.api.googleEvent('checkout_start');assert.equal(a.events().at(-1)[1],'begin_checkout');
 const n=a.events().length;a.api.googleEvent('email');assert.equal(a.events().length,n);
 assert.doesNotMatch(JSON.stringify(a.events()),/secret|hidden|token/);
 a.api.stopGoogleAnalytics();a.api.googleEvent('checkout_start');assert.equal(a.events().length,n);assert.equal(a.w['ga-disable-G-C82SCYPJR0'],true);
 a.api.clearGoogleCookies();assert.ok(a.writes.length>=4);assert.ok(a.writes.every(x=>x.startsWith('_ga')));
});
