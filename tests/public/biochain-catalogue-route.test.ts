import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("BioChain catalogue route parity", () => {
  it("serves the live client intake on the catalogue path and retains a buyer-intake compatibility redirect", async () => {
    const [catalogueSource, buyerSource] = await Promise.all([
      readFile(
        resolve(process.cwd(), "src/app/biochain/catalogue/page.tsx"),
        "utf8",
      ),
      readFile(
        resolve(process.cwd(), "src/app/biochain/buyer-intake/page.tsx"),
        "utf8",
      ),
    ]);

    expect(catalogueSource).toContain('canonical: "/biochain/catalogue"');
    expect(catalogueSource).toContain("ClientIntakeForm");
    expect(catalogueSource).not.toContain("PRODUCT_CATEGORIES");
    expect(buyerSource).toContain('permanentRedirect("/biochain/catalogue")');
  });
});
