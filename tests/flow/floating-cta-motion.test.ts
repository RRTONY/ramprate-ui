import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Floating CTA CSS motion migration", () => {
  it("uses scoped reduced-motion-safe CSS instead of Framer Motion", async () => {
    const [component, css] = await Promise.all([
      readFile(
        resolve(process.cwd(), "src/components/flow/FloatingCTA.tsx"),
        "utf8",
      ),
      readFile(resolve(process.cwd(), "src/app/globals.css"), "utf8"),
    ]);

    expect(component).not.toContain("framer-motion");
    expect(component).toContain("flow-floating-cta-enter");
    expect(component).toContain("flow-floating-cta-swap");
    expect(component).toContain("setDismissed(true)");
    expect(component).toContain("handleJoinTeam");

    expect(css).toContain("@keyframes flow-floating-cta-enter");
    expect(css).toContain("@keyframes flow-floating-cta-swap");
    expect(css).toContain("@media (prefers-reduced-motion: no-preference)");
  });
});
