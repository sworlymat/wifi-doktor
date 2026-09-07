import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { DatabaseSync } from "node:sqlite";
import ts from "typescript";
import Stripe from "stripe";
import { drizzle } from "drizzle-orm/d1";
const require = createRequire(import.meta.url);
function load(path, mocks = {}) {
  const source = readFileSync(new URL("../" + path, import.meta.url), "utf8");
  const code = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const exports = {};
  new Function("require","exports",code)((id) => mocks[id] ?? require(id), exports);
  return exports;
}
function database() {
  const sqlite = new DatabaseSync(":memory:");
  for (const f of readdirSync(new URL("../drizzle", import.meta.url)).filter(f=>f.endsWith(".sql")).sort()) {
    sqlite.exec(readFileSync(new URL("../drizzle/"+f,import.meta.url),"utf8"));
  }
  const d1 = {prepare(query) {
    let params = [];
    return {
      bind(...args) {params=args;return this;},
      async raw() {const stmt=sqlite.prepare(query);stmt.setReturnArrays(true);return stmt.all(...params);},
      async all() {return {results:sqlite.prepare(query).all(...params)};},
      async run() {return {meta:sqlite.prepare(query).run(...params)};},
    };
  }};
  return {sqlite,db:drizzle(d1)};
}
const session = {id:"cs_test_fixture",object:"checkout.session",mode:"payment",status:"complete",payment_status:"paid",amount_total:29900,currency:"czk",metadata:{product:"wifi-doktor"},customer_details:{email:"fixture@example.com"},customer:null,payment_intent:null};
test("access distinguishes payment states, invalid input and Stripe outages", async () => {
  let value=session;
  let calls=0;
  const {verifyAccess}=load("lib/access.ts",{"./stripe":{getStripeClient:()=>({checkout:{sessions:{retrieve:async()=>{calls++;if(value instanceof Error)throw value;return value;}}}})}});
  assert.equal((await verifyAccess(["cs_test_fixture"])).state,"unpaid");
  assert.equal(calls,0);
  assert.equal((await verifyAccess(session.id)).state,"paid");
  value={...session,amount_total:1};
  assert.equal((await verifyAccess(session.id)).state,"unpaid");
  value={...session,payment_status:"unpaid"};
  assert.equal((await verifyAccess(session.id)).state,"pending");
  value=new Error("network unavailable");
  assert.equal((await verifyAccess(session.id)).state,"unavailable");
  value=Object.assign(new Error("missing"),{code:"resource_missing"});
  assert.equal((await verifyAccess(session.id)).state,"unpaid");
});
test("signed webhooks persist payment, retry independently and prevent concurrent duplicates", async () => {
  const {sqlite,db}=database();
  const secret="whsec_fixture_only";
  const previous=process.env.STRIPE_WEBHOOK_SECRET;
  process.env.STRIPE_WEBHOOK_SECRET=secret;
  const stripe=new Stripe("fixture-only");
  let crmCalls=0,emailCalls=0,crmFails=true;
  let unblock, entered;
  let pause=false;
  const {POST}=load("app/api/stripe/webhook/route.ts",{
    "../../../../db":{getDb:()=>db},
    "../../../../db/schema":load("db/schema.ts"),
    "../../../../lib/site":{SITE_ORIGIN:"https://wifi-doktor.com"},
    "../../../../lib/stripe":{getStripeClient:()=>stripe},
    "../../../../lib/clickup":{createClickUpOrderTask:async()=>{crmCalls++;if(crmFails)throw new Error("offline");return "task-fixture";}},
    "../../../../lib/email":{sendOrderEmail:async()=>{emailCalls++;if(pause){entered();await new Promise(r=>{unblock=r;});}return true;}},
  });
  function request(type="checkout.session.completed",data=session) {
    const payload=JSON.stringify({id:"evt_fixture",type,data:{object:data}});
    const signature=stripe.webhooks.generateTestHeaderString({payload,secret});
    return new Request("https://wifi-doktor.com/api/stripe/webhook",{method:"POST",headers:{"stripe-signature":signature},body:payload});
  }
  try {
    assert.equal((await POST(new Request("https://wifi-doktor.com/api/stripe/webhook",{method:"POST",headers:{"stripe-signature":"invalid"},body:"{}"}))).status,400);
    assert.equal(sqlite.prepare("SELECT count(*) AS n FROM orders").get().n,0);
    assert.equal((await POST(request())).status,503);
    assert.equal(emailCalls,1,"CRM failure must not block the access email");
    assert.equal(sqlite.prepare("SELECT status FROM orders").get().status,"paid");
    crmFails=false;
    assert.equal((await POST(request())).status,200);
    assert.equal(emailCalls,1,"retry must not send email again");
    assert.equal(crmCalls,2);
    assert.equal((await POST(request())).status,200);
    assert.equal(crmCalls,2,"completed delivery must be idempotent");
    await POST(request("checkout.session.completed",{...session,id:"cs_test_pending",payment_status:"unpaid"}));
    assert.equal(sqlite.prepare("SELECT count(*) AS n FROM orders").get().n,1);
    pause=true;
    const started=new Promise(r=>{entered=r;});
    const first=POST(request("checkout.session.async_payment_succeeded",{...session,id:"cs_test_delayed"}));
    await started;
    assert.equal((await POST(request("checkout.session.async_payment_succeeded",{...session,id:"cs_test_delayed"}))).status,503);
    unblock();
    assert.equal((await first).status,200);
    assert.equal(sqlite.prepare("SELECT status FROM orders WHERE checkout_session_id='cs_test_delayed'").get().status,"paid");
  } finally {
    sqlite.close();
    if(previous===undefined)delete process.env.STRIPE_WEBHOOK_SECRET;else process.env.STRIPE_WEBHOOK_SECRET=previous;
  }
});
