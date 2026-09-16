import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Search Torque taxonomy parity", () => {
  it("uses the current live Torque label and canonical route in public search surfaces", async () => {
    const [searchRoute, staticIndex] = await Promise.all([
      readFile(resolve(process.cwd(), "src/app/search/page.tsx"), "utf8"),
      readFile(resolve(process.cwd(), "src/lib/site-pages.ts"), "utf8"),
    ]);

    expect(searchRoute).toContain('"Torque"');
    expect(searchRoute).not.toContain('"Private Advisory"');
    expect(staticIndex).toContain(
      'title: "Torque - Litigation Counsel Sourcing"',
    );
    expect(staticIndex).toContain('path: "/torque"');
    expect(staticIndex).not.toContain('path: "/private-advisory"');
  });
});
