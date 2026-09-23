import { describe, expect, it } from "vitest";
import {
  isPathDenied,
  isPathReadDenied,
  isSanityTypeAllowed,
} from "@/lib/admin/guardrails";

describe("isPathDenied", () => {
  it("blocks secrets and config files", () => {
    expect(isPathDenied(".env")).toBe(true);
    expect(isPathDenied(".env.local")).toBe(true);
    expect(isPathDenied("package.json")).toBe(true);
    expect(isPathDenied("netlify.toml")).toBe(true);
  });

  it("allows next.config.ts (needed for redirect rules)", () => {
    expect(isPathDenied("next.config.ts")).toBe(false);
    expect(isPathDenied("next.config.js")).toBe(false);
  });

  it("blocks the admin tool's own code", () => {
    expect(isPathDenied("src/lib/admin/guardrails.ts")).toBe(true);
    expect(isPathDenied("src/app/api/mcp/route.ts")).toBe(true);
    expect(isPathDenied("src/lib/portal-auth.ts")).toBe(true);
    expect(isPathDenied(".mcp.json")).toBe(true);
  });

  it("allows ordinary site content files", () => {
    expect(isPathDenied("src/app/about/page.tsx")).toBe(false);
    expect(isPathDenied("src/app/growth/page.tsx")).toBe(false);
  });
});

describe("isPathReadDenied", () => {
  it("allows reading secret-free build/deploy/CI config", () => {
    expect(isPathReadDenied("netlify.toml")).toBe(false);
    expect(isPathReadDenied("package.json")).toBe(false);
    expect(isPathReadDenied(".github/workflows/admin-pr-lint.yml")).toBe(false);
    expect(isPathReadDenied("/src/middleware.ts")).toBe(false);
  });

  it("keeps those same files write-blocked", () => {
    expect(isPathDenied("netlify.toml")).toBe(true);
    expect(isPathDenied(".github/workflows/admin-pr-lint.yml")).toBe(true);
    expect(isPathDenied("src/middleware.ts")).toBe(true);
  });

  it("still blocks reading secrets and the admin tool's own code", () => {
    expect(isPathReadDenied(".env")).toBe(true);
    expect(isPathReadDenied(".env.production")).toBe(true);
    expect(isPathReadDenied(".mcp.json")).toBe(true);
    expect(isPathReadDenied(".git/config")).toBe(true);
    expect(isPathReadDenied(".github/CODEOWNERS")).toBe(true);
    expect(isPathReadDenied(".github/workflows/nested/x.yml")).toBe(true);
    expect(isPathReadDenied("src/lib/admin/guardrails.ts")).toBe(true);
    expect(isPathReadDenied("src/app/api/mcp/route.ts")).toBe(true);
    expect(isPathReadDenied("src/lib/portal-auth.ts")).toBe(true);
    expect(isPathReadDenied("src/lib/sanity/write-client.ts")).toBe(true);
  });

  it("allows ordinary site files", () => {
    expect(isPathReadDenied("src/app/about/page.tsx")).toBe(false);
  });
});

describe("isSanityTypeAllowed", () => {
  it("allows registered document types", () => {
    expect(isSanityTypeAllowed("testimonial")).toBe(true);
    expect(isSanityTypeAllowed("page")).toBe(true);
  });

  it("rejects unregistered or embedded object types", () => {
    expect(isSanityTypeAllowed("seo")).toBe(false);
    expect(isSanityTypeAllowed("somethingMadeUp")).toBe(false);
  });
});
