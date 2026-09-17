import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const heroSource = fs.readFileSync(
  path.join(process.cwd(), "src/components/sections/Hero.tsx"),
  "utf8",
);
const stylesSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/globals.css"),
  "utf8",
);

describe("shared public Hero fallback", () => {
  it("uses semantic CSS layers instead of fixed JSX style objects", () => {
    expect(heroSource).toContain("rr-hero-fallback-glow");
    expect(heroSource).toContain("rr-hero-left-overlay");
    expect(heroSource).toContain("rr-hero-bottom-overlay");
    expect(heroSource).not.toContain("style={{");
    expect(stylesSource).toContain(".rr-hero-fallback-glow");
    expect(stylesSource).toContain(".rr-hero-left-overlay");
    expect(stylesSource).toContain(".rr-hero-bottom-overlay");
  });

  it("uses approved Service discovery and Book a Call fallback actions", () => {
    expect(heroSource).toContain('href="/services"');
    expect(heroSource).toContain("Explore Services");
    expect(heroSource).toContain("Book a Call");
    expect(heroSource).not.toContain('href="/expertise"');
    expect(heroSource).not.toContain("Start a Conversation");
  });
});
