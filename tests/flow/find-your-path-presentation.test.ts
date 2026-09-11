import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (path: string) => resolve(process.cwd(), path);

describe("Find Your Path presentation", () => {
  it("moves fixed hero decoration and compass timing from inline styles while retaining portal-specific rendering", async () => {
    const [source, css] = await Promise.all([
      readFile(
        projectFile("src/app/flow/find-your-path/FindYourPathClient.tsx"),
        "utf8",
      ),
      readFile(projectFile("src/app/globals.css"), "utf8"),
    ]);

    expect(source).toContain("find-your-path-geometry");
    expect(source).toContain("animate-[spin_8s_linear_infinite]");
    expect(source).not.toContain('animationDuration: "8s"');
    expect(source).not.toContain('backgroundImage: `url("data:image/svg+xml');
    expect(css).toContain(".find-your-path-geometry {");
    expect(css).toContain("width='60' height='60'");
    expect(source).toContain("backgroundColor: `${portal.color}25`");
    expect(source).toContain("backgroundColor: portal.color");
  });
});
