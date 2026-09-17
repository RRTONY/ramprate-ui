import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const familySource = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/family/FamilyDynamicClient.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Family Dynamic motion", () => {
  it("uses reduced-motion-safe CSS instead of Framer Motion", () => {
    expect(familySource).not.toContain("framer-motion");
    expect(familySource).not.toContain("<motion.");
    expect(familySource).not.toContain("AnimatePresence");
    expect(familySource).toContain("flow-family-zone-labels");
    expect(familySource).toContain("flow-family-node-position");
    expect(familySource).toContain("flow-family-insight-enter");
    expect(flowStyles).toContain("@keyframes flow-family-insight-enter");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains assessment data, calculated map geometry, controls, reports, and insights", () => {
    expect(familySource).toContain("trpc.assessment.byDomain.useQuery");
    expect(familySource).toContain("generatePositions(index, role)");
    expect(familySource).toContain("setIsFixed(!isFixed)");
    expect(familySource).toContain("generateFamilyFriction.useMutation");
    expect(familySource).toContain("handleCopyInviteLink");
    expect(familySource).toContain("familyStressAnalysis.frictionPairs");
    expect(familySource).toContain("familyInsights.map");
  });
});
