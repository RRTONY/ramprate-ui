import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("Flow Assessment CSS motion migration", () => {
  it("uses scoped reduced-motion-safe CSS while retaining assessment lifecycle behavior", async () => {
    const [source, stylesheet] = await Promise.all([
      readFile(
        new URL(
          "../../src/app/flow/assessment/AssessmentClient.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL("../../src/app/flow/globals.css", import.meta.url),
        "utf8",
      ),
    ]);

    expect(source).not.toContain("framer-motion");
    expect(source).not.toContain("AnimatePresence");
    expect(source).toContain("flow-assessment-entry");
    expect(source).toContain("flow-assessment-entry-scale");
    expect(source).toContain("flow-assessment-team-detect");
    expect(source).toContain("flow-assessment-progress-bar");
    expect(source).toContain("style={{ width: `${progress}%` }}");
    expect(source).toContain("flow-assessment-question-transition");
    expect(source).toContain("flow-assessment-texture--cubes");
    expect(source).toContain("flow-assessment-texture--stardust");
    expect(source).not.toContain("backgroundImage:");
    expect(source).toContain("<RankableQuestion");
    expect(source).toContain("createInvites.mutateAsync");
    expect(source).toContain("generateReport.mutateAsync");
    expect(source).toContain('setPhase("invite360")');
    expect(source).toContain("saveAssessmentToHistory");

    expect(stylesheet).toContain("@keyframes flow-assessment-enter");
    expect(stylesheet).toContain("@keyframes flow-assessment-question-enter");
    expect(stylesheet).toContain(".flow-assessment-progress-bar");
    expect(stylesheet).toContain(".flow-assessment-texture--cubes");
    expect(stylesheet).toContain(".flow-assessment-texture--stardust");
    expect(stylesheet).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
