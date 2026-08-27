import { describe, expect, it } from "vitest";
import { parseLighthouseResult } from "@/lib/admin/lighthouse-check";

function mockPsiResponse() {
  return {
    lighthouseResult: {
      categories: {
        performance: {
          score: 0.42,
          auditRefs: [{ id: "lcp" }, { id: "unused-js" }],
        },
        accessibility: { score: 0.95, auditRefs: [{ id: "alt-text" }] },
        "best-practices": { score: 1, auditRefs: [] },
        seo: { score: 0.8, auditRefs: [{ id: "meta-description" }] },
      },
      audits: {
        lcp: {
          title: "Largest Contentful Paint",
          description:
            "LCP measures [loading performance](https://web.dev/lcp).",
          score: 0.2,
          scoreDisplayMode: "numeric",
        },
        "unused-js": {
          title: "Reduce unused JavaScript",
          description: "Remove unused JS.",
          score: 0.5,
          scoreDisplayMode: "numeric",
        },
        "alt-text": {
          title: "Image elements have alt text",
          description: "Fine.",
          score: 1,
          scoreDisplayMode: "binary",
        },
        "meta-description": {
          title: "Document has a meta description",
          description: "Missing or thin.",
          score: 0.6,
          scoreDisplayMode: "binary",
        },
      },
    },
  };
}

describe("parseLighthouseResult", () => {
  it("converts 0-1 category scores to 0-100", () => {
    const result = parseLighthouseResult(
      mockPsiResponse(),
      "https://ramprate.com/growth",
      "mobile",
    );
    expect(result.scores.performance).toBe(42);
    expect(result.scores.accessibility).toBe(95);
    expect(result.scores.bestPractices).toBe(100);
    expect(result.scores.seo).toBe(80);
    expect(result.url).toBe("https://ramprate.com/growth");
    expect(result.strategy).toBe("mobile");
  });

  it("only surfaces failing audits (score < 0.9), worst first, and strips markdown links", () => {
    const result = parseLighthouseResult(
      mockPsiResponse(),
      "https://ramprate.com/growth",
      "mobile",
    );
    const ids = result.topIssues.map((i) => i.id);
    expect(ids).toEqual(["lcp", "unused-js", "meta-description"]);
    expect(ids).not.toContain("alt-text"); // score 1, passing
    expect(result.topIssues[0].description).not.toContain(
      "(https://web.dev/lcp)",
    );
    expect(result.topIssues[0].description).toContain("loading performance");
  });

  it("handles a response with no categories/audits gracefully", () => {
    const result = parseLighthouseResult(
      {},
      "https://ramprate.com/",
      "desktop",
    );
    expect(result.scores).toEqual({
      performance: null,
      accessibility: null,
      bestPractices: null,
      seo: null,
    });
    expect(result.topIssues).toEqual([]);
  });
});
