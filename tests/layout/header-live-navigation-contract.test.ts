import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("shared public navigation contract", () => {
  it("uses the approved plain-language Services taxonomy with requested legacy identity markers", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/components/layout/Header.tsx"),
      "utf8",
    );

    expect(source).not.toContain('label: "Process"');
    expect(source).not.toContain("Browse Catalogue");
    expect(source).not.toContain("isBiochainPage");
    expect(source).toContain("const services = [");
    expect(source).toContain('label: "Case Studies"');
    expect(source).toContain('label: "Contact Us"');
    expect(source).not.toContain('label: "Thinking"');
    expect(source).not.toContain('label: "Engage"');
    expect(source).toContain('legacyLabel: "Torque"');
    expect(source).toContain('legacyLabel: "Syzygy"');
    expect(source).toContain("rr-header-service-identity");
  });
});
