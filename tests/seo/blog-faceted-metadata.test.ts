import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Blog faceted metadata", () => {
  it("keeps the main archive indexable while noindexing category and pagination facets", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/app/blog/page.tsx"),
      "utf8",
    );

    expect(source).toContain('canonical: "https://ramprate.com/blog"');
    expect(source).toContain(
      "searchParams: Promise<{ page?: string; category?: string }>",
    );
    expect(source).toContain("if (sp.category || sp.page)");
    expect(source).toContain(
      "metadata.robots = { index: false, follow: true }",
    );
    expect(source).toContain("return metadata");
  });
});
