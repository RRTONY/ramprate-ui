import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const dashboardSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/research/ResearchDashboardClient.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Research Dashboard motion", () => {
  it("uses reduced-motion-safe CSS rather than Framer Motion for domain bars", () => {
    expect(dashboardSource).not.toContain("framer-motion");
    expect(dashboardSource).not.toContain("<motion.div");
    expect(dashboardSource).toContain("flow-research-domain-bar");
    expect(flowStyles).toContain("@keyframes flow-research-domain-bar-enter");
    expect(flowStyles).toContain("transform-origin: left center");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains live research data, dynamic widths, and staggered feedback", () => {
    expect(dashboardSource).toContain("assessment.researchStats.useQuery");
    expect(dashboardSource).toContain("domainData.map((d, i) =>");
    expect(dashboardSource).toContain(
      "(d.count / (domainData[0]?.count || 1)) * 100",
    );
    expect(dashboardSource).toContain("animationDelay: `${i * 100}ms`");
  });
});
