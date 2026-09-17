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
    delete imageProps.unoptimized;
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
  it("uses a high-legibility hero with direct booking and case-study actions", () => {
    const { container } = render(<HomeContent />);
    const hero = container.querySelector("section.home-blue-hero");

    expect(hero).not.toBeNull();
    expect(
      hero?.querySelector('img[src="/hero.webp"]')?.getAttribute("alt"),
    ).toBe("Technology advisory team collaborating in a modern office");
    expect(hero?.textContent).toMatch(
      /make complex technology decisions pay off/i,
    );
    expect(hero?.querySelector('a[href="/contact"]')?.textContent).toMatch(
      /book a call/i,
    );
    expect(hero?.querySelector('a[href="/proof"]')?.textContent).toMatch(
      /view case studies/i,
    );
    expect(hero?.textContent).not.toMatch(/tell us what'?s broken/i);

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

  it("uses plain-language services while retaining verified evidence and a separate ImpactSol handoff", () => {
    const { container } = render(<HomeContent />);

    expect(container.textContent).toContain(
      "Relationship & Specialist Sourcing",
    );
    expect(container.textContent).toContain("Deal & Partnership Structuring");
    expect(container.textContent).toContain(
      "Blockchain, Tokenization & Payment Infrastructure",
    );
    expect(container.textContent).toContain(
      "Growth Strategy & Fractional Execution",
    );
    expect(container.textContent).toContain("A separate RampRate brand");
    expect(container.textContent).toContain("$50M in savings");
    expect(container.textContent).toContain("Paramount");
    expect(container.textContent).toContain("NOIA");
    expect(
      container
        .querySelector(
          'img[src="/manus-storage/paramount-editorial_6bc75d56.jpg"]',
        )
        ?.getAttribute("alt"),
    ).toBe("Editorial representation of high-stakes broadcast infrastructure");
    expect(
      container
        .querySelector('img[src="/manus-storage/ebay-editorial_2f4aaef4.jpg"]')
        ?.getAttribute("alt"),
    ).toBe("Editorial representation of enterprise data-center operations");
    expect(
      container
        .querySelector('img[src="/manus-storage/noia-editorial_7fa1f45a.jpg"]')
        ?.getAttribute("alt"),
    ).toBe("Editorial representation of decentralized network infrastructure");
    expect(
      container.querySelector(
        'a[href="/services/deal-partnership-structuring"]',
      ),
    ).not.toBeNull();
    expect(container.querySelector('a[href="/impactsoul"]')).not.toBeNull();
    expect(container.textContent).toContain("Data in the room.");
    expect(container.textContent).toContain("Principals at the table.");
    expect(container.textContent).toContain(
      "Benchmarks real contracts against 150K+ data points",
    );
    expect(container.textContent).toContain(
      "Compensation aligned to value created",
    );
  });

  it("keeps the unified midnight-navy system and restrained gold emphasis", async () => {
    const css = await readFile(
      resolve(process.cwd(), "src/app/globals.css"),
      "utf8",
    );

    expect(css).toContain("--rr-navy: #050b14;");
    expect(css).toContain("--rr-navy-mid: #071221;");
    expect(css).toContain("--gold: #d6ad42;");
    expect(css).toContain(".rr-public-surface {");
    expect(css).toContain(".home-proof-card {");
    expect(css).toContain(
      "background: linear-gradient(145deg, #0f1725, #0d1624)",
    );
    expect(css).toContain(".home-client-wall,");
  });
});
