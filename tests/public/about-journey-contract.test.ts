import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("About journey public contract", () => {
  it("uses the shared RampRate visual system and hosts the journey destination", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/app/about/page.tsx"),
      "utf8",
    );

    expect(source).toContain("rr-public-surface");
    expect(source).toContain('id="journey"');
    expect(source).toContain("About RampRate");
    expect(source).toContain('className="text-gold"');
    expect(source).toContain("teamMembersQuery");
    expect(source).toContain("boardAdvisorsQuery");
  });
});
