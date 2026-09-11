import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (path: string) => resolve(process.cwd(), path);

describe("shared Logo presentation", () => {
  it("uses fixed Tailwind size variants instead of inline width and height styling", async () => {
    const source = await readFile(
      projectFile("src/components/shared/Logo.tsx"),
      "utf8",
    );

    expect(source).toContain("const sizeClasses = {");
    expect(source).toContain('sm: "w-[88px] max-h-7"');
    expect(source).toContain('md: "w-[112px] max-h-9"');
    expect(source).toContain('lg: "w-[152px] max-h-12"');
    expect(source).toContain("sizeClasses[size]");
    expect(source).not.toContain("style={{ width, maxHeight: height }}");
  });
});
