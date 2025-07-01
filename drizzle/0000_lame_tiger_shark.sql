CREATE TABLE `vibe_fragments` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
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
	`updated_at` text,
	`project_id` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `vibe_projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `vibe_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `vibe_usage` (
	`key` text PRIMARY KEY NOT NULL,
	`points` numeric NOT NULL,
	`expire` text
);
