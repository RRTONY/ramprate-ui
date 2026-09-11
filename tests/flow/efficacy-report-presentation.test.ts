import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Efficacy Report presentation utilities", () => {
  it("uses a utility class for the static ideal distribution marker", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/app/flow/efficacy/EfficacyReportClient.tsx"),
      "utf8",
    );

    expect(source).toContain("absolute top-0 left-1/5 h-full w-px bg-white/40");
    expect(source).not.toContain('style={{ left: "20%" }}');
    expect(source).toContain("width: `${parseFloat(pct)}%`");
    expect(source).toContain("backgroundColor: colors[role]");
  });
});
