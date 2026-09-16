import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("utility-route public visual system", () => {
  it("keeps the BioChain Sourcing alias readable over its light landing surface", async () => {
    const [header, subNav] = await Promise.all([
      readFile(
        resolve(process.cwd(), "src/components/layout/Header.tsx"),
        "utf8",
      ),
      readFile(
        resolve(process.cwd(), "src/components/biochain/BioChainSubNav.tsx"),
        "utf8",
      ),
    ]);

    expect(header).toContain('"/biochain-sourcing"');
    expect(subNav).toContain('pathname === "/biochain-sourcing"');
  });

  it("uses shared RampRate tokens for the protected ownership-brief gate", async () => {
    const gate = await readFile(
      resolve(process.cwd(), "src/app/aidoc-ownership-brief/AiDocGate.tsx"),
      "utf8",
    );

    expect(gate).toContain('className="rr-aidoc-gate');
    expect(gate).toContain("rr-aidoc-gate-panel");
    expect(gate).toContain("rr-aidoc-gate-input");
    expect(gate).toContain("rr-aidoc-gate-button");
    expect(gate).toContain('error ? "is-error" : ""');
    expect(gate).toContain('shake ? "is-shaking" : ""');
  });
});
