import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (path: string) => resolve(process.cwd(), path);

describe("blue public content routes", () => {
  it("keeps the home, blog archive, and article routes on the database-backed blue presentation", async () => {
    const [home, blog, article] = await Promise.all([
      readFile(projectFile("src/components/home/HomeContent.tsx"), "utf8"),
      readFile(projectFile("src/app/blog/page.tsx"), "utf8"),
      readFile(projectFile("src/app/blog/[slug]/page.tsx"), "utf8"),
    ]);

    expect(home).toContain('className="home-blue min-h-screen"');
    expect(blog).toContain('className="blog-blue min-h-screen"');
    expect(article).toContain('className="blog-blue min-h-screen"');
    expect(blog).toContain('from "@/lib/content/client"');
    expect(article).toContain('from "@/lib/content/client"');
    expect(article).toContain("<ContentImage");
  });

  it("retains canonical and social-preview metadata for the archive and article routes", async () => {
    const [blog, article] = await Promise.all([
      readFile(projectFile("src/app/blog/page.tsx"), "utf8"),
      readFile(projectFile("src/app/blog/[slug]/page.tsx"), "utf8"),
    ]);

    expect(blog).toContain('canonical: "https://ramprate.com/blog"');
    expect(blog).toContain('images: ["/opengraph-image"]');
    expect(article).toContain("canonical: `/blog/${slug}`");
    expect(article).toContain('type: "article" as const');
  });
});
