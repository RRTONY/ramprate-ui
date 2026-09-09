import {
  index,
  int,
  json,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * A versioned, database-backed representation of published content. Content
 * remains structured JSON so existing portable-text and page-builder data can
 * move from Sanity without losing fields or public routes. Image files remain
 * external URLs; this table holds metadata and references only.
 */
export const contentDocuments = mysqlTable(
  "content_documents",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceId: varchar("source_id", { length: 128 }).notNull(),
    contentType: varchar("content_type", { length: 64 }).notNull(),
    slug: varchar("slug", { length: 255 }),
    route: varchar("route", { length: 512 }),
    section: varchar("section", { length: 64 }),
    title: varchar("title", { length: 512 }),
    publishedAt: timestamp("published_at"),
    sourceUpdatedAt: timestamp("source_updated_at"),
    data: json("data").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("content_documents_source_id_unique").on(table.sourceId),
    index("content_documents_type_slug_idx").on(table.contentType, table.slug),
    index("content_documents_route_idx").on(table.route),
    index("content_documents_type_section_idx").on(
      table.contentType,
      table.section,
    ),
    index("content_documents_published_at_idx").on(table.publishedAt),
  ],
);

export type ContentDocument = typeof contentDocuments.$inferSelect;
export type InsertContentDocument = typeof contentDocuments.$inferInsert;
