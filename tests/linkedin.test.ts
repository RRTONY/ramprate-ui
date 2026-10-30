import { describe, expect, it } from "vitest";
import { isLinkedInProfileUrl } from "@/lib/linkedin";

describe("isLinkedInProfileUrl", () => {
  it("accepts personal profile links", () => {
    expect(isLinkedInProfileUrl("https://www.linkedin.com/in/tonygreenberg/")).toBe(true);
    expect(isLinkedInProfileUrl("https://linkedin.com/in/jane-doe")).toBe(true);
    expect(isLinkedInProfileUrl("https://uk.linkedin.com/in/jane-doe")).toBe(true);
    expect(isLinkedInProfileUrl("HTTPS://LinkedIn.com/in/Jane")).toBe(true);
    expect(isLinkedInProfileUrl("linkedin.com/in/jane")).toBe(true);
    expect(isLinkedInProfileUrl("https://www.linkedin.com/pub/jane-doe/1/2/3")).toBe(true);
    expect(isLinkedInProfileUrl("  https://linkedin.com/in/jane?trk=x  ")).toBe(true);
  });

  it("rejects the bare homepage that got through on 2026-10-13", () => {
    expect(isLinkedInProfileUrl("https://Linkedin.com")).toBe(false);
    expect(isLinkedInProfileUrl("https://linkedin.com/")).toBe(false);
    expect(isLinkedInProfileUrl("https://linkedin.com/in/")).toBe(false);
  });

  it("rejects other LinkedIn pages and other sites", () => {
    expect(isLinkedInProfileUrl("https://linkedin.com/company/ramprate")).toBe(false);
    expect(isLinkedInProfileUrl("https://linkedin.com/feed/")).toBe(false);
    expect(isLinkedInProfileUrl("https://notlinkedin.com/in/jane")).toBe(false);
    expect(isLinkedInProfileUrl("https://linkedin.com.evil.com/in/jane")).toBe(false);
    expect(isLinkedInProfileUrl("https://example.com")).toBe(false);
  });

  it("rejects empty and garbage input", () => {
    expect(isLinkedInProfileUrl("")).toBe(false);
    expect(isLinkedInProfileUrl("   ")).toBe(false);
    expect(isLinkedInProfileUrl("not a url")).toBe(false);
  });
});
