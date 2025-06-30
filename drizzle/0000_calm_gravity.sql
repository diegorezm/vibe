CREATE TABLE `vibe_fragments` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`message` text NOT NULL,
	`sandbox_url` text,
	`files` text,
	`message_id` text NOT NULL,
	FOREIGN KEY (`message_id`) REFERENCES `vibe_messages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `vibe_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`role` text NOT NULL,
	`type` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text
);
