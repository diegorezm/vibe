PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_vibe_messages` (
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
INSERT INTO `__new_vibe_messages`("id", "content", "role", "type", "created_at", "updated_at", "project_id") SELECT "id", "content", "role", "type", "created_at", "updated_at", "project_id" FROM `vibe_messages`;--> statement-breakpoint
DROP TABLE `vibe_messages`;--> statement-breakpoint
ALTER TABLE `__new_vibe_messages` RENAME TO `vibe_messages`;--> statement-breakpoint
PRAGMA foreign_keys=ON;