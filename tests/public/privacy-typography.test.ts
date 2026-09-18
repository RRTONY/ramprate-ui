import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Privacy public typography", () => {
  it("uses shared font utilities for fixed legal presentation while retaining policy content and contact behavior", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/app/privacy/page.tsx"),
      "utf8",
    );

    expect(source).toContain("font-display");
    expect(source).toContain("font-body");
    expect(source).toContain("font-mono");
    expect(source).not.toContain("fontFamily:");
    expect(source).not.toContain("style={{");
    expect(source).toContain("Privacy Policy");
    expect(source).toContain("Last Updated: April 2026");
    expect(source).toContain('href="mailto:privacy@ramprate.com"');
    expect(source).toContain('href="/contact"');
    expect(source).toContain('canonical: "/privacy"');
  });
});
