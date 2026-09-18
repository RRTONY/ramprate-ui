// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: ReactNode }) =>
    createElement("a", props, children),
}));

let mockedPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => mockedPathname,
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
    cleanup();
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    mockedPathname = "/";
  });

  it("starts transparent over the home hero and becomes an opaque white surface after scrolling", async () => {
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    const { container } = render(createElement(Header));
    const navigation = container.querySelector("nav");

    expect(navigation?.className).toContain("rr-public-header");
    expect(navigation?.className).not.toContain("is-scrolled");
    expect(screen.queryByText("Tell Us What's Broken")).toBeNull();
    expect(screen.queryByText("Process")).toBeNull();

    fireEvent.mouseEnter(screen.getByRole("button", { name: /services/i }));
    expect(screen.getByText("Deal & Partnership Structuring")).toBeTruthy();
    expect(screen.getByText("Torque")).toBeTruthy();
    expect(screen.getByText("Syzygy")).toBeTruthy();
    expect(screen.queryByText("Private Advisory")).toBeNull();

    Object.defineProperty(window, "scrollY", { value: 1, configurable: true });
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(navigation?.className).toContain("is-scrolled");
    });
  });

  it("starts opaque on the light Kumbaya hero so navigation remains readable", () => {
    mockedPathname = "/kumbaya";
    const { container } = render(createElement(Header));

    expect(container.querySelector("nav")?.className).toContain("is-scrolled");
    expect(
      screen.getByRole("button", { name: /services/i }).className,
    ).toContain("text-[#152337]");
  });
});
