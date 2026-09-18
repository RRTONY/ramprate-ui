import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("Attorney RFI public typography", () => {
  it("uses shared public fonts for the converted hero and interactive choice controls", async () => {
    const source = await readFile(
      new URL("../../src/app/attorney-rfi/page.tsx", import.meta.url),
      "utf8",
    );

    const hero = source.slice(
      source.indexOf("{/* ═══ HERO ═══ */}"),
      source.indexOf("{/* ═══ FORM + SIDEBAR ═══ */}"),
    );
    const practiceControls = source.slice(
      source.indexOf("{/* Practice Areas */}"),
      source.indexOf("{/* Entrepreneur Experience */}"),
    );

    expect(hero).toContain("font-display");
    expect(hero).toContain("font-body");
    expect(hero).not.toContain("fontFamily:");

    expect(practiceControls).toContain("font-body");
    expect(practiceControls).not.toContain("fontFamily:");
    expect(practiceControls).toContain("togglePracticeArea");
    expect(practiceControls).toContain("selectedPracticeAreas.includes");

    expect(source).toContain("handleSubmit");
    expect(source).toContain("toggleInterest");
    expect(source).toContain('name="attorney-rfi"');
    expect(source).toContain("Application Received");
    expect(source).toContain("Why Partner With RampRate");
    expect(source).not.toContain('fontFamily: "var(--font-display)"');
  });
});
