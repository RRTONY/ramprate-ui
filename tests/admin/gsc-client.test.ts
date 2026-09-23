import { describe, expect, it } from "vitest";
import {
  mergeComparison,
  performanceDateRange,
  resolveSiteUrl,
  type GscSite,
} from "@/lib/admin/gsc-client";

const sites: GscSite[] = [
  { siteUrl: "sc-domain:ramprate.com", permissionLevel: "siteFullUser" },
  { siteUrl: "https://tonygreenberg.com/", permissionLevel: "siteOwner" },
];

describe("resolveSiteUrl", () => {
  it("defaults to ramprate.com's domain property", () => {
    expect(resolveSiteUrl(undefined, sites)).toBe("sc-domain:ramprate.com");
    expect(resolveSiteUrl("  ", sites)).toBe("sc-domain:ramprate.com");
  });

  it("passes an exact property name through", () => {
    expect(resolveSiteUrl("https://tonygreenberg.com/", sites)).toBe(
      "https://tonygreenberg.com/",
    );
  });

  it("maps bare domains, www and full URLs onto the visible property", () => {
    expect(resolveSiteUrl("www.ramprate.com", sites)).toBe(
      "sc-domain:ramprate.com",
    );
    expect(resolveSiteUrl("https://ramprate.com/sourcing", sites)).toBe(
      "sc-domain:ramprate.com",
    );
    expect(resolveSiteUrl("tonygreenberg.com", sites)).toBe(
      "https://tonygreenberg.com/",
    );
  });

  it("explains how to fix a property the service account can't see", () => {
    expect(() => resolveSiteUrl("example.com", sites)).toThrow(
      /No Search Console property for "example.com"/,
    );
  });
});

describe("performanceDateRange", () => {
  const today = new Date("2026-09-24T12:00:00Z");

  it("defaults to 28 days ending 3 days ago, with an equal previous period", () => {
    expect(performanceDateRange({}, today)).toEqual({
      startDate: "2026-08-25",
      endDate: "2026-09-21",
      previous: { startDate: "2026-07-28", endDate: "2026-08-24" },
    });
  });

  it("honours an explicit range", () => {
    const r = performanceDateRange(
      { startDate: "2026-09-01", endDate: "2026-09-07" },
      today,
    );
    expect(r.previous).toEqual({
      startDate: "2026-08-25",
      endDate: "2026-08-31",
    });
  });
});

describe("mergeComparison", () => {
  it("adds per-row change, positive position change = ranking improved", () => {
    const current = [
      {
        keys: { query: "it sourcing" },
        clicks: 30,
        impressions: 900,
        ctr: 3.33,
        position: 4.2,
      },
      {
        keys: { query: "new query" },
        clicks: 5,
        impressions: 50,
        ctr: 10,
        position: 8,
      },
    ];
    const previous = [
      {
        keys: { query: "it sourcing" },
        clicks: 20,
        impressions: 1000,
        ctr: 2,
        position: 6.5,
      },
    ];
    const merged = mergeComparison(current, previous);
    expect(merged[0].change).toEqual({
      clicks: 10,
      impressions: -100,
      ctr: 1.33,
      position: 2.3,
    });
    expect(merged[1].change).toEqual({
      clicks: 5,
      impressions: 50,
      ctr: 10,
      position: 0,
    });
  });
});
