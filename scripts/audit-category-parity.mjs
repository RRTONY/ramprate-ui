import mysql from "mysql2/promise";

const baseUrl = process.env.RAMPRATE_AUDIT_BASE_URL ?? "http://127.0.0.1:3000";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set to audit category parity.");
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  const [sourceRows] = await connection.execute(
    "SELECT source_id, slug FROM content_documents WHERE content_type = 'category' ORDER BY source_id",
  );
  const [normalizedRows] = await connection.execute(
    "SELECT source_id, slug FROM content_categories ORDER BY source_id",
  );
  const [mappingRows] = await connection.execute(
    "SELECT category_id, COUNT(*) AS post_count FROM post_categories GROUP BY category_id",
  );
  const [categoryRows] = await connection.execute(
    "SELECT id, slug FROM content_categories ORDER BY slug",
  );

  const sourceById = new Map(
    sourceRows.map((row) => [row.source_id, row.slug]),
  );
  const normalizedById = new Map(
    normalizedRows.map((row) => [row.source_id, row.slug]),
  );
  const missingNormalized = [...sourceById.entries()]
    .filter(([sourceId]) => !normalizedById.has(sourceId))
    .map(([sourceId, slug]) => ({ sourceId, slug }));
  const unexpectedNormalized = [...normalizedById.entries()]
    .filter(([sourceId]) => !sourceById.has(sourceId))
    .map(([sourceId, slug]) => ({ sourceId, slug }));
  const mismatchedSlugs = [...sourceById.entries()]
    .filter(([sourceId, slug]) => normalizedById.get(sourceId) !== slug)
    .map(([sourceId, sourceSlug]) => ({
      sourceId,
      sourceSlug,
      normalizedSlug: normalizedById.get(sourceId),
    }));
  const mappedIds = new Set(mappingRows.map((row) => row.category_id));
  const emptyCategories = categoryRows
    .filter((row) => !mappedIds.has(row.id))
    .map((row) => row.slug);

  const routeResults = await Promise.all(
    categoryRows.map(async ({ slug }) => {
      const response = await fetch(
        `${baseUrl}/blog/category/${encodeURIComponent(slug)}`,
        { redirect: "follow" },
      );
      const finalUrl = new URL(response.url);
      const expectedQuery = `category=${encodeURIComponent(slug)}`;
      return {
        slug,
        status: response.status,
        canonical:
          finalUrl.pathname === "/blog" &&
          finalUrl.search.includes(expectedQuery),
      };
    }),
  );
  const routeFailures = routeResults.filter(
    (result) => result.status !== 200 || !result.canonical,
  );

  const report = {
    sourceCategoryCount: sourceRows.length,
    normalizedCategoryCount: normalizedRows.length,
    categoriesWithPosts: categoryRows.length - emptyCategories.length,
    emptyCategories,
    missingNormalized,
    unexpectedNormalized,
    mismatchedSlugs,
    checkedRoutes: routeResults.length,
    routeFailures,
  };

  console.log(JSON.stringify(report, null, 2));

  if (
    missingNormalized.length ||
    unexpectedNormalized.length ||
    mismatchedSlugs.length ||
    routeFailures.length
  ) {
    process.exitCode = 1;
  }
} finally {
  await connection.end();
}
