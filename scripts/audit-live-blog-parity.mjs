import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set to audit live blog parity.");
}

const sitemapResponse = await fetch("https://ramprate.com/sitemap.xml");
if (!sitemapResponse.ok) {
  throw new Error(`Unable to load live sitemap: ${sitemapResponse.status}`);
}

const sitemapXml = await sitemapResponse.text();
const liveUrls = [...sitemapXml.matchAll(/<loc>(https:\/\/ramprate\.com\/(?:blog|thinking)\/[^<]+)<\/loc>/g)].map(
  ([, url]) => url,
);
const liveSlugs = new Set(liveUrls.map((url) => new URL(url).pathname));

const connection = await mysql.createConnection(process.env.DATABASE_URL);
try {
  const [rows] = await connection.execute(
    "SELECT slug, section FROM content_documents WHERE content_type = 'post'",
  );
  const databasePaths = new Set(
    rows.map((row) => {
      const post = row;
      const section = post.section === "thinking" ? "thinking" : "blog";
      return `/${section}/${post.slug}`;
    }),
  );

  const missingFromDatabase = [...liveSlugs].filter(
    (path) => !databasePaths.has(path),
  );
  const extraInDatabase = [...databasePaths].filter(
    (path) => !liveSlugs.has(path),
  );

  console.info(
    JSON.stringify(
      {
        liveArticleUrls: liveUrls.length,
        databasePosts: databasePaths.size,
        missingFromDatabase,
        extraInDatabase,
      },
      null,
      2,
    ),
  );
} finally {
  await connection.end();
}
