import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const calculatorSource = fs.readFileSync(
  path.join(process.cwd(), "src/components/flow/FrictionCalculator.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Friction Calculator motion", () => {
  it("uses keyed CSS feedback rather than Framer Motion for cost recalculation", () => {
    expect(calculatorSource).not.toContain("framer-motion");
    expect(calculatorSource).not.toContain("<motion.div");
    expect(calculatorSource).toContain("key={annualFrictionCost}");
    expect(calculatorSource).toContain("flow-friction-cost-pop");
  });

  it("keeps the CSS feedback reduced-motion safe", () => {
    expect(flowStyles).toContain("@keyframes flow-friction-cost-pop");
    expect(flowStyles).toContain(".flow-friction-cost-pop");
    expect(flowStyles).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
