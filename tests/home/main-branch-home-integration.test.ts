import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (path: string) => resolve(process.cwd(), path);

describe("main branch homepage integration", () => {
  it("uses the valid process route and icon-based operation links", async () => {
    const source = await readFile(
      projectFile("src/components/home/HomeContent.tsx"),
      "utf8",
    );

    expect(source).toContain(
      'link: { label: "Our Process", href: "/process" }',
    );
    expect(source).not.toContain('href: "/our-process"');
    expect(source).toContain("<ArrowRight size={12} />");
  });

  it("uses an accessible arrow-controlled timeline on desktop and a readable mobile fallback", async () => {
    const [home, timeline] = await Promise.all([
      readFile(projectFile("src/components/home/HomeContent.tsx"), "utf8"),
      readFile(projectFile("src/components/home/Timeline.tsx"), "utf8"),
    ]);

    expect(home).toContain(
      'const Timeline = dynamic(() => import("./Timeline"));',
    );
    expect(home).toContain("<Timeline timeline={timeline} />");
    expect(timeline).toContain('aria-label="Scroll timeline left"');
    expect(timeline).toContain('aria-label="Scroll timeline right"');
    expect(timeline).toContain('className="space-y-0 md:hidden"');
    expect(timeline).toContain("scrollBy({");
  });
});
