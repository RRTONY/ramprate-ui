import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("shared footer brand links", () => {
  it("uses the approved plain-language Services architecture and separate ImpactSol brand", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/components/layout/Footer.tsx"),
      "utf8",
    );

    expect(source).toContain('label: "Relationship & Specialist Sourcing"');
    expect(source).toContain('href: "/services/relationship-specialist-sourcing"');
    expect(source).toContain('label: "Deal & Partnership Structuring"');
    expect(source).toContain('href="/services"');
    expect(source).toContain("A separate RampRate brand");
    expect(source).not.toContain('label: "Private Advisory"');
  });
});
