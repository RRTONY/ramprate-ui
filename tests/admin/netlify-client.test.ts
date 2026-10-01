import { describe, expect, it } from "vitest";
import {
  isSkippedDuplicate,
  summarizeDeploy,
} from "@/lib/admin/netlify-client";

const base = {
  id: "d1",
  state: "ready",
  context: "production",
  branch: "master",
  created_at: "2026-10-01T10:00:00Z",
  published_at: "2026-10-01T10:02:00Z",
  deploy_time: 120,
  error_message: null,
  deploy_ssl_url: "https://ramprate.com",
  commit_ref: "40aef9b44c9241cd",
  title: null,
  skipped: null,
};

describe("netlify deploy summaries", () => {
  it("describes a deploy in plain words with a log link", () => {
    expect(summarizeDeploy(base)).toMatchObject({
      plain: "Built and online.",
      commit: "40aef9b",
      logUrl: "https://app.netlify.com/sites/ramprate/deploys/d1",
      error: null,
    });
  });

  it("keeps a real build failure's reason", () => {
    const s = summarizeDeploy({
      ...base,
      state: "error",
      error_message: "Build script returned non-zero exit code: 2",
    });
    expect(s.plain).toBe("The build failed.");
    expect(s.error).toContain("exit code");
    expect(
      isSkippedDuplicate({ ...base, state: "error", error_message: "x" }),
    ).toBe(false);
  });

  it("treats Netlify's cancelled duplicate builds as noise", () => {
    expect(
      isSkippedDuplicate({ ...base, state: "error", error_message: "Skipped" }),
    ).toBe(true);
    expect(isSkippedDuplicate({ ...base, skipped: true })).toBe(true);
  });
});
