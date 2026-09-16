import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost" + path, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the Wi-Fi Doktor sales page and Stripe checkout form", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Wi‑Fi Doktor/);
  assert.match(html, /Opravte ji sami/);
  assert.match(html, /action="\/api\/checkout" method="post"/);
  assert.match(html, /Koupit bezpečně přes Stripe/);
  assert.match(html, /299/);
  assert.match(html, /Vše důležité bez rozklikávání/);
  assert.match(html, /Co přesně po zaplacení dostanu/);
  assert.match(html, /Jak rychle získám přístup/);
  assert.match(html, /žádná další pravidelná platba se nestrhává/);
  assert.doesNotMatch(html, /sk_(test|live)_|rk_(test|live)_/);
});

test("all public pages render; private guide is denied without payment and is not cached", async () => {
  for (const path of ["/obchodni-podminky", "/ochrana-soukromi", "/pruvodce", "/objednavka/uspech"]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get("referrer-policy"), "no-referrer");
    const html = await response.text();
    assert.match(html, /Wi.?Fi Doktor/);
    if (path === "/pruvodce") {
      assert.equal(response.headers.get("cache-control"), "private, no-store");
      assert.doesNotMatch(html, /Co vaše Wi.Fi právě dělá/);
      assert.match(html, /Průvodce je pro zákazníky/);
    }
  }
});

test("cancelled and failed checkout show an explanation instead of silently returning home", async () => {
  assert.match(await (await render("/?checkout=error")).text(), /Platbu se nepodařilo připravit/);
  assert.match(await (await render("/?checkout=cancelled")).text(), /Platba byla přerušena/);
});

test("checkout keeps price and credentials server-side", async () => {
  const [checkout, stripe, webhook] = await Promise.all([
    readFile(new URL("../app/api/checkout/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/stripe.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/stripe/webhook/route.ts", import.meta.url), "utf8"),
  ]);
  assert.match(checkout, /unit_amount:\s*29900/);
  assert.match(checkout, /mode:\s*"payment"/);
  assert.doesNotMatch(checkout, /payment_method_types/);
  assert.match(stripe, /process\.env\.STRIPE_RESTRICTED_KEY/);
  assert.match(webhook, /constructEvent/);
  assert.match(webhook, /STRIPE_WEBHOOK_SECRET/);
  assert.doesNotMatch(`${checkout}\n${stripe}\n${webhook}`, /[sr]k_(test|live)_[A-Za-z0-9]+/);
  assert.match(checkout, /insert\(orders\)/);
  assert.match(webhook, /onConflictDoUpdate/);
});

test("orders are persisted in D1 without card data", async () => {
  const [schema, hosting] = await Promise.all([
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  ]);
  assert.match(schema, /sqliteTable\("orders"/);
  assert.match(schema, /checkout_session_id/);
  assert.doesNotMatch(schema, /card_number|card_cvc/);
  assert.equal(JSON.parse(hosting).d1, "DB");
});

test("anonymous funnel events are stored without personal or form data", async () => {
  const [schema, endpoint, home] = await Promise.all([
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/analytics/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/Home.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(schema, /sqliteTable\("analytics_events"/);
  assert.match(schema, /referrer_host/);
  assert.match(schema, /duration_ms/);
  const analyticsSchema = schema.slice(schema.indexOf("export const analyticsEvents"));
  assert.doesNotMatch(analyticsSchema, /ip_address|user_agent|email/);
  assert.match(endpoint, /allowedEvents/);
  assert.match(home, /section_view/);
  assert.match(home, /checkout_start/);
  assert.match(home, /page_exit/);
});
