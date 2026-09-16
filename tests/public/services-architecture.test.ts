import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("plain-language Services architecture", () => {
  it("uses the approved customer-facing navigation and retains ImpactSol as a separate brand path", async () => {
    const [header, catalog, hub] = await Promise.all([
      readFile(
        resolve(process.cwd(), "src/components/layout/Header.tsx"),
        "utf8",
      ),
      readFile(resolve(process.cwd(), "src/lib/service-catalog.ts"), "utf8"),
      readFile(resolve(process.cwd(), "src/app/services/page.tsx"), "utf8"),
    ]);

    expect(header).toContain("const services = [");
    expect(header).toContain('href="/services"');
    expect(header).toContain('label: "Case Studies"');
    expect(header).toContain('label: "Contact Us"');
    expect(header).not.toContain('label: "Thinking"');
    expect(header).not.toContain('label: "Engage"');
    expect(catalog).toContain("Relationship & Specialist Sourcing");
    expect(catalog).toContain("Deal & Partnership Structuring");
    expect(catalog).toContain(
      "Blockchain, Tokenization & Payment Infrastructure",
    );
    expect(catalog).toContain("Growth Strategy & Fractional Execution");
    expect(catalog).toContain('href: "/impactsoul"');
    expect(catalog).toContain('eyebrow: "A separate RampRate brand"');
    expect(hub).toContain("impactSolService");
  });

  it("uses clearly labelled existing case proof instead of fabricated testimonials", async () => {
    const page = await readFile(
      resolve(process.cwd(), "src/components/services/ServicePage.tsx"),
      "utf8",
    );

    expect(page).toContain("Case proof");
    expect(page).toContain("Existing RampRate case record");
    expect(page).not.toContain("testimonial");
  });
});
