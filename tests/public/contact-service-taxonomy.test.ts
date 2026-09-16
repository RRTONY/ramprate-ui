import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Contact service taxonomy", () => {
  it("uses the approved plain-language service choices and unified gold action", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/components/sections/ContactForm.tsx"),
      "utf8",
    );

    expect(source).toContain("Relationship & Specialist Sourcing");
    expect(source).toContain("Deal & Partnership Structuring");
    expect(source).toContain(
      "Blockchain, Tokenization & Payment Infrastructure",
    );
    expect(source).toContain("Growth Strategy & Fractional Execution");
    expect(source).toContain("Impact, ESG & Non-Dilutive Capital Advisory");
    expect(source).not.toContain("Growth Advisory / Syzygy");
    expect(source).not.toContain("Web3 / Stratum");
    expect(source).toContain("bg-gold");
  });
});
