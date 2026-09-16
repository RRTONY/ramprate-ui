import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("legacy branded-practice compatibility routes", () => {
  it("permanently redirects Growth and Web3 routes to the plain-language Services architecture", async () => {
    const [growth, web3] = await Promise.all([
      readFile(resolve(process.cwd(), "src/app/growth/page.tsx"), "utf8"),
      readFile(resolve(process.cwd(), "src/app/web3/page.tsx"), "utf8"),
    ]);

    expect(growth).toContain(
      'permanentRedirect("/services/growth-strategy-fractional-execution")',
    );
    expect(web3).toContain(
      'permanentRedirect("/services/blockchain-tokenization-payment-infrastructure")',
    );
    expect(growth).not.toContain("Syzygy");
    expect(web3).not.toContain("Stratum");
  });
});
