import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Attorney portal presentation", () => {
  it("uses shared typography utilities for fixed presentation without changing the protected access boundary", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/app/attorney/page.tsx"),
      "utf8",
    );

    expect(source).toContain('isPortalUnlocked("attorney")');
    expect(source).toContain('<PortalGate portalId="attorney" />');
    expect(source).toContain("font-body");
    expect(source).toContain("font-display");
    expect(source).toContain("border-collapse");
    expect(source).not.toContain("fontFamily:");
    expect(source).not.toContain("style={{");
  });
});
