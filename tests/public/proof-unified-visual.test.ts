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

  it("keeps reusable Proof presentation in classes while retaining only division-derived colors inline", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/app/proof/ProofClient.tsx"),
      "utf8",
    );

    expect(source).toContain("font-display");
    expect(source).toContain("font-body");
    expect(source).toContain("font-mono");
    expect(source).toContain('href="/process#flow-circuit"');
    expect(source).toContain('href="/process#find-me"');
    expect(source).toContain("divisionColors[t.division]");
    expect(source.match(/style=\{\{/g) ?? []).toHaveLength(1);
    expect(source).not.toContain("fontFamily:");
    expect(source).not.toContain("onMouseEnter=");
    expect(source).not.toContain("onMouseLeave=");
  });
});
