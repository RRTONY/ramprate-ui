import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("About journey public contract", () => {
  it("uses the shared RampRate visual system and hosts the journey destination", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/app/about/page.tsx"),
      "utf8",
    );

    expect(source).toContain("rr-public-surface");
    expect(source).toContain('id="journey"');
    expect(source).toContain("About RampRate");
    expect(source).toContain('className="text-gold"');
    expect(source).toContain("teamMembersQuery");
    expect(source).toContain("boardAdvisorsQuery");
    expect(source).toContain("rr-about-founder");
    expect(source).toContain("rr-about-principals");
    expect(source).toContain("rr-about-stat");
    expect(source).toContain("rr-about-chip");
    expect(source).toContain("rr-about-primary-link");
    expect(source).toContain("rr-about-secondary-link");
    const convertedRegion = source.slice(
      source.indexOf("FOUNDER'S STORY"),
      source.indexOf("TIMELINE"),
    );
    expect(convertedRegion).not.toContain('style={{ background: "#0d1117" }}');
    expect(convertedRegion).not.toContain(
      'style={{ fontFamily: "var(--font-display)" }}',
    );
  });
});
