import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Thinking archive transition", () => {
  it("consolidates the legacy archive into the About journey without affecting article routes", async () => {
    const [thinking, about] = await Promise.all([
      readFile(resolve(process.cwd(), "src/app/thinking/page.tsx"), "utf8"),
      readFile(resolve(process.cwd(), "src/app/about/page.tsx"), "utf8"),
    ]);

    expect(thinking).toContain('permanentRedirect("/about#journey")');
    expect(about).toContain('id="journey"');
  });
});
