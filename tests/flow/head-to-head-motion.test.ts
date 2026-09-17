import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const comparisonSource = fs.readFileSync(
  path.join(process.cwd(), "src/components/flow/HeadToHead.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Head-to-Head analysis motion", () => {
  it("uses keyed CSS feedback rather than Framer Motion", () => {
    expect(comparisonSource).not.toContain("framer-motion");
    expect(comparisonSource).not.toContain("AnimatePresence");
    expect(comparisonSource).toContain("flow-head-to-head-analysis");
    expect(comparisonSource).toContain("key={`${memberA}-${memberB}`}");
    expect(flowStyles).toContain("@keyframes flow-head-to-head-analysis-enter");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains member selection, comparison analysis, and manager guidance", () => {
    expect(comparisonSource).toContain("setMemberA");
    expect(comparisonSource).toContain("setMemberB");
    expect(comparisonSource).toContain("analyzeDynamics");
    expect(comparisonSource).toContain("Manager&#39;s Tip:");
  });
});
