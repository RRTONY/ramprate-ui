import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const inspirationsSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/inspirations/InspirationsClient.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Inspirations motion", () => {
  it("uses reduced-motion-safe CSS instead of Framer Motion for all display wrappers", () => {
    expect(inspirationsSource).not.toContain("framer-motion");
    expect(inspirationsSource).not.toContain("<motion.");
    expect(inspirationsSource).toContain("flow-inspirations-hero-enter");
    expect(inspirationsSource).toContain("flow-inspirations-thinker-enter");
    expect(inspirationsSource).toContain("flow-inspirations-citation-enter");
    expect(inspirationsSource).toContain("flow-inspirations-section-enter");
    expect(flowStyles).toContain("@keyframes flow-inspirations-enter");
    expect(flowStyles).toContain("@keyframes flow-inspirations-citation-enter");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains thinker and research citations, validation disclosure, external sources, and primary reader actions", () => {
    expect(inspirationsSource).toContain("Standing on the Shoulders of Giants");
    expect(inspirationsSource).toContain("researchCitations");
    expect(inspirationsSource).toContain("current validation status");
    expect(inspirationsSource).toContain(
      'href="/flow/science#validation-status"',
    );
    expect(inspirationsSource).toContain('href="/flow/assessment"');
    expect(inspirationsSource).toContain('href="/flow/science"');
    expect(inspirationsSource).toContain('target="_blank"');
    expect(inspirationsSource).not.toContain("CSS, Framer Motion, Recharts");
  });
});
