import type { AnalyticsEvent } from "./analytics-events";

let pageSessionId: string | undefined;

// One anonymous ID per page load, shared by the landing page and free diagnostic.
// Analytics must never block a choice, a form submission or navigation.
export function track(eventType: AnalyticsEvent, extra: Record<string, unknown> = {}, beacon = false) {
  if (typeof window === "undefined") return;
  try {
    pageSessionId ??= crypto.randomUUID();
    const payload = JSON.stringify({ sessionId: pageSessionId, eventType, path: window.location.pathname, ...extra });
    if (beacon && navigator.sendBeacon?.("/api/analytics", new Blob([payload], { type: "application/json" }))) return;
    void fetch("/api/analytics", { method: "POST", headers: { "content-type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
  } catch { /* A blocked analytics API must not affect the purchase flow. */ }
}
