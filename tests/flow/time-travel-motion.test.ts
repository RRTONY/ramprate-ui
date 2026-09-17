import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const timeTravelSource = fs.readFileSync(
  path.join(process.cwd(), "src/components/flow/TimeTravel.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Time Travel motion", () => {
  it("uses reduced-motion-safe CSS for member-bar entry rather than Framer Motion", () => {
    expect(timeTravelSource).not.toContain("framer-motion");
    expect(timeTravelSource).not.toContain("<motion.div");
    expect(timeTravelSource).toContain("flow-time-travel-member-bar");
    expect(flowStyles).toContain(
      "@keyframes flow-time-travel-member-bar-enter",
    );
    expect(flowStyles).toContain("transform-origin: bottom");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains time controls, active-member calculations, and dynamic score heights", () => {
    expect(timeTravelSource).toContain("setInterval");
    expect(timeTravelSource).toContain("setTimeIndex");
    expect(timeTravelSource).toContain(
      "const activeMembers = members.slice(0, timeIndex)",
    );
    expect(timeTravelSource).toContain("style={{ height: `${m.score}%` }}");
  });
});
