import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (path: string) => resolve(process.cwd(), path);

function imageAlternative(
  source: string,
  imagePath: string,
): string | undefined {
  const sourceIndex = source.indexOf(`src="${imagePath}"`);
  const componentStart = source.lastIndexOf("<Image", sourceIndex);
  const componentEnd = source.indexOf("/>", sourceIndex);
  return source.slice(componentStart, componentEnd).match(/alt="([^"]+)"/)?.[1];
}

describe("home page SEO metadata", () => {
  it("uses a focused root keyword set of three to eight terms", async () => {
    const [layout, homePage] = await Promise.all([
      readFile(projectFile("src/app/layout.tsx"), "utf8"),
      readFile(projectFile("src/app/page.tsx"), "utf8"),
    ]);
    const keywordSets = [layout, homePage].map((source) => {
      const match = source.match(/keywords:\s*\[([\s\S]*?)\],/);
      return match?.[1].match(/"([^"]+)"/g) ?? [];
    });

    for (const keywords of keywordSets) {
      expect(keywords).toHaveLength(6);
      expect(keywords.length).toBeGreaterThanOrEqual(3);
      expect(keywords.length).toBeLessThanOrEqual(8);
    }
    expect(homePage).not.toContain("peptide supplier network");
    expect(homePage).not.toContain("verified peptide suppliers");
    expect(homePage).not.toContain("peptide sourcing");
  });

  it("provides a descriptive alternative text value for the home hero image", async () => {
    const homeContent = await readFile(
      projectFile("src/components/home/HomeContent.tsx"),
      "utf8",
    );

    expect(homeContent).toMatch(
      /src="\/hero\.webp"\s+alt="Technology advisory team collaborating in a modern office"/,
    );
  });

  it("provides non-empty alternatives for all three rendered home-page images", async () => {
    const [header, homeContent, footer, logo] = await Promise.all([
      readFile(projectFile("src/components/layout/Header.tsx"), "utf8"),
      readFile(projectFile("src/components/home/HomeContent.tsx"), "utf8"),
      readFile(projectFile("src/components/layout/Footer.tsx"), "utf8"),
      readFile(projectFile("src/components/shared/Logo.tsx"), "utf8"),
    ]);
    const renderedImageAlternatives = [
      imageAlternative(logo, "/ramprate-logo.png"),
      imageAlternative(homeContent, "/hero.webp"),
      imageAlternative(logo, "/ramprate-logo.png"),
    ];

    expect(header).toContain("<Logo");
    expect(footer).toContain("<Logo");
    expect(renderedImageAlternatives).toHaveLength(3);
    expect(renderedImageAlternatives.every(Boolean)).toBe(true);
  });

  it("keeps the shared header brand treatment focused on the RampRate wordmark", async () => {
    const logo = await readFile(
      projectFile("src/components/shared/Logo.tsx"),
      "utf8",
    );

    expect(logo).toContain('src="/ramprate-logo.png"');
    expect(logo).not.toContain("BRAND_MARK_SRC");
    expect(logo).not.toContain('src="/icon.svg"');
  });

  it("declares published favicon, manifest, social preview, canonical, and crawler metadata", async () => {
    const [layout, robots, manifest] = await Promise.all([
      readFile(projectFile("src/app/layout.tsx"), "utf8"),
      readFile(projectFile("src/app/robots.ts"), "utf8"),
      readFile(projectFile("src/app/manifest.ts"), "utf8"),
    ]);

    expect(layout).toContain('metadataBase: new URL("https://ramprate.com")');
    expect(layout).toContain('manifest: "/manifest.webmanifest"');
    expect(layout).toContain('url: "/icon.svg", type: "image/svg+xml"');
    expect(layout).toContain('url: "/apple-icon.svg", type: "image/svg+xml"');
    expect(layout).toContain('url: "/opengraph-image"');
    expect(robots).toContain("sitemap: 'https://ramprate.com/sitemap.xml'");
    expect(robots).toContain("host: 'https://ramprate.com'");
    expect(manifest).toContain('theme_color: "#170B25"');
  });

  it("keeps managed content images meaningful when legacy records lack a hand-authored caption", async () => {
    const [contentImage, portableText] = await Promise.all([
      readFile(projectFile("src/components/shared/ContentImage.tsx"), "utf8"),
      readFile(projectFile("src/lib/content/portable-text.tsx"), "utf8"),
    ]);

    expect(contentImage).toContain("alt={alternative}");
    expect(contentImage).toContain("title={title}");
    expect(contentImage).toContain('"RampRate content image"');
    expect(portableText).toContain(
      'alt={value.alt || value.caption || "RampRate article image"}',
    );
  });
});
