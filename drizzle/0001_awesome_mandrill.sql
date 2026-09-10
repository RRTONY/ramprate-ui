CREATE TABLE `board_advisors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_id` varchar(128) NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` varchar(512),
	`photo_source_id` varchar(128),
	`sort_order` int NOT NULL DEFAULT 0,
	`metadata` json NOT NULL,
	`source_updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `board_advisors_id` PRIMARY KEY(`id`),
	CONSTRAINT `board_advisors_source_id_unique` UNIQUE(`source_id`)
);
--> statement-breakpoint
CREATE TABLE `case_studies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_id` varchar(128) NOT NULL,
	`title` varchar(512) NOT NULL,
	`summary` text,
	`sort_order` int NOT NULL DEFAULT 0,
	`metadata` json NOT NULL,
	`source_updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `case_studies_id` PRIMARY KEY(`id`),
	CONSTRAINT `case_studies_source_id_unique` UNIQUE(`source_id`)
);
--> statement-breakpoint
CREATE TABLE `client_logos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_id` varchar(128) NOT NULL,
	`name` varchar(255),
	`logo_source_id` varchar(128),
	`sort_order` int NOT NULL DEFAULT 0,
	`metadata` json NOT NULL,
	`source_updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_logos_id` PRIMARY KEY(`id`),
	CONSTRAINT `client_logos_source_id_unique` UNIQUE(`source_id`)
);
--> statement-breakpoint
CREATE TABLE `content_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_id` varchar(128) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(512) NOT NULL,
	`description` text,
	`metadata` json NOT NULL,
	`source_updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_categories_source_id_unique` UNIQUE(`source_id`),
	CONSTRAINT `content_categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `content_pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_id` varchar(128) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`route` varchar(512),
	`title` varchar(512),
	`content` json,
	`metadata` json NOT NULL,
	`source_updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_pages_source_id_unique` UNIQUE(`source_id`),
	CONSTRAINT `content_pages_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `content_pages_route_unique` UNIQUE(`route`)
);
--> statement-breakpoint
CREATE TABLE `content_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_id` varchar(128) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`section` enum('blog','thinking') NOT NULL DEFAULT 'blog',
	`title` varchar(512) NOT NULL,
	`excerpt` text,
	`body` json,
	`main_image_source_id` varchar(128),
	`published_at` timestamp,
	`source_updated_at` timestamp,
	`metadata` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_posts_source_id_unique` UNIQUE(`source_id`),
	CONSTRAINT `content_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `content_testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_id` varchar(128) NOT NULL,
	`kind` enum('standard','confidential') NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`author` varchar(255),
	`quote` text,
	`metadata` json NOT NULL,
	`source_updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_testimonials_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_testimonials_source_id_unique` UNIQUE(`source_id`)
);
--> statement-breakpoint
CREATE TABLE `form_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`form_type` varchar(128) NOT NULL,
	`source_url` varchar(1024),
	`submitter_email` varchar(320),
	`status` enum('new','reviewed','archived') NOT NULL DEFAULT 'new',
	`payload` json NOT NULL,
	`attachment_metadata` json,
	`received_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `form_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `media_assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_id` varchar(128) NOT NULL,
	`url` text NOT NULL,
	`mime_type` varchar(128),
	`width` int,
	`height` int,
	`alt_text` text,
	`metadata` json NOT NULL,
	`source_updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `media_assets_id` PRIMARY KEY(`id`),
	CONSTRAINT `media_assets_source_id_unique` UNIQUE(`source_id`)
);
--> statement-breakpoint
CREATE TABLE `navigation_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`location` varchar(64) NOT NULL,
	`label` varchar(255) NOT NULL,
	`href` varchar(512) NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_external` int NOT NULL DEFAULT 0,
	`is_visible` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `navigation_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `page_seo` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_id` varchar(128) NOT NULL,
	`route` varchar(512) NOT NULL,
	`title` varchar(512),
	`description` text,
	`image_source_id` varchar(128),
	`metadata` json NOT NULL,
	`source_updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `page_seo_id` PRIMARY KEY(`id`),
	CONSTRAINT `page_seo_source_id_unique` UNIQUE(`source_id`),
	CONSTRAINT `page_seo_route_unique` UNIQUE(`route`)
);
--> statement-breakpoint
CREATE TABLE `post_categories` (
	`post_id` int NOT NULL,
	`category_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_categories_post_category_unique` UNIQUE(`post_id`,`category_id`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`setting_key` varchar(64) NOT NULL,
	`company_name` varchar(255),
	`logo_source_id` varchar(128),
	`email` varchar(320),
	`phone` varchar(64),
	`address` text,
	`settings` json NOT NULL,
	`source_updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_settings_key_unique` UNIQUE(`setting_key`)
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_id` varchar(128) NOT NULL,
	`slug` varchar(255),
	`name` varchar(255) NOT NULL,
	`role` varchar(512),
	`photo_source_id` varchar(128),
	`sort_order` int NOT NULL DEFAULT 0,
	`metadata` json NOT NULL,
	`source_updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `team_members_source_id_unique` UNIQUE(`source_id`),
	CONSTRAINT `team_members_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `post_categories` ADD CONSTRAINT `post_categories_post_id_content_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `content_posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_categories` ADD CONSTRAINT `post_categories_category_id_content_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `content_categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `board_advisors_order_idx` ON `board_advisors` (`sort_order`);--> statement-breakpoint
CREATE INDEX `case_studies_order_idx` ON `case_studies` (`sort_order`);--> statement-breakpoint
CREATE INDEX `client_logos_order_idx` ON `client_logos` (`sort_order`);--> statement-breakpoint
CREATE INDEX `content_posts_section_published_idx` ON `content_posts` (`section`,`published_at`);--> statement-breakpoint
CREATE INDEX `content_testimonials_kind_order_idx` ON `content_testimonials` (`kind`,`sort_order`);--> statement-breakpoint
CREATE INDEX `form_submissions_status_received_idx` ON `form_submissions` (`status`,`received_at`);--> statement-breakpoint
CREATE INDEX `form_submissions_type_received_idx` ON `form_submissions` (`form_type`,`received_at`);--> statement-breakpoint
CREATE INDEX `form_submissions_email_idx` ON `form_submissions` (`submitter_email`);--> statement-breakpoint
CREATE INDEX `media_assets_mime_type_idx` ON `media_assets` (`mime_type`);--> statement-breakpoint
CREATE INDEX `navigation_items_location_order_idx` ON `navigation_items` (`location`,`sort_order`);--> statement-breakpoint
CREATE INDEX `post_categories_category_post_idx` ON `post_categories` (`category_id`,`post_id`);--> statement-breakpoint
CREATE INDEX `team_members_order_idx` ON `team_members` (`sort_order`);