import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readSource = (path: string) =>
  readFile(resolve(process.cwd(), path), "utf8");

describe("Legacy service identities", () => {
  it("shows Torque and Syzygy alongside canonical plain-language Services without changing their compatibility routes", async () => {
    const [catalog, servicesIndex, servicePage, torque, growth] =
      await Promise.all([
        readSource("src/lib/service-catalog.ts"),
        readSource("src/app/services/page.tsx"),
        readSource("src/components/services/ServicePage.tsx"),
        readSource("src/app/torque/page.tsx"),
        readSource("src/app/growth/page.tsx"),
      ]);

    expect(catalog).toContain('slug: "relationship-specialist-sourcing"');
    expect(catalog).toContain('name: "Torque"');
    expect(catalog).toContain('name: "Syzygy"');
    expect(catalog).toContain('title: "Deal & Partnership Structuring"');
    expect(catalog).toContain(
      'title: "Growth Strategy & Fractional Execution"',
    );
    expect(servicesIndex).toContain("service.legacyIdentity.name");
    expect(servicePage).toContain("service.legacyIdentity.description");
    expect(torque).toContain(
      'permanentRedirect("/services/relationship-specialist-sourcing")',
    );
    expect(growth).toContain(
      'permanentRedirect("/services/growth-strategy-fractional-execution")',
    );
  });
});
