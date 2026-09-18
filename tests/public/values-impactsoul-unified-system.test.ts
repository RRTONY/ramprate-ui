import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Values and ImpactSol unified public system", () => {
  it("uses the approved shared public display token for global headings and the reference footer heading", async () => {
    const [styles, layout] = await Promise.all([
      readFile(resolve(process.cwd(), "src/app/globals.css"), "utf8"),
      readFile(resolve(process.cwd(), "src/app/layout.tsx"), "utf8"),
    ]);

    expect(layout).toContain('variable: "--font-display"');
    expect(styles).toContain("h6 {\n    font-family: var(--font-display);");
    expect(styles).toContain(
      "font-family: var(--font-display), Georgia, serif;",
    );
    expect(styles).not.toContain("--font-playfair-display");
  });

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

  it("uses public font utilities for fixed ImpactSol typography while retaining only accent and methodology-derived inline colors", async () => {
    const impactSol = await readFile(
      resolve(process.cwd(), "src/app/impactsoul/page.tsx"),
      "utf8",
    );

    expect(impactSol).toContain("font-display");
    expect(impactSol).toContain("font-body");
    expect(impactSol).toContain("font-mono");
    expect(impactSol).not.toContain("fontFamily:");
    expect(impactSol).toContain("var(--impactsol-accent)");
    expect(impactSol).toContain("step.color.replace");
    expect(impactSol).toContain("style={{ color: step.color }}");
    expect(impactSol).toContain('href="/contact"');
    expect(impactSol).toContain('href="/process#flow-circuit"');
    expect(impactSol).toContain('href="/process#find-me"');
  });

  it("keeps Values fixed practice and methodology presentation utility-based while retaining only mapped colors inline", async () => {
    const values = await readFile(
      resolve(process.cwd(), "src/app/values/page.tsx"),
      "utf8",
    );

    expect(values).toContain("bg-[#0a0f1a]");
    expect(values).toContain("bg-[#f7f4f0]");
    expect(values).toContain("bg-[#0d1117]");
    expect(values).toContain("border-white/8 bg-white/4");
    expect(values).toContain("border-black/[0.07]");
    expect(values).not.toContain('style={{ background: "#0a0f1a" }}');
    expect(values).not.toContain('style={{ background: "#f7f4f0" }}');
    expect(values).not.toContain('style={{ background: "#0d1117" }}');
    expect(values).toContain("style={{ background: item.color }}");
    expect(values).toContain("borderLeftColor:");
  });
});
