import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("Process public presentation", () => {
  it("uses shared semantic helpers for converted static presentation while retaining route behavior", async () => {
    const source = await readFile(
      new URL("../../src/app/process/page.tsx", import.meta.url),
      "utf8",
    );

    const semanticHelpers = [
      "rr-process-anchor",
      "rr-process-booking",
      "rr-process-callout",
      "rr-process-circuit-heading",
      "rr-process-cta",
      "rr-process-cta-surface",
      "rr-process-divider-dot",
      "rr-process-economics",
      "rr-process-friction-copy",
      "rr-process-guarantee",
      "rr-process-guarantee-copy",
      "rr-process-hero",
      "rr-process-highlight",
      "rr-process-icon-blue",
      "rr-process-icon-gold",
      "rr-process-icon-green",
      "rr-process-kicker",
      "rr-process-map-connector",
      "rr-process-map-label",
      "rr-process-map-node",
      "rr-process-phase-copy",
      "rr-process-phase-icon",
      "rr-process-phase-icon--blue",
      "rr-process-phase-icon--gold",
      "rr-process-phase-icon--green",
      "rr-process-phase-index",
      "rr-process-phase-index--blue",
      "rr-process-phase-index--green",
      "rr-process-role-label",
      "rr-process-role-sub",
      "rr-process-stat",
      "rr-process-surface",
    ];

    for (const helper of semanticHelpers) {
      expect(source).toContain(helper);
    }

    expect(source).toContain('href="#find-me"');
    expect(source).toContain('href="#find-way"');
    expect(source).toContain('href="#find-our"');
    expect(source).toContain("Book a Call");
    expect(source).toContain("backgroundColor: item.color");
    expect(source).toContain(
      "backgroundColor: `color-mix(in oklch, ${role.color}",
    );
    expect(source).toContain("role.color");
    expect(source).toContain("Sign & Execute");
    expect(source).toContain("90-Day Checkpoint");
    expect(source).not.toContain('fontFamily: "var(--font-');
    expect(source).not.toContain('background: "oklch(');
    expect(source).not.toContain('color: "oklch(');
  });
});
