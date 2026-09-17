import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("Flow Alignment Results presentation styles", () => {
  it("uses semantic text-wrap utilities instead of fixed JSX inline styles", async () => {
    const source = await readFile(
      new URL(
        "../../src/app/flow/results/AlignmentResultsClient.tsx",
        import.meta.url,
      ),
      "utf8",
    );

    expect(source).not.toContain('textWrap: "pretty"');
    expect(source).not.toContain('textWrap: "balance"');
    expect(source).toContain("text-pretty");
    expect(source).toContain("text-balance");
    expect(source).toContain("<ThreeSixtyLinkGenerator");
    expect(source).toContain('router.push("/flow/deep-calibration")');
    expect(source).toContain("<ShareableCard");
    expect(source).toContain("<ResearchOptIn");
  });
});
