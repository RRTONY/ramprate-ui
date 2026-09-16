import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Process public-system alignment", () => {
  it("keeps both specialist process journeys in the shared visual system with approved contact language", async () => {
    const [processPage, sourcingProcessPage, styles] = await Promise.all([
      readFile(resolve(process.cwd(), "src/app/process/page.tsx"), "utf8"),
      readFile(
        resolve(process.cwd(), "src/app/sourcing/process/page.tsx"),
        "utf8",
      ),
      readFile(resolve(process.cwd(), "src/app/globals.css"), "utf8"),
    ]);

    for (const page of [processPage, sourcingProcessPage]) {
      expect(page).toContain('<main className="rr-process-surface">');
      expect(page).toContain('className="rr-process-cta rr-public-cta');
      expect(page).toContain("Start with a clearer next move.");
      expect(page).toContain("Book a Call");
      expect(page).not.toContain("Tell Us What&apos;s Broken");
    }

    expect(styles).toContain(".rr-process-surface {");
    expect(styles).toContain(".rr-process-cta > .absolute {");
    expect(styles).toContain(
      "@media (prefers-reduced-motion: no-preference) {",
    );
  });
});
