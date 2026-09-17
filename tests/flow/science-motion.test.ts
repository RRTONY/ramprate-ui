import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const scienceSource = readFileSync(
  new URL("../../src/app/flow/science/ScienceClient.tsx", import.meta.url),
  "utf8",
);
const flowStyles = readFileSync(
  new URL("../../src/app/flow/globals.css", import.meta.url),
  "utf8",
);

describe("Flow Science CSS motion", () => {
  it("uses scoped CSS feedback rather than Framer Motion", () => {
    expect(scienceSource).not.toContain("framer-motion");
    expect(scienceSource).toContain("flow-science-hero-enter");
    expect(scienceSource).toContain("flow-science-card-enter");
    expect(scienceSource).toContain("flow-science-section-enter");
    expect(flowStyles).toContain("@keyframes flow-science-enter");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains research evidence, validation clarity, user controls, and external sources", () => {
    expect(scienceSource).toContain("The Science Behind The Flow Circuit");
    expect(scienceSource).toContain("Pending Independent Validation");
    expect(scienceSource).toContain("Take the Assessment");
    expect(scienceSource).toContain("FrictionCostCalculator");
    expect(scienceSource).toContain("Download PDF");
    expect(scienceSource).toContain(
      "https://pubmed.ncbi.nlm.nih.gov/10668348/",
    );
  });
});
