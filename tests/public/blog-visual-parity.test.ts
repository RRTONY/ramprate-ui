import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Blog archive visual parity", () => {
  it("keeps the database-backed archive in a scoped midnight-navy and gold system", async () => {
    const [route, card, css] = await Promise.all([
      readFile(resolve(process.cwd(), "src/app/blog/page.tsx"), "utf8"),
      readFile(
        resolve(process.cwd(), "src/components/blog/PostCard.tsx"),
        "utf8",
      ),
      readFile(resolve(process.cwd(), "src/app/globals.css"), "utf8"),
    ]);

    expect(route).toContain('className="blog-blue min-h-screen"');
    expect(route).toContain("contentFetch");
    expect(card).toContain("blog-post-card");
    expect(css).toContain(".blog-blue {");
    expect(css).toContain("--dark: #050b14;");
    expect(css).toContain("--gold: #d6ad42;");
    expect(css).toContain(".blog-blue .blog-post-card");
  });
});
