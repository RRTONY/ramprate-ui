import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("global error presentation", () => {
  it("uses self-contained semantic classes without fixed JSX inline styles", async () => {
    const source = await readFile(
      new URL("../../src/app/global-error.tsx", import.meta.url),
      "utf8",
    );

    expect(source).not.toContain("style={{");
    expect(source).toContain("rr-global-error-shell");
    expect(source).toContain("rr-global-error-retry");
    expect(source).toContain('role="alert"');
    expect(source).toContain('aria-live="assertive"');
    expect(source).toContain("Try Again");
  });
});
