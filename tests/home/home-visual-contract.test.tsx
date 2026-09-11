// @vitest-environment jsdom

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
});
