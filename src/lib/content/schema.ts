import {
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
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

export const mediaAssets = mysqlTable(
  "media_assets",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceId: varchar("source_id", { length: 128 }).notNull(),
    url: text("url").notNull(),
    mimeType: varchar("mime_type", { length: 128 }),
    width: int("width"),
    height: int("height"),
    altText: text("alt_text"),
    metadata: json("metadata").notNull(),
    sourceUpdatedAt: timestamp("source_updated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("media_assets_source_id_unique").on(table.sourceId),
    index("media_assets_mime_type_idx").on(table.mimeType),
  ],
);

export const contentCategories = mysqlTable(
  "content_categories",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceId: varchar("source_id", { length: 128 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    title: varchar("title", { length: 512 }).notNull(),
    description: text("description"),
    metadata: json("metadata").notNull(),
    sourceUpdatedAt: timestamp("source_updated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("content_categories_source_id_unique").on(table.sourceId),
    uniqueIndex("content_categories_slug_unique").on(table.slug),
  ],
);

export const contentPosts = mysqlTable(
  "content_posts",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceId: varchar("source_id", { length: 128 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    section: mysqlEnum("section", ["blog", "thinking"])
      .default("blog")
      .notNull(),
    title: varchar("title", { length: 512 }).notNull(),
    excerpt: text("excerpt"),
    body: json("body"),
    mainImageSourceId: varchar("main_image_source_id", { length: 128 }),
    publishedAt: timestamp("published_at"),
    sourceUpdatedAt: timestamp("source_updated_at"),
    metadata: json("metadata").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("content_posts_source_id_unique").on(table.sourceId),
    uniqueIndex("content_posts_slug_unique").on(table.slug),
    index("content_posts_section_published_idx").on(
      table.section,
      table.publishedAt,
    ),
  ],
);

export const postCategories = mysqlTable(
  "post_categories",
  {
    postId: int("post_id")
      .notNull()
      .references(() => contentPosts.id, { onDelete: "cascade" }),
    categoryId: int("category_id")
      .notNull()
      .references(() => contentCategories.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("post_categories_post_category_unique").on(
      table.postId,
      table.categoryId,
    ),
    index("post_categories_category_post_idx").on(
      table.categoryId,
      table.postId,
    ),
  ],
);

export const contentPages = mysqlTable(
  "content_pages",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceId: varchar("source_id", { length: 128 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    route: varchar("route", { length: 512 }),
    title: varchar("title", { length: 512 }),
    content: json("content"),
    metadata: json("metadata").notNull(),
    sourceUpdatedAt: timestamp("source_updated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("content_pages_source_id_unique").on(table.sourceId),
    uniqueIndex("content_pages_slug_unique").on(table.slug),
    uniqueIndex("content_pages_route_unique").on(table.route),
  ],
);

export const pageSeo = mysqlTable(
  "page_seo",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceId: varchar("source_id", { length: 128 }).notNull(),
    route: varchar("route", { length: 512 }).notNull(),
    title: varchar("title", { length: 512 }),
    description: text("description"),
    imageSourceId: varchar("image_source_id", { length: 128 }),
    metadata: json("metadata").notNull(),
    sourceUpdatedAt: timestamp("source_updated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("page_seo_source_id_unique").on(table.sourceId),
    uniqueIndex("page_seo_route_unique").on(table.route),
  ],
);

export const siteSettings = mysqlTable(
  "site_settings",
  {
    id: int("id").autoincrement().primaryKey(),
    settingKey: varchar("setting_key", { length: 64 }).notNull(),
    companyName: varchar("company_name", { length: 255 }),
    logoSourceId: varchar("logo_source_id", { length: 128 }),
    email: varchar("email", { length: 320 }),
    phone: varchar("phone", { length: 64 }),
    address: text("address"),
    settings: json("settings").notNull(),
    sourceUpdatedAt: timestamp("source_updated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [uniqueIndex("site_settings_key_unique").on(table.settingKey)],
);

export const navigationItems = mysqlTable(
  "navigation_items",
  {
    id: int("id").autoincrement().primaryKey(),
    location: varchar("location", { length: 64 }).notNull(),
    label: varchar("label", { length: 255 }).notNull(),
    href: varchar("href", { length: 512 }).notNull(),
    sortOrder: int("sort_order").default(0).notNull(),
    isExternal: int("is_external").default(0).notNull(),
    isVisible: int("is_visible").default(1).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("navigation_items_location_order_idx").on(
      table.location,
      table.sortOrder,
    ),
  ],
);

export const contentTestimonials = mysqlTable(
  "content_testimonials",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceId: varchar("source_id", { length: 128 }).notNull(),
    kind: mysqlEnum("kind", ["standard", "confidential"]).notNull(),
    sortOrder: int("sort_order").default(0).notNull(),
    author: varchar("author", { length: 255 }),
    quote: text("quote"),
    metadata: json("metadata").notNull(),
    sourceUpdatedAt: timestamp("source_updated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("content_testimonials_source_id_unique").on(table.sourceId),
    index("content_testimonials_kind_order_idx").on(
      table.kind,
      table.sortOrder,
    ),
  ],
);

export const clientLogos = mysqlTable(
  "client_logos",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceId: varchar("source_id", { length: 128 }).notNull(),
    name: varchar("name", { length: 255 }),
    logoSourceId: varchar("logo_source_id", { length: 128 }),
    sortOrder: int("sort_order").default(0).notNull(),
    metadata: json("metadata").notNull(),
    sourceUpdatedAt: timestamp("source_updated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("client_logos_source_id_unique").on(table.sourceId),
    index("client_logos_order_idx").on(table.sortOrder),
  ],
);

export const caseStudies = mysqlTable(
  "case_studies",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceId: varchar("source_id", { length: 128 }).notNull(),
    title: varchar("title", { length: 512 }).notNull(),
    summary: text("summary"),
    sortOrder: int("sort_order").default(0).notNull(),
    metadata: json("metadata").notNull(),
    sourceUpdatedAt: timestamp("source_updated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("case_studies_source_id_unique").on(table.sourceId),
    index("case_studies_order_idx").on(table.sortOrder),
  ],
);

export const teamMembers = mysqlTable(
  "team_members",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceId: varchar("source_id", { length: 128 }).notNull(),
    slug: varchar("slug", { length: 255 }),
    name: varchar("name", { length: 255 }).notNull(),
    role: varchar("role", { length: 512 }),
    photoSourceId: varchar("photo_source_id", { length: 128 }),
    sortOrder: int("sort_order").default(0).notNull(),
    metadata: json("metadata").notNull(),
    sourceUpdatedAt: timestamp("source_updated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("team_members_source_id_unique").on(table.sourceId),
    uniqueIndex("team_members_slug_unique").on(table.slug),
    index("team_members_order_idx").on(table.sortOrder),
  ],
);

export const boardAdvisors = mysqlTable(
  "board_advisors",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceId: varchar("source_id", { length: 128 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    role: varchar("role", { length: 512 }),
    photoSourceId: varchar("photo_source_id", { length: 128 }),
    sortOrder: int("sort_order").default(0).notNull(),
    metadata: json("metadata").notNull(),
    sourceUpdatedAt: timestamp("source_updated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("board_advisors_source_id_unique").on(table.sourceId),
    index("board_advisors_order_idx").on(table.sortOrder),
  ],
);

export const formSubmissions = mysqlTable(
  "form_submissions",
  {
    id: int("id").autoincrement().primaryKey(),
    formType: varchar("form_type", { length: 128 }).notNull(),
    sourceUrl: varchar("source_url", { length: 1024 }),
    submitterEmail: varchar("submitter_email", { length: 320 }),
    status: mysqlEnum("status", ["new", "reviewed", "archived"])
      .default("new")
      .notNull(),
    payload: json("payload").notNull(),
    attachmentMetadata: json("attachment_metadata"),
    receivedAt: timestamp("received_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("form_submissions_status_received_idx").on(
      table.status,
      table.receivedAt,
    ),
    index("form_submissions_type_received_idx").on(
      table.formType,
      table.receivedAt,
    ),
    index("form_submissions_email_idx").on(table.submitterEmail),
  ],
);

/**
 * Dedicated RampRate CMS membership. This is intentionally separate from the
 * Flow product’s access model: a valid identity session establishes who the
 * caller is, while this table determines whether that person may administer
 * RampRate editorial content and submissions.
 */
export const cmsAdminMembers = mysqlTable(
  "cms_admin_members",
  {
    id: int("id").autoincrement().primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    role: mysqlEnum("role", ["owner", "admin", "editor"])
      .default("editor")
      .notNull(),
    isActive: int("is_active").default(1).notNull(),
    invitedByEmail: varchar("invited_by_email", { length: 320 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("cms_admin_members_email_unique").on(table.email),
    index("cms_admin_members_active_role_idx").on(table.isActive, table.role),
  ],
);
