// @vitest-environment jsdom

import { fireEvent, render, waitFor } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: ReactNode }) =>
    createElement("a", props, children),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("@/components/shared/Logo", () => ({
  default: () => createElement("span", null, "RampRate"),
}));

vi.mock("@/components/shared/SiteSearch", () => ({
  default: () => createElement("button", null, "Ask RampRate"),
}));

vi.mock("@/components/shared/HeaderSearch", () => ({
  default: () => createElement("button", null, "Search"),
}));

import Header from "../../src/components/layout/Header";

describe("marketing header scroll state", () => {
  afterEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });

  it("starts transparent over the home hero and becomes an opaque white surface after scrolling", async () => {
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    const { container } = render(createElement(Header));
    const navigation = container.querySelector("nav");

    expect(navigation?.className).toContain("bg-transparent");

    Object.defineProperty(window, "scrollY", { value: 96, configurable: true });
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(navigation?.className).toContain("bg-white");
      expect(navigation?.className).not.toContain("bg-white/");
      expect(navigation?.className).toContain("shadow-md");
    });
  });
});
