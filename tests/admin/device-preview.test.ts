import { describe, expect, it } from "vitest";
import { parseScreenshot, previewTarget } from "@/lib/admin/device-preview";

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
