import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("shared marketing call-to-action system", () => {
  it("uses the shared navy-and-gold treatment and approved contact fallback", async () => {
    const [cta, styles] = await Promise.all([
      readFile(
        resolve(process.cwd(), "src/components/sections/CtaSection.tsx"),
        "utf8",
      ),
      readFile(resolve(process.cwd(), "src/app/globals.css"), "utf8"),
    ]);

    expect(cta).toContain("rr-shared-cta rr-public-cta");
    expect(cta).toContain('href="/contact"');
    expect(cta).toContain("Book a Call");
    expect(cta).not.toContain("bg-rust");
    expect(cta).not.toContain("text-rust");
    expect(styles).toContain(".rr-shared-cta {");
    expect(styles).toContain(
      "@media (prefers-reduced-motion: no-preference) {",
    );
  });
});
