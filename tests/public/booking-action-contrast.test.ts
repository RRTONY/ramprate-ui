import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Public booking-action contrast", () => {
  it("uses a shared readable navy foreground for gold booking actions across every public Book a Call variant", async () => {
    const [styles, ...variants] = await Promise.all([
      readFile(resolve(process.cwd(), "src/app/globals.css"), "utf8"),
      readFile(
        resolve(process.cwd(), "src/components/home/HomeContent.tsx"),
        "utf8",
      ),
      readFile(resolve(process.cwd(), "src/app/services/page.tsx"), "utf8"),
      readFile(
        resolve(process.cwd(), "src/components/services/ServicePage.tsx"),
        "utf8",
      ),
      readFile(resolve(process.cwd(), "src/app/about/page.tsx"), "utf8"),
      readFile(
        resolve(process.cwd(), "src/app/biochain/process/page.tsx"),
        "utf8",
      ),
      readFile(resolve(process.cwd(), "src/app/contact/page.tsx"), "utf8"),
      readFile(resolve(process.cwd(), "src/app/howwework/page.tsx"), "utf8"),
      readFile(resolve(process.cwd(), "src/app/process/page.tsx"), "utf8"),
      readFile(
        resolve(process.cwd(), "src/app/sourcing/process/page.tsx"),
        "utf8",
      ),
      readFile(
        resolve(process.cwd(), "src/components/layout/Footer.tsx"),
        "utf8",
      ),
      readFile(
        resolve(process.cwd(), "src/components/layout/Header.tsx"),
        "utf8",
      ),
      readFile(
        resolve(process.cwd(), "src/components/sections/CtaSection.tsx"),
        "utf8",
      ),
      readFile(
        resolve(process.cwd(), "src/components/sections/Hero.tsx"),
        "utf8",
      ),
    ]);

    expect(styles).toContain('a[href^="/contact"].bg-gold');
    expect(styles).toContain("color: var(--rr-navy) !important");

    for (const source of variants) {
      expect(source).toContain("Book a Call");
      expect(source).not.toMatch(
        /bg-gold[^"`]*text-white|text-white[^"`]*bg-gold/,
      );
    }
  });
});
