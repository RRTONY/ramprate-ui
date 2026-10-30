import { describe, expect, it } from "vitest";
import {
  ROLES,
  isRoleVisible,
  roleApplyUrl,
  roleSource,
  type Role,
} from "@/lib/roles";

const base = ROLES[0];
const role = (over: Partial<Role>): Role => ({ ...base, ...over });

describe("isRoleVisible", () => {
  it("shows Approved roles for RampRate or Both", () => {
    expect(
      isRoleVisible(role({ status: "Approved", visible_on: "Both" }), false),
    ).toBe(true);
    expect(
      isRoleVisible(
        role({ status: "Approved", visible_on: "RampRate" }),
        false,
      ),
    ).toBe(true);
  });
  it("hides ImpactSoul-only roles on RampRate", () => {
    expect(
      isRoleVisible(
        role({ status: "Approved", visible_on: "ImpactSoul" }),
        true,
      ),
    ).toBe(false);
  });
  it("shows Draft roles only in preview", () => {
    expect(isRoleVisible(role({ status: "Draft" }), true)).toBe(true);
    expect(isRoleVisible(role({ status: "Draft" }), false)).toBe(false);
  });
  it("never shows Closed roles", () => {
    expect(isRoleVisible(role({ status: "Closed" }), true)).toBe(false);
  });
});

describe("roleSource", () => {
  it("keeps known origin tags", () => {
    expect(roleSource("linkedin")).toBe("linkedin");
    expect(roleSource("braintrust")).toBe("braintrust");
  });
  it("falls back to the site tag for missing or unknown tags", () => {
    expect(roleSource(null)).toBe("ramprate_site");
    expect(roleSource("")).toBe("ramprate_site");
    expect(roleSource("<script>")).toBe("ramprate_site");
  });
});

describe("roleApplyUrl", () => {
  it("returns null until the Dover link is set", () => {
    expect(
      roleApplyUrl(
        {
          apply_url: "https://REPLACE-WITH-DOVER-APPLY-LINK",
          role_id: "ROLE-001",
        },
        null,
      ),
    ).toBeNull();
    expect(
      roleApplyUrl({ apply_url: "", role_id: "ROLE-001" }, null),
    ).toBeNull();
  });
  it("rejects invalid or non-https links", () => {
    expect(
      roleApplyUrl({ apply_url: "not a url", role_id: "ROLE-001" }, null),
    ).toBeNull();
    expect(
      roleApplyUrl(
        { apply_url: "javascript:alert(1)", role_id: "ROLE-001" },
        null,
      ),
    ).toBeNull();
    expect(
      roleApplyUrl(
        { apply_url: "http://app.dover.com/apply/x", role_id: "ROLE-001" },
        null,
      ),
    ).toBeNull();
  });
  it("adds src, role and site to the Dover link", () => {
    const u = new URL(
      roleApplyUrl(
        {
          apply_url: "https://app.dover.com/apply/abc?x=1",
          role_id: "ROLE-001",
        },
        "linkedin",
      )!,
    );
    expect(u.searchParams.get("x")).toBe("1");
    expect(u.searchParams.get("src")).toBe("linkedin");
    expect(u.searchParams.get("role")).toBe("ROLE-001");
    expect(u.searchParams.get("site")).toBe("ramprate");
  });
});

describe("role content", () => {
  it("has unique ids and slugs", () => {
    expect(new Set(ROLES.map((r) => r.role_id)).size).toBe(ROLES.length);
    expect(new Set(ROLES.map((r) => r.slug)).size).toBe(ROLES.length);
  });
  it("never names the client", () => {
    expect(JSON.stringify(ROLES)).not.toMatch(/\bTSI\b/i);
  });
});
