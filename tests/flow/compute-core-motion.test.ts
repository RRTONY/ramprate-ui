import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const computeCoreSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/compute-core/ComputeCoreClient.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Compute Core motion", () => {
  it("uses reduced-motion-safe CSS rather than Framer Motion", () => {
    expect(computeCoreSource).not.toContain("framer-motion");
    expect(computeCoreSource).not.toContain("<motion.");
    expect(computeCoreSource).toContain("flow-compute-boot-line");
    expect(computeCoreSource).toContain("flow-compute-cursor");
    expect(computeCoreSource).toContain("flow-compute-question-enter");
    expect(flowStyles).toContain("@keyframes flow-compute-boot-line");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains boot timing, focused prompts, question progression, and exits", () => {
    expect(computeCoreSource).toContain(
      "setBootSequence((prev) => [...prev, line])",
    );
    expect(computeCoreSource).toContain("setIsBooted(true)");
    expect(computeCoreSource).toContain("inputRef.current.focus()");
    expect(computeCoreSource).toContain(
      "setCurrentQuestion((prev) => prev + 1)",
    );
    expect(computeCoreSource).toContain('window.location.href = "/"');
  });
});
