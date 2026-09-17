import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const calculatorSource = fs.readFileSync(
  path.join(process.cwd(), "src/components/flow/FrictionCostCalculator.tsx"),
  "utf8",
);

describe("Flow Friction Cost Calculator motion", () => {
  it("uses keyed CSS feedback rather than Framer Motion for calculated cost", () => {
    expect(calculatorSource).not.toContain("framer-motion");
    expect(calculatorSource).not.toContain("<motion.div");
    expect(calculatorSource).toContain("key={annualFrictionCost}");
    expect(calculatorSource).toContain("flow-friction-cost-pop");
  });

  it("retains the calculator inputs and payroll result", () => {
    expect(calculatorSource).toContain("const calculateCost");
    expect(calculatorSource).toContain("<Slider");
    expect(calculatorSource).toContain("percentOfPayroll");
  });
});
