import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (path: string) => resolve(process.cwd(), path);

describe("Family Dynamic presentation", () => {
  it("uses utilities and scoped CSS for fixed map framing while retaining calculated node behavior", async () => {
    const [source, css] = await Promise.all([
      readFile(
        projectFile("src/app/flow/family/FamilyDynamicClient.tsx"),
        "utf8",
      ),
      readFile(projectFile("src/app/globals.css"), "utf8"),
    ]);

    expect(source).toContain("aspect-[5/4] max-h-[480px]");
    expect(source).toContain("family-energy-map-grid");
    expect(source).not.toContain('aspectRatio: "5/4"');
    expect(css).toContain(".family-energy-map-grid {");
    expect(css).toContain("background-size: 50px 50px;");
    expect(source).toContain("backgroundColor: member.colorHex");
    expect(source).toContain("left: isFixed");
  });
});
