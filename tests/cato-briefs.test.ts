import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  CATO_BRIEFS,
  createSession,
  matchesPassword,
  SESSION_SECONDS,
  validSession,
  type CatoBrief,
} from "../src/lib/cato-brief/access";

const briefs = Object.keys(CATO_BRIEFS) as CatoBrief[];
const read = (route: string, file: string) =>
  readFileSync(`src/app/${route}/brief/${file}`, "utf8");

describe("Cato financing briefs", () => {
  it("strategic brief carries Alex's Nov 24 wording in both layouts", () => {
    for (const layout of ["DesktopBrief.tsx", "MobileBrief.tsx"]) {
      const tsx = read("cato-brief-strategic", layout);
      expect(tsx).toContain(
        "Bridge funding secured, closing anticipated in next 2 weeks",
      );
      expect(tsx).not.toContain("Bridge closing in the next two weeks");
    }
  });

  it("each brief only uses its own private image route, for images that exist", () => {
    const media = new Set(readdirSync("src/lib/cato-brief/media"));
    for (const brief of briefs) {
      const route = CATO_BRIEFS[brief].path.slice(1);
      for (const layout of ["DesktopBrief.tsx", "MobileBrief.tsx"]) {
        const tsx = read(route, layout);
        expect(tsx).not.toContain("data:image");
        const used = [...tsx.matchAll(/src="([^"]+\.webp)"/g)].map((m) => m[1]);
        expect(used.length).toBeGreaterThan(0);
        for (const src of used) {
          expect(src.startsWith(`/${route}/media/`)).toBe(true);
          expect(media.has(src.split("/").pop()!)).toBe(true);
        }
      }
    }
  });

  it("sends the old .html links to the pages, and the old files are gone", async () => {
    const { default: config } = await import("../next.config");
    const redirects = await config.redirects!();
    for (const [source, destination] of [
      ["/cato-digital-financing-strategic.html", "/cato-brief-strategic"],
      ["/cato-digital-financing.html", "/cato-digital-financing"],
    ]) {
      expect(redirects).toContainEqual(
        expect.objectContaining({ source, destination, permanent: true }),
      );
      expect(() => readFileSync(`public${source}`)).toThrow();
    }
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
    for (const brief of briefs) {
      const token = createSession(brief, secret, now);
      expect(validSession(brief, token, secret, now)).toBe(true);
      expect(
        validSession(brief, token, secret, now + SESSION_SECONDS * 1000 - 1),
      ).toBe(true);
      expect(
        validSession(brief, token, secret, now + SESSION_SECONDS * 1000),
      ).toBe(false);
    }
  });

  it("a session for one brief never opens the other", () => {
    const token = createSession("strategic", secret, now);
    expect(validSession("original", token, secret, now)).toBe(false);
    expect(
      validSession(
        "strategic",
        createSession("original", secret, now),
        secret,
        now,
      ),
    ).toBe(false);
  });

  it("rejects forged, malformed, foreign and future sessions", () => {
    const token = createSession("strategic", secret, now);
    for (const value of [
      undefined,
      "",
      "forged",
      token + ".extra",
      "x." + token,
    ]) {
      expect(validSession("strategic", value, secret, now)).toBe(false);
    }
    expect(validSession("strategic", token.slice(0, -1), secret, now)).toBe(
      false,
    );
    expect(validSession("strategic", token, "another-key", now)).toBe(false);
    expect(validSession("strategic", token, secret, now - 1000)).toBe(false);
  });

  it("fails closed without a configured signing secret", () => {
    expect(() => createSession("strategic", "", now)).toThrow();
    expect(
      validSession(
        "strategic",
        createSession("strategic", secret, now),
        "",
        now,
      ),
    ).toBe(false);
  });
});
