import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Case Studies unified visual system", () => {
  it("uses the shared navy closing surface and controlled gold result accents", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/app/proof/ProofClient.tsx"),
      "utf8",
    );

    expect(source).toContain('className="rr-public-surface py-16 sm:py-20"');
    expect(source).toContain('className="text-gold">Results</span>');
    expect(source).toContain('className="text-gold">Clients</span> Say');
    expect(source).not.toContain(
      'style={{ background: "oklch(0.55 0.15 30)" }}',
    );
  });
});
