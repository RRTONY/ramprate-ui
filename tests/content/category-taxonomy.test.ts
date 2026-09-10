import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("managed category taxonomy", () => {
  it("keeps normalized category mappings and public category redirects connected to the database content layer", async () => {
    const [schema, categoryRoute, contentClient] = await Promise.all([
      readFile(resolve(process.cwd(), "src/lib/content/schema.ts"), "utf8"),
      readFile(
        resolve(process.cwd(), "src/app/blog/category/[slug]/page.tsx"),
        "utf8",
      ),
      readFile(resolve(process.cwd(), "src/lib/content/client.ts"), "utf8"),
    ]);

    expect(schema).toContain('"content_categories"');
    expect(schema).toContain('"post_categories"');
    expect(schema).toContain("references(() => contentCategories.id");
    expect(categoryRoute).toContain("categoryBySlugQuery");
    expect(categoryRoute).toContain(
      "permanentRedirect(`/blog?category=${slug}`)",
    );
    expect(contentClient).toContain("contentCategories");
    expect(contentClient).toContain("postCategories");
  });

  it("ships the full source-to-normalized taxonomy audit and route check", async () => {
    const auditScript = await readFile(
      resolve(process.cwd(), "scripts/audit-category-parity.mjs"),
      "utf8",
    );

    expect(auditScript).toContain(
      "content_documents WHERE content_type = 'category'",
    );
    expect(auditScript).toContain("content_categories");
    expect(auditScript).toContain("post_categories");
    expect(auditScript).toContain("/blog/category/");
    expect(auditScript).toContain("routeFailures");
  });
});
