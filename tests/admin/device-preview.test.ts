import { describe, expect, it } from "vitest";
import {
  deviceOutcome,
  liveTarget,
  parseScreenshot,
  previewTarget,
} from "@/lib/admin/device-preview";

const PREVIEW = "https://deploy-preview-41--ramprate.netlify.app";

describe("previewTarget", () => {
  it("builds a page address on this site's preview only", () => {
    expect(previewTarget(PREVIEW, "/about")).toBe(`${PREVIEW}/about`);
    expect(previewTarget(PREVIEW, "about")).toBe(`${PREVIEW}/about`);
    expect(previewTarget(PREVIEW, undefined)).toBe(`${PREVIEW}/`);
    expect(previewTarget(PREVIEW, "")).toBe(`${PREVIEW}/`);
  });

  it("refuses other sites, missing previews and odd paths", () => {
    expect(previewTarget("https://evil.example.com", "/")).toBeNull();
    expect(
      previewTarget("https://deploy-preview-1--other.netlify.app", "/"),
    ).toBeNull();
    expect(previewTarget(null, "/")).toBeNull();
    expect(new URL(previewTarget(PREVIEW, "//evil.com")!).host).toBe(
      "deploy-preview-41--ramprate.netlify.app",
    );
    expect(previewTarget(PREVIEW, "/a/../b")).toBeNull();
    expect(previewTarget(PREVIEW, "/x?y=<script>")).toBeNull();
    expect(previewTarget(PREVIEW, "@evil.com")).toBeNull();
  });
});

describe("parseScreenshot", () => {
  it("returns the image with the device's size", () => {
    const shot = parseScreenshot(
      {
        lighthouseResult: {
          audits: {
            "final-screenshot": {
              details: { data: "data:image/jpeg;base64,AAA" },
            },
          },
        },
      },
      "phone",
    );
    expect(shot).toEqual({
      device: "phone",
      version: "after",
      image: "data:image/jpeg;base64,AAA",
      width: 412,
      height: 823,
    });
  });

  it("reports a missing or unsafe screenshot instead of passing it on", () => {
    expect(parseScreenshot({}, "laptop").image).toBeNull();
    expect(
      parseScreenshot(
        {
          lighthouseResult: {
            audits: {
              "final-screenshot": { details: { data: "javascript:alert(1)" } },
            },
          },
        },
        "laptop",
      ).error,
    ).toBe("No screenshot came back");
  });
});

describe("before (live site) screenshots", () => {
  it("only ever points at ramprate.com, with the same path checks", () => {
    expect(liveTarget("/about")).toBe("https://ramprate.com/about");
    expect(liveTarget(undefined)).toBe("https://ramprate.com/");
    expect(liveTarget("/a/../b")).toBeNull();
    expect(new URL(liveTarget("//evil.com")!).host).toBe("ramprate.com");
  });

  it("judges a device by its After shot and tells a timeout from a failure", () => {
    const ok = {
      device: "phone" as const,
      version: "after" as const,
      image: "data:image/jpeg;base64,A",
      width: 1,
      height: 1,
    };
    const before = { ...ok, version: "before" as const };
    const late = { ...ok, image: null, timedOut: true };
    const broken = { ...ok, image: null };
    expect(deviceOutcome([before, ok], "phone")).toBe("ok");
    expect(deviceOutcome([before, late], "phone")).toBe("timed_out");
    expect(deviceOutcome([broken], "phone")).toBe("failed");
    expect(deviceOutcome([before], "phone")).toBe("failed");
  });
});
