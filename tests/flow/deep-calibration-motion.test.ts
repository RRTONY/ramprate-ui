import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const calibrationSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/flow/deep-calibration/DeepCalibrationClient.tsx",
  ),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Deep Calibration motion and ranking", () => {
  it("uses scoped reduced-motion-safe CSS rather than Framer Motion or Reorder", () => {
    expect(calibrationSource).not.toContain("framer-motion");
    expect(calibrationSource).not.toContain("<motion.");
    expect(calibrationSource).not.toContain("<Reorder.");
    expect(calibrationSource).toContain("flow-deep-calibration-phase-enter");
    expect(calibrationSource).toContain("flow-deep-calibration-progress-bar");
    expect(calibrationSource).toContain("flow-deep-calibration-score-bar");
    expect(flowStyles).toContain("@keyframes flow-deep-calibration-enter");
    expect(flowStyles).toContain("@keyframes flow-deep-calibration-spin");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains native drag, keyboard-accessible ranking controls, calibrated scoring, authentication, submission, and retake behavior", () => {
    expect(calibrationSource).toContain("draggable");
    expect(calibrationSource).toContain("onDragStart");
    expect(calibrationSource).toContain("onDrop");
    expect(calibrationSource).toContain('moveStatement(stmtId, "up")');
    expect(calibrationSource).toContain('moveStatement(stmtId, "down")');
    expect(calibrationSource).toContain(
      "aria-label={`Move ${rankLabels[index]} statement up`}",
    );
    expect(calibrationSource).toContain(
      "calculateCalibratedScores(newRankings)",
    );
    expect(calibrationSource).toContain("saveCalibration.mutate({");
    expect(calibrationSource).toContain('window.location.href = "/flow/login"');
    expect(calibrationSource).toContain('router.push("/flow/assessment")');
    expect(calibrationSource).toContain('setPhase("intro")');
    expect(calibrationSource).toContain("style={{ width: `${calibPct}%` }}");
  });
});
