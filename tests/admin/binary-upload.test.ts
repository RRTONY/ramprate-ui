import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  checkFileMatchesPath,
  decodeBase64,
  downloadFile,
  readUploadGrant,
  resolveBinaryInput,
  signUploadGrant,
  MAX_FETCH_BYTES,
} from "@/lib/admin/binary-upload";

const PNG = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3,
]);
const JPG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0x10]);

beforeEach(() => {
  vi.stubEnv("PORTAL_AUTH_SECRET", "test-secret");
  vi.stubEnv("MCP_LOGIN_PASSWORD", "pw");
  vi.stubEnv(
    "MCP_ADMIN_USERS",
    JSON.stringify([
      { name: "Jane", email: "jane@ramprate.com", role: "write" },
      { name: "Ann", email: "ann@ramprate.com", role: "read" },
    ]),
  );
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("decodeBase64", () => {
  it("accepts real base64 and a data: URL prefix", () => {
    const b64 = PNG.toString("base64");
    expect(decodeBase64(b64)).toEqual({ ok: true, bytes: PNG });
    expect(decodeBase64(`data:image/png;base64,${b64}`)).toEqual({
      ok: true,
      bytes: PNG,
    });
  });

  it("refuses a file reference (what ChatGPT's AI sent on 2026-10-08) and points to the upload link", () => {
    const res = decodeBase64("/mnt/data/tsi-hero.png");
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("request_upload_link");
  });

  it("refuses empty input", () => {
    expect(decodeBase64("   ").ok).toBe(false);
  });
});

describe("checkFileMatchesPath", () => {
  it("passes a real PNG and JPG", () => {
    expect(checkFileMatchesPath("public/a.png", PNG)).toBeNull();
    expect(checkFileMatchesPath("public/a.jpeg", JPG)).toBeNull();
  });

  it("refuses an HTML page saved as .png", () => {
    expect(
      checkFileMatchesPath("public/a.png", Buffer.from("<html>login</html>")),
    ).toMatch(/isn't a real \.png/);
  });

  it("refuses a JPG named .png", () => {
    expect(checkFileMatchesPath("public/a.png", JPG)).not.toBeNull();
  });

  it("refuses an empty file, allows unknown endings", () => {
    expect(checkFileMatchesPath("public/a.png", Buffer.alloc(0))).toBe(
      "The file is empty.",
    );
    expect(checkFileMatchesPath("public/a.woff2", Buffer.from("x"))).toBeNull();
  });
});

describe("downloadFile", () => {
  it("refuses http, localhost and IP addresses without fetching", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    for (const url of [
      "http://example.com/a.png",
      "https://localhost/a.png",
      "https://169.254.169.254/latest",
      "https://[::1]/a.png",
      "not a url",
    ]) {
      expect((await downloadFile(url)).ok).toBe(false);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuses a redirect onto an internal address", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(null, {
            status: 302,
            headers: { location: "https://127.0.0.1/x" },
          }),
      ),
    );
    const res = await downloadFile("https://files.example.com/a.png");
    expect(res.ok).toBe(false);
  });

  it("follows a normal redirect", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(null, { status: 302, headers: { location: "/real.png" } }),
      )
      .mockResolvedValueOnce(new Response(PNG));
    vi.stubGlobal("fetch", fetchMock);
    const res = await downloadFile("https://files.example.com/a.png");
    expect(res).toEqual({ ok: true, bytes: PNG });
    expect(String(fetchMock.mock.calls[1][0])).toBe(
      "https://files.example.com/real.png",
    );
  });

  it("refuses files over the limit and failed downloads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response("x", {
            headers: { "content-length": String(MAX_FETCH_BYTES + 1) },
          }),
      ),
    );
    expect((await downloadFile("https://f.example.com/a.png")).ok).toBe(false);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("gone", { status: 403 })),
    );
    const res = await downloadFile("https://f.example.com/a.png");
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("403");
  });
});

describe("resolveBinaryInput", () => {
  it("downloads ChatGPT's file param", async () => {
    const fetchMock = vi.fn(async () => new Response(PNG));
    vi.stubGlobal("fetch", fetchMock);
    const res = await resolveBinaryInput({
      file: {
        download_url: "https://files.oaiusercontent.com/abc",
        file_id: "file_1",
      },
    });
    expect(res).toEqual({ ok: true, bytes: PNG });
  });

  it("tells the AI what to do when nothing usable was sent", async () => {
    const res = await resolveBinaryInput({});
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("request_upload_link");
  });
});

describe("upload links", () => {
  const jane = {
    name: "Jane",
    email: "jane@ramprate.com",
    role: "write" as const,
  };

  it("round-trips change, path and person", () => {
    const { token } = signUploadGrant("20261008-abc", "public/a.png", jane);
    const access = readUploadGrant(token);
    expect(access?.grant.change).toBe("20261008-abc");
    expect(access?.grant.path).toBe("public/a.png");
    expect(access?.user.name).toBe("Jane");
  });

  it("refuses a tampered, expired or garbage link", () => {
    const { token } = signUploadGrant("20261008-abc", "public/a.png", jane);
    const [p, body, sig] = token.split(".");
    const forged = Buffer.from(
      JSON.stringify({
        ...JSON.parse(Buffer.from(body, "base64url").toString()),
        path: "src/app/page.tsx",
      }),
    ).toString("base64url");
    expect(readUploadGrant(`${p}.${forged}.${sig}`)).toBeNull();
    expect(readUploadGrant("nope")).toBeNull();
    expect(readUploadGrant(undefined)).toBeNull();
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 31 * 60 * 1000);
    expect(readUploadGrant(token)).toBeNull();
  });

  it("stops working once the person is removed or made read-only", () => {
    const { token } = signUploadGrant("20261008-abc", "public/a.png", jane);
    vi.stubEnv(
      "MCP_ADMIN_USERS",
      JSON.stringify([
        { name: "Jane", email: "jane@ramprate.com", role: "read" },
      ]),
    );
    expect(readUploadGrant(token)).toBeNull();
    vi.stubEnv("MCP_ADMIN_USERS", "[]");
    expect(readUploadGrant(token)).toBeNull();
  });

  it("can't be passed off as a sign-in token", async () => {
    const { verifyBlob } = await import("@/lib/admin/mcp-oauth");
    const { token } = signUploadGrant("20261008-abc", "public/a.png", jane);
    expect(verifyBlob("at", token)).toBeNull();
  });
});
