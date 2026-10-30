import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/sanity/client", () => ({ client: { fetch: vi.fn() } }));

import {
  alertLabel,
  alertTone,
  detectBrokenElementAlerts,
  detectTrafficDropAlerts,
} from "@/lib/reports/alerts";

describe("traffic drop alerts", () => {
  it("words every traffic dip calmly, never as an error", () => {
    const alerts = detectTrafficDropAlerts(
      new Map([["/about", 1], ["/blog", 2], ["/process", 0], ["/web3", 7]]),
      new Map([["/about", 3], ["/blog", 4], ["/process", 1], ["/web3", 10]]),
    );
    expect(alerts.map((a) => a.severity)).toEqual(["critical", "urgent", "zero_traffic", "investigate"]);
    for (const a of alerts) {
      expect(a.message).not.toMatch(/critical|urgent|investigate|notify/i);
      expect(alertTone(a)).toBe("neutral");
    }
    expect(alerts[0].message).toBe("/about: fewer visits than usual, 1 vs 3 at the same point last week (down 67%).");
    expect(alertLabel(alerts[0])).toBe("Lower traffic");
    expect(alertLabel(alerts[2])).toBe("No visits yet");
  });

  it("skips pages with no traffic last week or no real drop", () => {
    expect(
      detectTrafficDropAlerts(new Map([["/a", 5], ["/b", 0]]), new Map([["/a", 5], ["/b", 0]])),
    ).toEqual([]);
    expect(detectTrafficDropAlerts(new Map(), new Map())).toEqual([]);
  });
});

describe("broken page alerts", () => {
  it("keeps real site errors red", () => {
    const [alert] = detectBrokenElementAlerts([
      { path: "/x", url: "https://ramprate.com/x", ok: false, status: 500, brokenAssets: [] } as never,
    ]);
    expect(alertLabel(alert)).toBe("Broken");
    expect(alertTone(alert)).toBe("critical");
  });
});
