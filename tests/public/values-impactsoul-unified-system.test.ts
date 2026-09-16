import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Values and ImpactSol unified public system", () => {
  it("keeps both pages on scoped navy-paper-gold public surfaces while retaining a distinct ImpactSol accent", async () => {
    const [styles, values, impactSol] = await Promise.all([
      readFile(resolve(process.cwd(), "src/app/globals.css"), "utf8"),
      readFile(resolve(process.cwd(), "src/app/values/page.tsx"), "utf8"),
      readFile(resolve(process.cwd(), "src/app/impactsoul/page.tsx"), "utf8"),
    ]);

    expect(styles).toContain(".rr-values,");
    expect(styles).toContain(".rr-impactsol {");
    expect(styles).toContain("--impactsol-accent: #4f7d73");
    expect(styles).toContain(".rr-public-cta");
    expect(values).toContain('className="rr-values"');
    expect(values).toContain('className="rr-public-cta py-20 sm:py-24"');
    expect(impactSol).toContain('className="rr-impactsol"');
    expect(impactSol).toContain("ImpactSol - Since 2024");
    expect(impactSol).toContain('className="rr-public-cta py-16 sm:py-20"');
  });
});
