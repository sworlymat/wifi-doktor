import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const orders = sqliteTable("orders", {
  checkoutSessionId: text("checkout_session_id").primaryKey(),
  product: text("product").notNull(),
  status: text("status", { enum: ["pending", "paid"] }).notNull().default("pending"),
  amountTotal: integer("amount_total").notNull(),
  currency: text("currency").notNull(),
  customerEmail: text("customer_email"),
  stripeCustomerId: text("stripe_customer_id"),
  paymentIntentId: text("payment_intent_id"),
  clickupTaskId: text("clickup_task_id"),
  orderEmailSentAt: text("order_email_sent_at"),
  fulfillmentLease: text("fulfillment_lease"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  paidAt: text("paid_at"),
});

export const analyticsEvents = sqliteTable("analytics_events", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  eventType: text("event_type", {
    enum: ["page_view", "section_view", "checkout_start", "page_exit"],
  }).notNull(),
  path: text("path").notNull(),
  referrerHost: text("referrer_host"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  section: text("section"),
  durationMs: integer("duration_ms"),
  scrollDepth: integer("scroll_depth"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_analytics_events_created_at").on(table.createdAt),
  index("idx_analytics_events_type_created_at").on(table.eventType, table.createdAt),
]);
