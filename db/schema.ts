import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  paidAt: text("paid_at"),
});
