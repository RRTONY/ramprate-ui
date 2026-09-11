import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set to migrate normalized content.");
}

function asRecord(value) {
  if (typeof value === "string") {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  }
  return value && typeof value === "object" ? value : {};
}

function stringValue(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function slugValue(value) {
  if (typeof value === "string") return stringValue(value);
  return value && typeof value === "object" ? stringValue(value.current) : null;
}

function imageSourceId(value) {
  if (!value || typeof value !== "object") return null;
  if (typeof value._id === "string") return value._id;
  if (typeof value._ref === "string") return value._ref;
  return imageSourceId(value.asset);
}

function toDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? null : parsed;
}

function json(value) {
  return JSON.stringify(value ?? {});
}

function orderValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const counts = new Map();

async function execute(statement, params) {
  await connection.execute(statement, params);
}

function count(name) {
  counts.set(name, (counts.get(name) ?? 0) + 1);
}

const upsertStatements = {
  media: `INSERT INTO media_assets (source_id, url, mime_type, width, height, alt_text, metadata, source_updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE url = VALUES(url), mime_type = VALUES(mime_type), width = VALUES(width), height = VALUES(height), alt_text = VALUES(alt_text), metadata = VALUES(metadata), source_updated_at = VALUES(source_updated_at)`,
  category: `INSERT INTO content_categories (source_id, slug, title, description, metadata, source_updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE slug = VALUES(slug), title = VALUES(title), description = VALUES(description), metadata = VALUES(metadata), source_updated_at = VALUES(source_updated_at)`,
  post: `INSERT INTO content_posts (source_id, slug, section, title, excerpt, body, main_image_source_id, published_at, source_updated_at, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE slug = VALUES(slug), section = VALUES(section), title = VALUES(title), excerpt = VALUES(excerpt), body = VALUES(body), main_image_source_id = VALUES(main_image_source_id), published_at = VALUES(published_at), source_updated_at = VALUES(source_updated_at), metadata = VALUES(metadata)`,
  page: `INSERT INTO content_pages (source_id, slug, route, title, content, metadata, source_updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE slug = VALUES(slug), route = VALUES(route), title = VALUES(title), content = VALUES(content), metadata = VALUES(metadata), source_updated_at = VALUES(source_updated_at)`,
  seo: `INSERT INTO page_seo (source_id, route, title, description, image_source_id, metadata, source_updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE route = VALUES(route), title = VALUES(title), description = VALUES(description), image_source_id = VALUES(image_source_id), metadata = VALUES(metadata), source_updated_at = VALUES(source_updated_at)`,
  settings: `INSERT INTO site_settings (setting_key, company_name, logo_source_id, email, phone, address, settings, source_updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE company_name = VALUES(company_name), logo_source_id = VALUES(logo_source_id), email = VALUES(email), phone = VALUES(phone), address = VALUES(address), settings = VALUES(settings), source_updated_at = VALUES(source_updated_at)`,
  testimonial: `INSERT INTO content_testimonials (source_id, kind, sort_order, author, quote, metadata, source_updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE kind = VALUES(kind), sort_order = VALUES(sort_order), author = VALUES(author), quote = VALUES(quote), metadata = VALUES(metadata), source_updated_at = VALUES(source_updated_at)`,
  logo: `INSERT INTO client_logos (source_id, name, logo_source_id, sort_order, metadata, source_updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE name = VALUES(name), logo_source_id = VALUES(logo_source_id), sort_order = VALUES(sort_order), metadata = VALUES(metadata), source_updated_at = VALUES(source_updated_at)`,
  caseStudy: `INSERT INTO case_studies (source_id, title, summary, sort_order, metadata, source_updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE title = VALUES(title), summary = VALUES(summary), sort_order = VALUES(sort_order), metadata = VALUES(metadata), source_updated_at = VALUES(source_updated_at)`,
  teamMember: `INSERT INTO team_members (source_id, slug, name, role, photo_source_id, sort_order, metadata, source_updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE slug = VALUES(slug), name = VALUES(name), role = VALUES(role), photo_source_id = VALUES(photo_source_id), sort_order = VALUES(sort_order), metadata = VALUES(metadata), source_updated_at = VALUES(source_updated_at)`,
  advisor: `INSERT INTO board_advisors (source_id, name, role, photo_source_id, sort_order, metadata, source_updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), photo_source_id = VALUES(photo_source_id), sort_order = VALUES(sort_order), metadata = VALUES(metadata), source_updated_at = VALUES(source_updated_at)`,
};

try {
  const [rows] = await connection.execute(
    "SELECT source_id, content_type, slug, route, section, title, published_at, source_updated_at, data FROM content_documents ORDER BY id",
  );
  await connection.beginTransaction();

  for (const row of rows) {
    const data = asRecord(row.data);
    const updatedAt = toDate(row.source_updated_at ?? data._updatedAt);
    const sourceId = row.source_id;

    if (row.content_type === "sanity.imageAsset") {
      const dimensions = asRecord(asRecord(data.metadata).dimensions);
      await execute(upsertStatements.media, [
        sourceId,
        stringValue(data.url) ?? "",
        stringValue(data.mimeType),
        Number(dimensions.width) || null,
        Number(dimensions.height) || null,
        stringValue(data.altText) ?? stringValue(data.originalFilename),
        json(data),
        updatedAt,
      ]);
      count("media_assets");
      continue;
    }

    if (row.content_type === "category") {
      const slug = slugValue(data.slug) ?? row.slug;
      if (!slug) throw new Error(`Category ${sourceId} is missing a slug.`);
      await execute(upsertStatements.category, [
        sourceId,
        slug,
        stringValue(data.title) ?? slug,
        stringValue(data.description),
        json(data),
        updatedAt,
      ]);
      count("content_categories");
      continue;
    }

    if (row.content_type === "post") {
      const slug = slugValue(data.slug) ?? row.slug;
      if (!slug) throw new Error(`Post ${sourceId} is missing a slug.`);
      await execute(upsertStatements.post, [
        sourceId,
        slug,
        row.section === "thinking" ? "thinking" : "blog",
        stringValue(data.title) ?? slug,
        stringValue(data.excerpt),
        json(data.body ?? data.content ?? []),
        imageSourceId(data.mainImage),
        toDate(data.publishedAt ?? row.published_at),
        updatedAt,
        json(data),
      ]);
      count("content_posts");
      continue;
    }

    if (row.content_type === "page") {
      const slug = slugValue(data.slug) ?? row.slug;
      if (!slug) throw new Error(`Page ${sourceId} is missing a slug.`);
      await execute(upsertStatements.page, [
        sourceId,
        slug,
        stringValue(data.route) ?? row.route,
        stringValue(data.title) ?? row.title,
        json(data.content ?? data.body ?? data.sections ?? []),
        json(data),
        updatedAt,
      ]);
      count("content_pages");
      continue;
    }

    if (row.content_type === "pageSeo") {
      const seo = asRecord(data.seo);
      const route = stringValue(data.route) ?? row.route;
      if (!route) throw new Error(`SEO record ${sourceId} is missing a route.`);
      await execute(upsertStatements.seo, [
        sourceId,
        route,
        stringValue(seo.title) ?? stringValue(data.title),
        stringValue(seo.description) ?? stringValue(data.description),
        imageSourceId(seo.ogImage ?? data.ogImage),
        json(data),
        updatedAt,
      ]);
      count("page_seo");
      continue;
    }

    if (row.content_type === "siteSettings") {
      await execute(upsertStatements.settings, [
        "primary",
        stringValue(data.companyName) ?? stringValue(data.title),
        imageSourceId(data.logo),
        stringValue(data.email),
        stringValue(data.phone),
        stringValue(data.address),
        json(data),
        updatedAt,
      ]);
      count("site_settings");
      continue;
    }

    if (
      row.content_type === "testimonial" ||
      row.content_type === "confidentialTestimonial"
    ) {
      await execute(upsertStatements.testimonial, [
        sourceId,
        row.content_type === "confidentialTestimonial" ? "confidential" : "standard",
        orderValue(data.order),
        stringValue(data.author) ?? stringValue(data.name),
        stringValue(data.quote) ?? stringValue(data.text),
        json(data),
        updatedAt,
      ]);
      count("content_testimonials");
      continue;
    }

    if (row.content_type === "clientLogo") {
      await execute(upsertStatements.logo, [
        sourceId,
        stringValue(data.name) ?? stringValue(data.client),
        imageSourceId(data.logo),
        orderValue(data.order),
        json(data),
        updatedAt,
      ]);
      count("client_logos");
      continue;
    }

    if (row.content_type === "caseStudy") {
      await execute(upsertStatements.caseStudy, [
        sourceId,
        stringValue(data.title) ?? sourceId,
        stringValue(data.desc) ?? stringValue(data.result),
        orderValue(data.order),
        json(data),
        updatedAt,
      ]);
      count("case_studies");
      continue;
    }

    if (row.content_type === "teamMember") {
      await execute(upsertStatements.teamMember, [
        sourceId,
        slugValue(data.slug) ?? row.slug,
        stringValue(data.name) ?? sourceId,
        stringValue(data.role),
        imageSourceId(data.photo),
        orderValue(data.order),
        json(data),
        updatedAt,
      ]);
      count("team_members");
      continue;
    }

    if (row.content_type === "boardAdvisor") {
      await execute(upsertStatements.advisor, [
        sourceId,
        stringValue(data.name) ?? sourceId,
        stringValue(data.role),
        imageSourceId(data.photo),
        orderValue(data.order),
        json(data),
        updatedAt,
      ]);
      count("board_advisors");
    }
  }

  const [posts] = await connection.execute(
    "SELECT id, source_id, metadata FROM content_posts",
  );
  const [categories] = await connection.execute(
    "SELECT id, source_id FROM content_categories",
  );
  const categoryIds = new Map(categories.map((category) => [category.source_id, category.id]));

  await execute("DELETE FROM post_categories", []);
  for (const post of posts) {
    const metadata = asRecord(post.metadata);
    const categories = Array.isArray(metadata.categories) ? metadata.categories : [];
    for (const category of categories) {
      const categoryId = imageSourceId(category);
      const normalizedCategoryId = categoryId ?? stringValue(asRecord(category)._id);
      const databaseCategoryId = normalizedCategoryId
        ? categoryIds.get(normalizedCategoryId)
        : undefined;
      if (databaseCategoryId) {
        await execute(
          "INSERT IGNORE INTO post_categories (post_id, category_id) VALUES (?, ?)",
          [post.id, databaseCategoryId],
        );
        count("post_categories");
      }
    }
  }

  await connection.commit();
  console.info(
    JSON.stringify(Object.fromEntries([...counts.entries()].sort()), null, 2),
  );
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
