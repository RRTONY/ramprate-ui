CREATE TABLE `cms_admin_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`member_id` int NOT NULL,
	`token_hash` varchar(128) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`last_seen_at` timestamp,
	CONSTRAINT `cms_admin_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `cms_admin_sessions_token_hash_unique` UNIQUE(`token_hash`)
);
--> statement-breakpoint
ALTER TABLE `cms_admin_members` ADD `password_hash` varchar(255);--> statement-breakpoint
ALTER TABLE `cms_admin_members` ADD `must_change_password` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `cms_admin_members` ADD `password_updated_at` timestamp;--> statement-breakpoint
CREATE INDEX `cms_admin_sessions_member_expiry_idx` ON `cms_admin_sessions` (`member_id`,`expires_at`);