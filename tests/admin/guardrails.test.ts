import { describe, expect, it } from "vitest";
import { isPathDenied, isSanityTypeAllowed } from "@/lib/admin/guardrails";

describe("isPathDenied", () => {
  it("blocks secrets and config files", () => {
    expect(isPathDenied(".env")).toBe(true);
    expect(isPathDenied(".env.local")).toBe(true);
    expect(isPathDenied("package.json")).toBe(true);
    expect(isPathDenied("netlify.toml")).toBe(true);
    expect(isPathDenied("next.config.ts")).toBe(true);
  });

  it("blocks the admin tool's own code", () => {
    expect(isPathDenied("src/lib/admin/guardrails.ts")).toBe(true);
    expect(isPathDenied("src/app/api/admin/chat/route.ts")).toBe(true);
    expect(isPathDenied("src/lib/portal-auth.ts")).toBe(true);
  });

  it("allows ordinary site content files", () => {
    expect(isPathDenied("src/app/about/page.tsx")).toBe(false);
    expect(isPathDenied("src/app/growth/page.tsx")).toBe(false);
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
