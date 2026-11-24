import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createSession,
  matchesPassword,
  SESSION_SECONDS,
  validSession,
} from "../src/app/cato-brief-strategic/private/access";

const sha = (file: string) =>
  createHash("sha256").update(readFileSync(file)).digest("hex");

describe("Cato strategic financing brief access", () => {
  it("preserves every byte of Alex's Nov 24 version, both layouts", () => {
    expect(sha("src/app/cato-brief-strategic/private/desktop.txt")).toBe(
      "577ea4459046d35d6c3c3dc9419859eb17a02ecd67c9538aa4218f71df519657",
    );
    expect(sha("src/app/cato-brief-strategic/private/mobile.txt")).toBe(
      "2708ce42a2d03ef5dc0ebaf4694eac7b72b4165e457138d8029a66c158a2946f",
    );
  });

  it("carries the Nov 24 wording, not the old one", () => {
    for (const layout of ["desktop", "mobile"]) {
      const html = readFileSync(
        `src/app/cato-brief-strategic/private/${layout}.txt`,
        "utf8",
      );
      expect(html).toContain("Bridge funding secured, closing anticipated in next 2 weeks");
      expect(html).not.toContain("Bridge closing in the next two weeks");
    }
  });

  const now = 1793318400000;
  const secret = "test-only-session-signing-key";

  it("rejects absent, invalid, empty and oversized passwords", () => {
    for (const value of [undefined, null, {}, 1, "", "incorrect", "x".repeat(257)]) {
      expect(matchesPassword(value)).toBe(false);
    }
  });

  it("accepts a signed session until its expiry", () => {
    const token = createSession(secret, now);
    expect(validSession(token, secret, now)).toBe(true);
    expect(validSession(token, secret, now + SESSION_SECONDS * 1000 - 1)).toBe(true);
    expect(validSession(token, secret, now + SESSION_SECONDS * 1000)).toBe(false);
  });

  it("rejects forged, malformed, foreign and future sessions", () => {
    const token = createSession(secret, now);
    for (const value of [undefined, "", "forged", token + ".extra", "x." + token]) {
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
