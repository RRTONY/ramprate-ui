import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Torque compatibility route", () => {
  it("permanently redirects the retired Torque route while retaining the legacy advisory alias", async () => {
    const [torqueSource, legacySource] = await Promise.all([
      readFile(resolve(process.cwd(), "src/app/torque/page.tsx"), "utf8"),
      readFile(
        resolve(process.cwd(), "src/app/private-advisory/page.tsx"),
        "utf8",
      ),
    ]);

    expect(torqueSource).toContain(
      'permanentRedirect("/services/relationship-specialist-sourcing")',
    );
    expect(torqueSource).not.toContain("Torque - RampRate");
    expect(legacySource).toContain(
      'import { permanentRedirect } from "next/navigation"',
    );
    expect(legacySource).toContain('permanentRedirect("/torque")');
  });
});
