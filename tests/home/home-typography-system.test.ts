import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("homepage typography and accent system", () => {
  it("uses the shared display/body roles and a controlled navy-gold visual hierarchy", async () => {
    const [home, styles] = await Promise.all([
      readFile(
        resolve(process.cwd(), "src/components/home/HomeContent.tsx"),
        "utf8",
      ),
      readFile(resolve(process.cwd(), "src/app/globals.css"), "utf8"),
    ]);

    expect(home).toContain('className="home-blue-title max-w-3xl font-display');
    expect(home).toContain('className="home-blue-summary font-body mt-7');
    expect(home).not.toContain('accentClass: "bg-[#7260c7]"');
    expect(home).not.toContain('accentClass: "bg-emerald-500"');
    expect(home).not.toContain('className="home-final-cta font-body');
    expect(home).toContain('className="home-final-cta rr-public-cta');
    expect(styles).toContain(
      ".rr-kicker {\n  color: var(--gold);\n  font-family: var(--font-body);",
    );
    expect(styles).toContain("rgb(3 9 20 / 0.93) 0%");
    expect(styles).not.toContain(
      ".home-blue .glass-orb-pink {\n  background: #7260c7;",
    );
  });
});
