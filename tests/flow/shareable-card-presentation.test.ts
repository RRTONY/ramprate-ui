import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Shareable Card presentation utilities", () => {
  it("uses a utility class for the static canvas aspect ratio", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/components/flow/ShareableCard.tsx"),
      "utf8",
    );

    expect(source).toContain('className="aspect-[1200/630] h-auto w-full"');
    expect(source).not.toContain('style={{ aspectRatio: "1200/630" }}');
  });
});
