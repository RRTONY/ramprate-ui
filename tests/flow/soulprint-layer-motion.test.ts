import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("Flow SoulPrint Layer CSS motion migration", () => {
  it("uses scoped reduced-motion-safe CSS while retaining consent, disclosure, and source behavior", async () => {
    const [source, stylesheet] = await Promise.all([
      readFile(
        new URL(
          "../../src/app/flow/consciousness/SoulPrintLayerClient.tsx",
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
    expect(source).toContain("flow-soulprint-layer-entry");
    expect(source).toContain("flow-soulprint-layer-entry-scale");
    expect(source).toContain("flow-soulprint-layer-expand");
    expect(source).toContain("flow-soulprint-layer-spinner");
    expect(source).toContain("toggleEnabledMutation.mutate");
    expect(source).toContain("toggleTeamMutation.mutate");
    expect(source).toContain("consentMutation.mutate");
    expect(source).toContain("showEvidence");
    expect(source).toContain("Honest Limitations");
    expect(source).toContain("https://www.reuters.com/");
    expect(source).toContain("https://www.siyglobal.com/");

    expect(stylesheet).toContain("@keyframes flow-soulprint-layer-enter");
    expect(stylesheet).toContain("@keyframes flow-soulprint-layer-spin");
    expect(stylesheet).toContain(".flow-soulprint-layer-expand");
    expect(stylesheet).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
