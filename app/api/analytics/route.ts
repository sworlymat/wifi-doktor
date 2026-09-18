import { getDb } from "../../../db";
import { analyticsEvents } from "../../../db/schema";

export const runtime = "nodejs";

const allowedEvents = new Set(["page_view", "section_view", "checkout_start", "page_exit"]);

function shortText(value: unknown, maxLength: number) {
  return typeof value === "string" && value.length > 0
    ? value.slice(0, maxLength)
    : null;
}

function boundedNumber(value: unknown, max: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.min(Math.round(value), max))
    : null;
}

export async function POST(request: Request) {
  const requestOrigin = new URL(request.url).origin;
  const sourceOrigin = request.headers.get("origin");
  if (sourceOrigin && sourceOrigin !== requestOrigin) {
    return new Response("Forbidden", { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 8_192) return new Response("Payload too large", { status: 413 });

  try {
    const body = await request.json() as Record<string, unknown>;
    const sessionId = shortText(body.sessionId, 64);
    const eventType = shortText(body.eventType, 32);
    const path = shortText(body.path, 160);
    if (!sessionId || !eventType || !path || !allowedEvents.has(eventType)) {
      return new Response("Invalid event", { status: 400 });
    }

    await getDb().insert(analyticsEvents).values({
      id: crypto.randomUUID(),
      sessionId,
      eventType: eventType as "page_view" | "section_view" | "checkout_start" | "page_exit",
      path,
      referrerHost: shortText(body.referrerHost, 160),
      utmSource: shortText(body.utmSource, 120),
      utmMedium: shortText(body.utmMedium, 120),
      utmCampaign: shortText(body.utmCampaign, 160),
      section: shortText(body.section, 80),
      durationMs: boundedNumber(body.durationMs, 86_400_000),
      scrollDepth: boundedNumber(body.scrollDepth, 100),
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Unable to store anonymous analytics event", {
      type: error instanceof Error ? error.name : "Unknown error",
    });
    return new Response("Analytics unavailable", { status: 503 });
  }
}
