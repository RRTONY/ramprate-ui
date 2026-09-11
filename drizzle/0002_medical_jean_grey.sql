CREATE TABLE `cms_admin_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`role` enum('owner','admin','editor') NOT NULL DEFAULT 'editor',
	`is_active` int NOT NULL DEFAULT 1,
	`invited_by_email` varchar(320),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cms_admin_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `cms_admin_members_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE INDEX `cms_admin_members_active_role_idx` ON `cms_admin_members` (`is_active`,`role`);