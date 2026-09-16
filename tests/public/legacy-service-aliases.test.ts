import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("legacy service aliases", () => {
  it("permanently redirects Torque and Sourcing to the canonical relationship and specialist sourcing service", async () => {
    const [torque, sourcing] = await Promise.all([
      readFile(resolve(process.cwd(), "src/app/torque/page.tsx"), "utf8"),
      readFile(resolve(process.cwd(), "src/app/sourcing/page.tsx"), "utf8"),
    ]);

    const canonicalService =
      'permanentRedirect("/services/relationship-specialist-sourcing")';

    expect(torque).toContain(canonicalService);
    expect(sourcing).toContain(canonicalService);
    expect(torque).not.toContain("Torque - RampRate");
  });
});
