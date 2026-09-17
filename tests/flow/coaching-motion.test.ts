import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const coachingSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/coaching/CoachingClient.tsx"),
  "utf8",
);
const flowStyles = fs.readFileSync(
  path.join(process.cwd(), "src/app/flow/globals.css"),
  "utf8",
);

describe("Flow Coaching motion", () => {
  it("uses reduced-motion-safe CSS rather than Framer Motion", () => {
    expect(coachingSource).not.toContain("framer-motion");
    expect(coachingSource).not.toContain("<motion.");
    expect(coachingSource).not.toContain("AnimatePresence");
    expect(coachingSource).toContain("flow-coaching-header-enter");
    expect(coachingSource).toContain("flow-coaching-prompt-enter");
    expect(coachingSource).toContain('"--flow-entry-delay": `${i * 150}ms`');
    expect(flowStyles).toContain("@keyframes flow-coaching-prompt-enter");
    expect(flowStyles).toContain("prefers-reduced-motion: reduce");
  });

  it("retains authentication, context switching, prompt generation, and reset behavior", () => {
    expect(coachingSource).toContain("if (!isAuthenticated)");
    expect(coachingSource).toContain("setContext(key)");
    expect(coachingSource).toContain("generateMutation.mutate({");
    expect(coachingSource).toContain('router.push("/flow/assessment")');
    expect(coachingSource).toContain("Regenerate Prompts");
  });
});
