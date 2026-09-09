CREATE TABLE `content_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source_id` varchar(128) NOT NULL,
	`content_type` varchar(64) NOT NULL,
	`slug` varchar(255),
	`route` varchar(512),
	`section` varchar(64),
	`title` varchar(512),
	`published_at` timestamp,
	`source_updated_at` timestamp,
	`data` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_documents_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_documents_source_id_unique` UNIQUE(`source_id`)
);
--> statement-breakpoint
CREATE INDEX `content_documents_type_slug_idx` ON `content_documents` (`content_type`,`slug`);--> statement-breakpoint
CREATE INDEX `content_documents_route_idx` ON `content_documents` (`route`);--> statement-breakpoint
CREATE INDEX `content_documents_type_section_idx` ON `content_documents` (`content_type`,`section`);--> statement-breakpoint
CREATE INDEX `content_documents_published_at_idx` ON `content_documents` (`published_at`);