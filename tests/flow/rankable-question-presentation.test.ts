import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Rankable Question presentation utilities", () => {
  it("keeps static touch-control presentation rules out of inline style props", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/components/flow/RankableQuestion.tsx"),
      "utf8",
    );

    expect(source).toContain("relative z-10");
    expect(source).toContain("touch-manipulation");
    expect(source).toContain("[-webkit-tap-highlight-color:transparent]");
    expect(source).not.toContain("WebkitTapHighlightColor");
    expect(source).not.toContain('touchAction: "manipulation"');
    expect(source).not.toContain("style={{ zIndex: 10 }}");
  });
});
