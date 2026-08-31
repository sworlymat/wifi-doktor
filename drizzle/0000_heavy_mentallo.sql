CREATE TABLE `orders` (
	`checkout_session_id` text PRIMARY KEY NOT NULL,
	`product` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`amount_total` integer NOT NULL,
	`currency` text NOT NULL,
	`customer_email` text,
	`stripe_customer_id` text,
	`payment_intent_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`paid_at` text
);
