// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/lib/site-pages", () => ({
  matchSitePages: () => [],
}));

import SiteSearch from "../../src/components/shared/SiteSearch";

describe("Ask RampRate AI header trigger", () => {
  it("keeps the mobile AI trigger standalone instead of applying a bare circular container", () => {
    const { getByRole } = render(<SiteSearch />);
    const trigger = getByRole("button", { name: "Ask RampRate AI" });

    expect(trigger.className).toContain("sm:rounded-full");
    expect(trigger.className).not.toMatch(/(^|\s)rounded-full(\s|$)/);
    expect(trigger.className).toContain("p-2.5");
  });
});
