export const GA_ID = "G-C82SCYPJR0";
export const CONSENT_KEY = "wifi-analytics-consent-v1";
type GoogleWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean };
let initialized = false;
let enabled = false;
let lastPage = "";
export function publicAnalyticsPage(path: string) {
  return path === "/" || path === "/obchodni-podminky" || path === "/ochrana-soukromi" || /^\/poradna\/(wifi-vypadava|slaby-signal-wifi|pomala-wifi)$/.test(path);
}
export function stopGoogleAnalytics() {
  enabled = false; lastPage = "";
  (window as unknown as GoogleWindow)[`ga-disable-${GA_ID}`] = true;
}
export function startGoogleAnalytics(path: string) {
  if (!publicAnalyticsPage(path) || new URLSearchParams(window.location.search).has("session_id")) { stopGoogleAnalytics(); return; }
  const w = window as unknown as GoogleWindow;
  w[`ga-disable-${GA_ID}`] = false;
  enabled = true;
  if (!initialized) {
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () { w.dataLayer!.push(arguments); };
    w.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    w.gtag("consent", "update", { analytics_storage: "granted" });
    w.gtag("js", new Date());
    w.gtag("config", GA_ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: window.location.origin + path, page_referrer: safeReferrer() });
    const script = document.createElement("script");
    script.id = "wifi-google-tag"; script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
    initialized = true;
  }
  if (lastPage !== path) {
    w.gtag?.("event", "page_view", { page_location: window.location.origin + path, page_title: document.title, page_referrer: safeReferrer() });
    lastPage = path;
  }
}
function safeReferrer() { try { return document.referrer ? new URL(document.referrer).origin : ""; } catch { return ""; } }
export function googleEvent(name: string) {
  if (!enabled || !publicAnalyticsPage(window.location.pathname)) return;
  if (!/^(prediagnostic_(started|step_[123]|completed|result_[ABCDE])|basic_cta_clicked|checkout_start(_(basic|premium))?)$/.test(name)) return;
  const isCheckout = name.startsWith("checkout_start");
  const plan = name.endsWith("premium") ? "premium" : "basic";
  const value = plan === "premium" ? 590 : 299;
  (window as unknown as GoogleWindow).gtag?.("event", isCheckout ? "begin_checkout" : name, {
    page_location: window.location.origin + window.location.pathname,
    ...(isCheckout ? { currency: "CZK", value, items: [{ item_id: plan, item_name: plan === "premium" ? "Wi-Fi Doktor Komplet" : "Wi-Fi Doktor Základ", price: value, quantity: 1 }] } : {}),
  });
}
export function clearGoogleCookies() {
  for (const part of document.cookie.split(";")) {
    const name = part.trim().split("=")[0]; if (!/^_ga(?:_|$)/.test(name)) continue;
    const base = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = base;
    const labels = window.location.hostname.split(".");
    for (let i=0; i<labels.length-1; i++) document.cookie = `${base}; domain=${labels.slice(i).join(".")}`;
  }
}
