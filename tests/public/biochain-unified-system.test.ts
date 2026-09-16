import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("BioChain unified public system", () => {
  it("keeps specialist process and intake pages in the shared visual system with approved conversion language", async () => {
    const [processPage, cataloguePage, supplierPage, styles] =
      await Promise.all([
        readFile(
          resolve(process.cwd(), "src/app/biochain/process/page.tsx"),
          "utf8",
        ),
        readFile(
          resolve(process.cwd(), "src/app/biochain/catalogue/page.tsx"),
          "utf8",
        ),
        readFile(
          resolve(process.cwd(), "src/app/biochain/supplier-intake/page.tsx"),
          "utf8",
        ),
        readFile(resolve(process.cwd(), "src/app/globals.css"), "utf8"),
      ]);

    for (const page of [processPage, cataloguePage, supplierPage]) {
      expect(page).toContain('<main className="rr-biochain-surface">');
    }

    expect(processPage).toContain("Start with a clearer next move.");
    expect(processPage).toContain("Book a Call");
    expect(processPage).not.toContain("Tell Us What&apos;s Broken");
    expect(cataloguePage).toContain("<ClientIntakeForm />");
    expect(supplierPage).toContain("<SupplierIntakeStage1Form />");
    expect(styles).toContain(".rr-biochain-surface {");
    expect(styles).toContain(".rr-biochain-cta > .absolute {");
    expect(styles).toContain(
      "@media (prefers-reduced-motion: no-preference) {",
    );
  });
});
