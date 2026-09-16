CREATE TABLE `analytics_events` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`event_type` text NOT NULL,
	`path` text NOT NULL,
	`referrer_host` text,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`section` text,
	`duration_ms` integer,
	`scroll_depth` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_analytics_events_created_at` ON `analytics_events` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_analytics_events_type_created_at` ON `analytics_events` (`event_type`,`created_at`);
--> statement-breakpoint
PRAGMA optimize;
