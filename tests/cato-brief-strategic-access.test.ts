import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createSession,
  matchesPassword,
  SESSION_SECONDS,
  validSession,
} from "../src/app/cato-brief-strategic/private/access";

describe("Cato strategic financing brief access", () => {
  const read = (f: string) =>
    readFileSync(`src/app/cato-brief-strategic/brief/${f}`, "utf8");

  it("carries the Nov 24 wording, not the old one, in both layouts", () => {
    for (const layout of ["DesktopBrief.tsx", "MobileBrief.tsx"]) {
      const tsx = read(layout);
      expect(tsx).toContain(
        "Bridge funding secured, closing anticipated in next 2 weeks",
      );
      expect(tsx).not.toContain("Bridge closing in the next two weeks");
    }
  });

  it("only uses private images that exist, never public or embedded ones", () => {
    const media = new Set(
      readdirSync("src/app/cato-brief-strategic/private/media"),
    );
    for (const layout of ["DesktopBrief.tsx", "MobileBrief.tsx"]) {
      const tsx = read(layout);
      expect(tsx).not.toContain("data:image");
      for (const [, file] of tsx.matchAll(
        /\/cato-brief-strategic\/media\/([^"]+)"/g,
      )) {
        expect(media.has(file)).toBe(true);
      }
    }
  });

  it("sends the old .html link to the page, and the old file is gone", async () => {
    const { default: config } = await import("../next.config");
    const redirects = await config.redirects!();
    expect(redirects).toContainEqual(
      expect.objectContaining({
        source: "/cato-digital-financing-strategic.html",
        destination: "/cato-brief-strategic",
        permanent: true,
      }),
    );
    expect(() =>
      readFileSync("public/cato-digital-financing-strategic.html"),
    ).toThrow();
  });

  const now = 1793318400000;
  const secret = "test-only-session-signing-key";

  it("rejects absent, invalid, empty and oversized passwords", () => {
    for (const value of [
      undefined,
      null,
      {},
      1,
      "",
      "incorrect",
      "x".repeat(257),
    ]) {
      expect(matchesPassword(value)).toBe(false);
    }
  });

  it("accepts a signed session until its expiry", () => {
    const token = createSession(secret, now);
    expect(validSession(token, secret, now)).toBe(true);
    expect(validSession(token, secret, now + SESSION_SECONDS * 1000 - 1)).toBe(
      true,
    );
    expect(validSession(token, secret, now + SESSION_SECONDS * 1000)).toBe(
      false,
    );
  });

  it("rejects forged, malformed, foreign and future sessions", () => {
    const token = createSession(secret, now);
    for (const value of [
      undefined,
      "",
      "forged",
      token + ".extra",
      "x." + token,
    ]) {
      expect(validSession(value, secret, now)).toBe(false);
    }
    expect(validSession(token.slice(0, -1), secret, now)).toBe(false);
    expect(validSession(token, "another-key", now)).toBe(false);
    expect(validSession(token, secret, now - 1000)).toBe(false);
  });

  it("fails closed without a configured signing secret", () => {
    expect(() => createSession("", now)).toThrow();
    expect(validSession(createSession(secret, now), "", now)).toBe(false);
  });
});
