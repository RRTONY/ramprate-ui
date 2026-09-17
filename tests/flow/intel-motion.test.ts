import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const intelSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/intel/IntelClient.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Intelligence motion", () => {
  it("uses reduced-motion-safe CSS instead of Framer Motion for visual entry", () => {
    expect(intelSource).not.toContain("framer-motion");
    expect(intelSource).not.toContain("<motion.");
    expect(intelSource).toContain("flow-intel-hero-enter");
    expect(intelSource).toContain("flow-intel-article-enter");
    expect(flowStyles).toContain("@keyframes flow-intel-enter");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains intelligence articles, external source links, and staggered feedback", () => {
    expect(intelSource).toContain("assessmentNews.map");
    expect(intelSource).toContain("articles.map");
    expect(intelSource).toContain('window.open(article.link, "_blank")');
    expect(intelSource).toContain("article.tags.map");
    expect(intelSource).toContain("animationDelay: `${index * 100}ms`");
  });
});
