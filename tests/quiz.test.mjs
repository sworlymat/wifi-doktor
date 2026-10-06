import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

class Element {
  constructor(tag = "div") {
    this.tag = tag;
    this.children = [];
    this.listeners = {};
    this.attributes = {};
    this.style = {};
    this.hidden = false;
    this.focused = false;
    this.openClasses = new Set();
    this.classList = {
      toggle: (name, force) => {
        const next = force ?? !this.openClasses.has(name);
        next ? this.openClasses.add(name) : this.openClasses.delete(name);
        return next;
      },
      add: name => this.openClasses.add(name),
      remove: name => this.openClasses.delete(name),
      contains: name => this.openClasses.has(name),
    };
  }
  addEventListener(type, handler) { this.listeners[type] = handler; }
  click() { this.listeners.click?.({ currentTarget: this }); }
  append(...items) { this.children.push(...items); }
  replaceChildren(...items) { this.children = items; }
  querySelectorAll(selector) { return selector === "a" ? this.links ?? [] : []; }
  setAttribute(name, value) { this.attributes[name] = value; }
  getAttribute(name) { return this.attributes[name] ?? null; }
  focus() { this.focused = true; }
  scrollIntoView() { this.scrolled = true; }
}

function createPage() {
  const ids = Object.fromEntries(["menu-toggle", "navigation", "quiz-content", "quiz-label", "quiz-progress", "quiz-back", "quiz-reset", "diagnostika"].map(id => [id, new Element(id)]));
  ids["menu-toggle"].attributes["aria-expanded"] = "false";
  const heroProblem = new Element("button");
  heroProblem.dataset = { problem: "slow" };
  const listeners = {};
  const document = {
    createElement: tag => new Element(tag),
    getElementById: id => ids[id],
    querySelector: selector => selector === ".menu-toggle" ? ids["menu-toggle"] : null,
    querySelectorAll: selector => selector === "[data-problem]" ? [heroProblem] : [],
    addEventListener: (type, handler) => { listeners[type] = handler; },
  };
  const events = [];
  const source = readFileSync(new URL("../app/landing-interactions.js", import.meta.url), "utf8")
    .replace(/^import \{ track \} from "\.\.\/lib\/analytics";\s*/, "")
    .replace("export function initializeLanding", "function initializeLanding");
  const initialize = new Function("document", "matchMedia", "track", `${source}; return initializeLanding;`)(
    document,
    () => ({ matches: true }),
    (...args) => events.push(args),
  );
  const cleanup = initialize();
  const clickOption = label => {
    const group = ids["quiz-content"].children.find(node => node.className === "quiz-options");
    const option = group?.children.find(node => node.textContent === label);
    assert.ok(option, `missing quiz option: ${label}`);
    option.click();
  };
  return { ids, heroProblem, listeners, events, clickOption, cleanup };
}

test("hero and four-step diagnostic work and emit anonymous funnel metrics once", () => {
  const page = createPage();
  assert.match(page.ids["quiz-label"].textContent, /OTÁZKA 1 ZE 4/);
  page.heroProblem.click();
  assert.match(page.ids["quiz-label"].textContent, /OTÁZKA 2 ZE 4/);
  page.clickOption("Na více zařízeních");
  page.clickOption("Ano, je znatelně lepší");
  page.clickOption("Ano, přes kabel funguje dobře");

  const text = page.ids["quiz-content"].children.map(node => node.textContent ?? "").join(" ");
  assert.match(text, /Zaměřte se na pokrytí/);
  assert.deepEqual(page.events.map(([name]) => name), [
    "prediagnostic_started", "prediagnostic_step_1", "prediagnostic_step_2",
    "prediagnostic_step_3", "prediagnostic_completed", "prediagnostic_result_A",
  ]);
  assert.equal(page.events.at(-2)[1].section, "prediagnostika");
  assert.ok(Number.isFinite(page.events.at(-2)[1].durationMs));
  assert.ok(page.events.every(([, data]) => !("answers" in data)));

  page.cleanup();
});

test("back, answer changes, restart, and mobile navigation remain usable", () => {
  const page = createPage();
  page.heroProblem.click();
  page.clickOption("Na více zařízeních");
  page.ids["quiz-back"].click();
  page.clickOption("Jen na jednom");
  page.clickOption("Ne, problém zůstává");
  page.clickOption("Ne, zlobí i přes kabel");
  assert.match(page.ids["quiz-content"].children.map(node => node.textContent ?? "").join(" "), /Začněte konkrétním zařízením/);

  page.ids["quiz-reset"].click();
  page.clickOption("Zlobí jen jedno zařízení");
  page.ids["quiz-back"].click();
  page.clickOption("Pomalá Wi-Fi");
  page.clickOption("Jen na jednom");
  page.clickOption("Ne, problém zůstává");
  page.clickOption("Ne, zlobí i přes kabel");
  assert.equal(page.events.filter(([name]) => name === "prediagnostic_step_1").length, 2);
  assert.equal(page.events.filter(([name]) => name === "prediagnostic_result_C").length, 2);

  page.ids["menu-toggle"].click();
  assert.equal(page.ids["menu-toggle"].getAttribute("aria-expanded"), "true");
  page.listeners.keydown({ key: "Escape" });
  assert.equal(page.ids["menu-toggle"].getAttribute("aria-expanded"), "false");
  assert.equal(page.ids.navigation.classList.contains("open"), false);
  assert.equal(page.ids["menu-toggle"].focused, true);
  page.cleanup();
});

