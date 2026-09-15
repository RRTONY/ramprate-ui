import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("shared live navigation contract", () => {
  it("keeps the current live global nav free of feature-only catalogue and Process links", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/components/layout/Header.tsx"),
      "utf8",
    );

    expect(source).not.toContain('label: "Process"');
    expect(source).not.toContain("Browse Catalogue");
    expect(source).not.toContain("isBiochainPage");
    expect(source).toContain('label: "Torque"');
    expect(source).toContain('href: "/torque"');
  });
});
