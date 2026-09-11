// @vitest-environment jsdom

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { render } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: ReactNode }) =>
    createElement("a", props, children),
}));

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const imageProps = { ...props };
    delete imageProps.fill;
    delete imageProps.priority;
    return createElement("img", imageProps);
  },
}));

vi.mock("next/dynamic", () => ({
  default: () => () => null,
}));

vi.mock("@/components/home/PracticeIcon", () => ({
  default: () => createElement("span", { "data-testid": "practice-icon" }),
}));

import HomeContent from "../../src/components/home/HomeContent";

describe("home visual contract", () => {
  it("uses the single-action hero and the shared editorial section system", () => {
    const { container } = render(<HomeContent />);
    const hero = container.querySelector("section.home-blue-hero");

    expect(hero).not.toBeNull();
    expect(
      hero?.querySelector('img[src="/hero.webp"]')?.getAttribute("alt"),
    ).toBe("Technology advisory team collaborating in a modern office");
    expect(hero?.querySelector('a[href="/proof"]')?.textContent).toMatch(
      /see case results/i,
    );
    expect(hero?.querySelector('a[href="/contact"]')).toBeNull();

    [
      "home-proof-section",
      "home-practices-section",
      "home-difference-section",
      "home-timeline-section",
      "home-testimonials-section",
      "home-operate-section",
      "home-compensation-section",
      "home-final-cta",
    ].forEach((className) => {
      expect(container.querySelector(`.${className}`)).not.toBeNull();
    });
  });

  it("keeps the current live-reference navy surfaces and restrained gold accents scoped to the homepage", async () => {
    const css = await readFile(
      resolve(process.cwd(), "src/app/globals.css"),
      "utf8",
    );

    expect(css).toContain(
      "/* ── HOMEPAGE: CURRENT LIVE RAMP RATE REFERENCE ──",
    );
    expect(css).toContain("--dark: #050b14;");
    expect(css).toContain("--dark-mid: #071221;");
    expect(css).toContain("--gold: #d6ad42;");
    expect(css).toContain(".home-proof-card {");
    expect(css).toContain(
      "background: linear-gradient(145deg, #0f1725, #0d1624)",
    );
    expect(css).toContain(".home-client-wall,");
  });
});
