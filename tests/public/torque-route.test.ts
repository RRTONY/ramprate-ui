import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Torque compatibility route", () => {
  it("serves the live Torque content and permanently redirects the legacy advisory path", async () => {
    const [torqueSource, legacySource] = await Promise.all([
      readFile(resolve(process.cwd(), "src/app/torque/page.tsx"), "utf8"),
      readFile(
        resolve(process.cwd(), "src/app/private-advisory/page.tsx"),
        "utf8",
      ),
    ]);

    expect(torqueSource).toContain('getPageSeo("/torque")');
    expect(torqueSource).toContain("Torque - RampRate");
    expect(torqueSource).toContain("Sourcing the Counsel and");
    expect(legacySource).toContain(
      'import { permanentRedirect } from "next/navigation"',
    );
    expect(legacySource).toContain('permanentRedirect("/torque")');
  });
});
