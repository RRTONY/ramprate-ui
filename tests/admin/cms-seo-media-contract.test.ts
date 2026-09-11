import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "../..");

describe("headless CMS SEO and media workflows", () => {
  it("exposes protected page SEO and media metadata resources with Yup validation", async () => {
    const source = await readFile(
      path.join(projectRoot, "src/app/api/admin/content/[resource]/route.ts"),
      "utf8",
    );

    expect(source).toContain('"seo"');
    expect(source).toContain('"media"');
    expect(source).toContain("seoInputSchema");
    expect(source).toContain("mediaInputSchema");
    expect(source).toContain("getAuthorizedAdmin");
    expect(source).toContain("JSON-LD must be an object or an array");
  });

  it("keeps standalone CMS controls for page metadata and accessible media labels", async () => {
    const source = await readFile(
      path.join(
        projectRoot,
        "src/app/flow/admin/content/AdminContentConsole.tsx",
      ),
      "utf8",
    );

    expect(source).toContain('label: "Page SEO"');
    expect(source).toContain('label: "Media metadata"');
    expect(source).toContain("Social image asset ID");
    expect(source).toContain("Descriptive alternative text");
    expect(source).toContain("JSON-LD must be valid JSON");
  });
});
