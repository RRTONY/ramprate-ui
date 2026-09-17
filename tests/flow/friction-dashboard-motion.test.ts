import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const dashboardSource = fs.readFileSync(
  path.join(process.cwd(), "src/components/flow/FrictionDashboard.tsx"),
  "utf8",
);

describe("Flow Friction Dashboard motion", () => {
  it("uses keyed CSS feedback rather than Framer Motion for cost recalculation", () => {
    expect(dashboardSource).not.toContain("framer-motion");
    expect(dashboardSource).not.toContain("<motion.div");
    expect(dashboardSource).toContain("key={totalCost}");
    expect(dashboardSource).toContain("flow-friction-cost-pop");
  });

  it("retains calculation and chart input behavior", () => {
    expect(dashboardSource).toContain("const totalCost = Math.round(");
    expect(dashboardSource).toContain("<Slider");
    expect(dashboardSource).toContain("<PieChart>");
  });
});
