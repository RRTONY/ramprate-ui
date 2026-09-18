import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Public testimonial typography", () => {
  it("uses the shared display token rather than a legacy component-specific font", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/components/sections/TestimonialGrid.tsx"),
      "utf8",
    );

    expect(source).toContain("font-display text-5xl");
    expect(source).not.toContain("Georgia, serif");
  });
});
