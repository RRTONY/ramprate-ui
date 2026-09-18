import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("cinematic homepage hero media", () => {
  it("uses muted looping video only when reduced motion is not requested and retains a static fallback", async () => {
    const [media, home, css] = await Promise.all([
      readFile(
        resolve(process.cwd(), "src/components/home/CinematicHeroMedia.tsx"),
        "utf8",
      ),
      readFile(
        resolve(process.cwd(), "src/components/home/HomeContent.tsx"),
        "utf8",
      ),
      readFile(resolve(process.cwd(), "src/app/globals.css"), "utf8"),
    ]);

    expect(home).toContain("<CinematicHeroMedia />");
    expect(media).toContain('matchMedia("(prefers-reduced-motion: reduce)")');
    expect(media).toContain("autoPlay");
    expect(media).toContain("muted");
    expect(media).toContain("loop");
    expect(media).toContain("VFawfsbNshYpRmcd.png");
    expect(media).toContain("illuminated modern office at sunset");
    expect(media).toContain("ramprate-cinematic-hero-loop_9982d784.mp4");
    expect(css).toContain("rr-cinematic-hero-scroll");
    expect(css).toContain("animation-timeline: scroll(root)");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain(".home-blue-certification");
  });
});
