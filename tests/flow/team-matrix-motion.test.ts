import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getTeamMatrixPosition } from "@/components/flow/TeamMatrix";

const matrixSource = fs.readFileSync(
  path.join(process.cwd(), "src/components/flow/TeamMatrix.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Team Matrix motion", () => {
  it("uses staggered CSS entry feedback rather than Framer Motion", () => {
    expect(matrixSource).not.toContain("framer-motion");
    expect(matrixSource).not.toContain("<motion.div");
    expect(matrixSource).toContain("flow-team-matrix-member");
    expect(matrixSource).toContain("--flow-member-entry-delay");
    expect(flowStyles).toContain("@keyframes flow-team-matrix-member-enter");
  });

  it("retains dynamic matrix positions, tooltips, and export", () => {
    expect(matrixSource).toContain("getTeamMatrixPosition(member.role, index)");
    expect(matrixSource).toContain('transform: "translate(-50%, -50%)"');
    expect(matrixSource).toContain('className="absolute w-10 h-10 z-10"');
    expect(matrixSource).toContain("<Tooltip");
    expect(matrixSource).toContain("downloadPDF");
  });

  it("keeps the centered Conductor position transform on the non-animated wrapper", () => {
    expect(getTeamMatrixPosition("Conductor", 0)).toEqual({
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    });
    expect(matrixSource).toContain('className="absolute w-10 h-10 z-10"');
    expect(matrixSource).toContain("flow-team-matrix-member w-full h-full");
  });
});
