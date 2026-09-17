import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const monroeSource = fs.readFileSync(
  path.join(process.cwd(), "src/components/flow/MonroeProtocol.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Monroe Protocol motion", () => {
  it("uses reduced-motion-safe CSS rather than Framer Motion", () => {
    expect(monroeSource).not.toContain("framer-motion");
    expect(monroeSource).not.toContain("<motion.");
    expect(monroeSource).not.toContain("AnimatePresence");
    expect(monroeSource).toContain("flow-monroe-science-enter");
    expect(monroeSource).toContain("flow-monroe-audio-progress");
    expect(monroeSource).toContain("flow-monroe-quiz-enter");
    expect(flowStyles).toContain("@keyframes flow-monroe-audio-progress");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains scientific caveats, playback, quiz completion, and reset behavior", () => {
    expect(monroeSource).toContain("clinically");
    expect(monroeSource).toContain("validated intervention");
    expect(monroeSource).toContain("setShowScience(!showScience)");
    expect(monroeSource).toContain("setIsPlaying(!isPlaying)");
    expect(monroeSource).toContain("handleQuizComplete(opt.result)");
    expect(monroeSource).toContain("setQuizResult(null)");
  });
});
