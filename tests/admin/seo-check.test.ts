import { describe, expect, it } from "vitest";
import { decodeEntities, parseSeoFromHtml } from "@/lib/admin/seo-check";

describe("decodeEntities", () => {
  it("decodes common HTML entities", () => {
    expect(decodeEntities("RampRate &amp; Co")).toBe("RampRate & Co");
    expect(decodeEntities("&quot;quoted&quot;")).toBe('"quoted"');
    expect(decodeEntities("it&#39;s")).toBe("it's");
  });
});

describe("parseSeoFromHtml", () => {
  const html = `
    <html><head>
      <title>Growth &amp; Advisory | RampRate</title>
      <meta name="description" content="Anchor clients &amp; capital for founders." />
      <link rel="canonical" href="https://ramprate.com/growth" />
      <meta property="og:title" content="Syzygy Growth" />
      <meta property="og:image" content="https://ramprate.com/og.png" />
      <script type="application/ld+json">{"@type":"Organization"}</script>
    </head><body>
      <h1>Growth Advisory <span>for Founders</span></h1>
    </body></html>
  `;

  it("extracts and decodes all fields", () => {
    const result = parseSeoFromHtml(html, "https://ramprate.com/growth", 200);
    expect(result.title).toBe("Growth & Advisory | RampRate");
    expect(result.metaDescription).toBe(
      "Anchor clients & capital for founders.",
    );
    expect(result.canonical).toBe("https://ramprate.com/growth");
    expect(result.ogTitle).toBe("Syzygy Growth");
    expect(result.ogImage).toBe("https://ramprate.com/og.png");
    expect(result.jsonLdBlocks).toBe(1);
    expect(result.h1Count).toBe(1);
    expect(result.h1s[0]).toBe("Growth Advisory for Founders");
    expect(result.titleLength).toBe(result.title?.length);
  });

  it("returns nulls for missing tags instead of throwing", () => {
    const result = parseSeoFromHtml(
      "<html><body>no head tags here</body></html>",
      "https://ramprate.com/x",
      200,
    );
    expect(result.title).toBeNull();
    expect(result.metaDescription).toBeNull();
    expect(result.h1Count).toBe(0);
    expect(result.jsonLdBlocks).toBe(0);
  });
});
