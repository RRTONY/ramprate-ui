import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Payments Advisory unified public system", () => {
  it("keeps overview, intake, and intelligence routes in the shared surface while preserving specialist components", async () => {
    const [overview, intake, intelligence, grid, styles] = await Promise.all([
      readFile(
        resolve(process.cwd(), "src/app/payments-advisory/page.tsx"),
        "utf8",
      ),
      readFile(
        resolve(process.cwd(), "src/app/payments-advisory/intake/page.tsx"),
        "utf8",
      ),
      readFile(
        resolve(process.cwd(), "src/app/payments-advisory/intel/page.tsx"),
        "utf8",
      ),
      readFile(
        resolve(process.cwd(), "src/components/payments/IndustryGrid.tsx"),
        "utf8",
      ),
      readFile(resolve(process.cwd(), "src/app/globals.css"), "utf8"),
    ]);

    for (const page of [overview, intake, intelligence]) {
      expect(page).toContain('<main className="rr-payments-surface">');
    }

    expect(overview).toContain("ImpactSol Integration");
    expect(overview).not.toContain("ImpactSoul");
    expect(intake).toContain("<PaymentsIntakeForm />");
    expect(intelligence).toContain("<IndustryGrid />");
    expect(grid).toContain("rr-payments-industry-card");
    expect(styles).toContain(".rr-payments-surface {");
    expect(styles).toContain(".rr-payments-industry-card:hover {");
    expect(styles).toContain(
      "@media (prefers-reduced-motion: no-preference) {",
    );
  });
});
