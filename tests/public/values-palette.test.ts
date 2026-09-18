import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("Values public palette", () => {
  it("uses the shared navy and gold tokens instead of residual rust or blue accent hues", async () => {
    const source = await readFile(
      new URL("../../src/app/values/page.tsx", import.meta.url),
      "utf8",
    );

    expect(source).toContain('background: "var(--rr-navy-mid)"');
    expect(source).toContain('color: "var(--rr-gold-deep)"');
    expect(source).toContain('background: "var(--gold)"');
    expect(source).not.toContain("oklch(0.55 0.15 30)");
    expect(source).not.toContain("oklch(0.55 0.22 260)");
    expect(source).toContain("Powering");
    expect(source).toContain("Core Values");
    expect(source).toContain("Start a Conversation");
  });
});
