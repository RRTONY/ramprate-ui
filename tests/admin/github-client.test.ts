import { describe, expect, it } from "vitest";
import { truncateLogTail } from "@/lib/admin/github-client";

describe("truncateLogTail", () => {
  it("returns short logs unchanged", () => {
    const log = "line 1\nline 2\nerror: something broke";
    expect(truncateLogTail(log)).toBe(log);
  });

  it("keeps only the last 200 lines of a long log", () => {
    const lines = Array.from({ length: 500 }, (_, i) => `line ${i}`);
    const result = truncateLogTail(lines.join("\n"));
    const resultLines = result.split("\n");
    expect(resultLines.length).toBe(200);
    expect(resultLines[0]).toBe("line 300");
    expect(resultLines[resultLines.length - 1]).toBe("line 499");
  });

  it("caps output at 8000 characters even for 200 long lines", () => {
    const lines = Array.from({ length: 200 }, (_, i) => `x`.repeat(100) + i);
    const result = truncateLogTail(lines.join("\n"));
    expect(result.length).toBeLessThanOrEqual(8000);
    // The end of the log (where the real failure lives) must survive the cap.
    expect(result.endsWith("199")).toBe(true);
  });
});

describe("getPRChecksDetail splits Netlify's build from GitHub's own jobs", () => {
  it("uses the real shape seen on PR #47: build done, GitHub 'test' job still queued", async () => {
    const { vi } = await import("vitest");
    process.env.GITHUB_TOKEN = process.env.GITHUB_TOKEN || "test-token";
    const replies: Record<string, unknown> = {
      "/pulls/47": { head: { sha: "abc" } },
      "/commits/abc/status": {
        state: "success",
        statuses: [
          { context: "netlify/ramprate/deploy-preview", state: "success" },
        ],
      },
      "/commits/abc/check-runs": {
        check_runs: [
          {
            id: 1,
            name: "Redirect rules - ramprate",
            status: "completed",
            conclusion: "success",
            html_url: "u",
          },
          {
            id: 2,
            name: "Pages changed - ramprate",
            status: "completed",
            conclusion: "neutral",
            html_url: "u",
          },
          {
            id: 3,
            name: "test",
            status: "queued",
            conclusion: null,
            html_url: "u",
          },
          {
            id: 4,
            name: "lint-changed-files",
            status: "completed",
            conclusion: "success",
            html_url: "u",
          },
        ],
      },
      "/issues/47/comments": [
        {
          body: "Deploy Preview https://deploy-preview-47--ramprate.netlify.app ready",
        },
      ],
    };
    const fetchMock = vi.fn(async (url: string) => {
      const key = Object.keys(replies).find((k) => String(url).includes(k));
      return new Response(JSON.stringify(key ? replies[key] : {}), {
        status: key ? 200 : 404,
      });
    });
    vi.stubGlobal("fetch", fetchMock);
    try {
      const { getPRChecksDetail } = await import("@/lib/admin/github-client");
      const d = await getPRChecksDetail(47);
      expect(d.status).toBe("pending");
      expect(d.build).toBe("success");
      expect(d.ci).toBe("pending");
      expect(d.ciWaiting).toEqual(["test"]);
      expect(d.previewUrl).toBe(
        "https://deploy-preview-47--ramprate.netlify.app",
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
