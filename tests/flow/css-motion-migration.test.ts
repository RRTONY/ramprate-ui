import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const migratedModules = [
  "src/app/flow/protocol/ProtocolClient.tsx",
  "src/app/flow/team-settings/TeamSettingsClient.tsx",
  "src/app/flow/manager-guidebook/ManagerGuidebookClient.tsx",
] as const;

describe("Flow CSS motion migration", () => {
  it("uses the reduced-motion-safe shared reveal utility for the first migrated entry surfaces", async () => {
    const sources = await Promise.all(
      migratedModules.map(async (modulePath) => {
        const moduleFile = new URL(`../../${modulePath}`, import.meta.url);
        return readFile(moduleFile, "utf8");
      }),
    );

    for (const source of sources) {
      expect(source).not.toContain("framer-motion");
      expect(source).toContain("flow-reveal");
    }

    const stylesheetFile = new URL(
      "../../src/app/globals.css",
      import.meta.url,
    );
    const stylesheet = await readFile(stylesheetFile, "utf8");

    expect(stylesheet).toContain(".flow-reveal");
    expect(stylesheet).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
