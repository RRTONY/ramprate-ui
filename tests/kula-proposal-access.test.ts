import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createSession,
  matchesPassword,
  SESSION_SECONDS,
  validSession,
} from "../src/app/kula-proposal/private/access";

describe("Kula proposal access", () => {
  it("preserves every byte of the supplied proposal", () => {
    const html = readFileSync("src/app/kula-proposal/private/proposal.txt");
    expect(createHash("sha256").update(html).digest("hex")).toBe(
      "77838dbea6779f9d8b0fe531d6989f0bff9647db90a2bf9587f322919ce1657f",
    );
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
