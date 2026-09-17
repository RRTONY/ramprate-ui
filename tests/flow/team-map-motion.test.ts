import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const teamMapSource = readFileSync(
  new URL("../../src/components/flow/TeamMap.tsx", import.meta.url),
  "utf8",
);
const flowStyles = readFileSync(
  new URL("../../src/app/flow/globals.css", import.meta.url),
  "utf8",
);

describe("Flow Team Map CSS motion", () => {
  it("uses native pointer controls and scoped CSS rather than Framer Motion", () => {
    expect(teamMapSource).not.toContain("framer-motion");
    expect(teamMapSource).toContain("onPointerDown={handlePointerDown}");
    expect(teamMapSource).toContain("onPointerUp={handlePointerUp}");
    expect(teamMapSource).toContain("flow-team-map-flow-path");
    expect(teamMapSource).toContain("flow-team-map-node-visual");
    expect(teamMapSource).toContain("flow-team-map-report-enter");
    expect(flowStyles).toContain("@keyframes flow-team-map-flow-path");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains the native drag threshold, dynamic positions, report capture, and sound behavior", () => {
    expect(teamMapSource).toContain("event.clientX - startX > 100");
    expect(teamMapSource).toContain("left: `${position.x}%`");
    expect(teamMapSource).toContain("top: `${position.y}%`");
    expect(teamMapSource).toContain("audioRef.current.play()");
    expect(teamMapSource).toContain("handleEmailSubmit");
    expect(teamMapSource).toContain('toast.success("Report Unlocked"');
    expect(teamMapSource).toContain("group-hover:opacity-100");
  });
});
