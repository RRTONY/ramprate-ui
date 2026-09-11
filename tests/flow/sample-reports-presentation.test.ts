import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Sample Reports presentation utilities", () => {
  it("keeps static report surface colors in Tailwind classes", async () => {
    const source = await readFile(
      resolve(
        process.cwd(),
        "src/app/flow/sample-reports/SampleReportsClient.tsx",
      ),
      "utf8",
    );

    expect(source).toContain("bg-[#faf6f0]");
    expect(source).toContain("bg-[#fbf8f3]");
    expect(source).toContain("bg-[#f9f7fc]");
    expect(source).not.toContain('style={{ backgroundColor: "#FAF6F0" }}');
    expect(source).not.toContain('style={{ backgroundColor: "#FBF8F3" }}');
    expect(source).not.toContain('style={{ backgroundColor: "#F9F7FC" }}');
    expect(source).toContain("backgroundColor: pair.badgeColor");
    expect(source).toContain("backgroundColor: color");
  });
});
