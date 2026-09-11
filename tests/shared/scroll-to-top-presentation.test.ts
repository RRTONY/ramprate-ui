import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (path: string) => resolve(process.cwd(), path);

describe("Scroll to Top presentation", () => {
  it("uses a shared reduced-motion-aware animation class instead of component inline styles", async () => {
    const [source, css] = await Promise.all([
      readFile(projectFile("src/components/shared/ScrollToTop.tsx"), "utf8"),
      readFile(projectFile("src/app/globals.css"), "utf8"),
    ]);

    expect(source).toContain("scroll-to-top-float");
    expect(source).not.toContain("style={{");
    expect(source).not.toContain("@keyframes float");
    expect(css).toContain("@keyframes scroll-to-top-float");
    expect(css).toContain(".scroll-to-top-float {");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
