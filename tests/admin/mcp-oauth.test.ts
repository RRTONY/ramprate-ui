import { createHash, randomBytes } from "crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  authenticateMcpBearer,
  exchangeToken,
  isAllowedRedirectUri,
  issueAuthCode,
  login,
  registerClient,
  resetLoginFailuresForTests,
  signBlob,
  validateAuthorizeRequest,
} from "@/lib/admin/mcp-oauth";

const PASSWORD = "test-login-password";
const CHATGPT_CB = "https://chatgpt.com/connector_platform_oauth_redirect";
const TEAM = [
  { name: "Jane", email: "jane@ramprate.com", role: "write" },
  { name: "Bob", email: "Bob@RampRate.com", role: "read" },
];

function setEnv(team = TEAM, password = PASSWORD) {
  vi.stubEnv("PORTAL_AUTH_SECRET", "unit-test-secret");
  vi.stubEnv("MCP_LOGIN_PASSWORD", password);
  vi.stubEnv("MCP_ADMIN_USERS", JSON.stringify(team));
}

function pkce() {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

function register(uri = CHATGPT_CB) {
  const r = registerClient({ redirect_uris: [uri], client_name: "ChatGPT" });
  if ("error" in r) throw new Error(r.error);
  return r.clientId;
}

function authorize(clientId: string, challenge: string, uri = CHATGPT_CB) {
  const v = validateAuthorizeRequest({
    response_type: "code",
    client_id: clientId,
    redirect_uri: uri,
    code_challenge: challenge,
    code_challenge_method: "S256",
    state: "xyz",
    scope: "mcp",
  });
  if ("error" in v) throw new Error(v.error);
  return v;
}

function fullSignIn(email = "jane@ramprate.com") {
  const clientId = register();
  const { verifier, challenge } = pkce();
  const { params } = authorize(clientId, challenge);
  const code = issueAuthCode(params, email);
  const res = exchangeToken({
    grant_type: "authorization_code",
    code,
    code_verifier: verifier,
    redirect_uri: CHATGPT_CB,
    client_id: clientId,
  });
  if (!res.ok) throw new Error(res.description);
  return { clientId, tokens: res.body };
}

beforeEach(() => {
  setEnv();
  resetLoginFailuresForTests();
});
afterEach(() => vi.unstubAllEnvs());

describe("redirect allowlist", () => {
  it("accepts ChatGPT, Claude and localhost apps", () => {
    expect(isAllowedRedirectUri(CHATGPT_CB)).toBe(true);
    expect(
      isAllowedRedirectUri("https://claude.ai/api/mcp/auth_callback"),
    ).toBe(true);
    expect(
      isAllowedRedirectUri("https://claude.com/api/mcp/auth_callback"),
    ).toBe(true);
    expect(isAllowedRedirectUri("http://localhost:33418/callback")).toBe(true);
    expect(isAllowedRedirectUri("http://127.0.0.1:5000/cb")).toBe(true);
  });
  it("rejects look-alike and insecure addresses", () => {
    expect(isAllowedRedirectUri("https://evil.com/cb")).toBe(false);
    expect(isAllowedRedirectUri("https://chatgpt.com.evil.com/cb")).toBe(false);
    expect(isAllowedRedirectUri("http://chatgpt.com/cb")).toBe(false);
    expect(isAllowedRedirectUri("javascript:alert(1)")).toBe(false);
    expect(
      registerClient({ redirect_uris: ["https://evil.com/cb"] }),
    ).toHaveProperty("error");
  });
});

describe("sign-in", () => {
  it("needs a team email AND the password (email is case-insensitive)", () => {
    expect(login("jane@ramprate.com", PASSWORD)?.name).toBe("Jane");
    expect(login("BOB@ramprate.com", PASSWORD)?.role).toBe("read");
    expect(login("jane@ramprate.com", "wrong")).toBeNull();
    expect(login("stranger@ramprate.com", PASSWORD)).toBeNull();
    expect(login("", PASSWORD)).toBeNull();
  });
  it("fails closed when no password is configured", () => {
    setEnv(TEAM, "");
    expect(login("jane@ramprate.com", "")).toBeNull();
  });
});

describe("authorize request validation", () => {
  it("rejects a redirect the client didn't register, and non-PKCE requests", () => {
    const clientId = register();
    const { challenge } = pkce();
    const base = {
      response_type: "code",
      client_id: clientId,
      code_challenge: challenge,
      code_challenge_method: "S256",
    };
    expect(
      validateAuthorizeRequest({
        ...base,
        redirect_uri: "https://claude.ai/api/mcp/auth_callback",
      }),
    ).toHaveProperty("error");
    expect(
      validateAuthorizeRequest({
        ...base,
        redirect_uri: CHATGPT_CB,
        code_challenge_method: "plain",
      }),
    ).toHaveProperty("error");
    expect(
      validateAuthorizeRequest({
        ...base,
        redirect_uri: CHATGPT_CB,
        client_id: "forged",
      }),
    ).toHaveProperty("error");
    expect(
      validateAuthorizeRequest({
        ...base,
        redirect_uri: CHATGPT_CB,
      }).hasOwnProperty("params"),
    ).toBe(true);
  });
});

describe("full flow", () => {
  it("sign in -> code -> tokens -> the MCP server knows who it is", () => {
    const { tokens } = fullSignIn();
    expect(tokens.token_type).toBe("Bearer");
    expect(authenticateMcpBearer(tokens.access_token)).toEqual({
      name: "Jane",
      email: "jane@ramprate.com",
      role: "write",
    });
  });

  it("refresh gives a new working access token", () => {
    const { clientId, tokens } = fullSignIn();
    const res = exchangeToken({
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
      client_id: clientId,
    });
    expect(res.ok).toBe(true);
    if (res.ok)
      expect(authenticateMcpBearer(res.body.access_token)?.name).toBe("Jane");
  });

  it("removing someone from the team list cuts them off immediately", () => {
    const { clientId, tokens } = fullSignIn();
    setEnv([TEAM[1]]);
    expect(authenticateMcpBearer(tokens.access_token)).toBeNull();
    expect(
      exchangeToken({
        grant_type: "refresh_token",
        refresh_token: tokens.refresh_token,
        client_id: clientId,
      }).ok,
    ).toBe(false);
  });

  it("changing the password signs everyone out, but keeps app registrations", () => {
    const { clientId, tokens } = fullSignIn();
    setEnv(TEAM, "a-new-password");
    expect(authenticateMcpBearer(tokens.access_token)).toBeNull();
    expect(
      exchangeToken({
        grant_type: "refresh_token",
        refresh_token: tokens.refresh_token,
        client_id: clientId,
      }).ok,
    ).toBe(false);
    expect(
      validateAuthorizeRequest({
        response_type: "code",
        client_id: clientId,
        redirect_uri: CHATGPT_CB,
        code_challenge: pkce().challenge,
        code_challenge_method: "S256",
      }),
    ).toHaveProperty("params");
  });
});

describe("code exchange attacks", () => {
  it("a stolen code is useless without the PKCE verifier", () => {
    const clientId = register();
    const { challenge } = pkce();
    const code = issueAuthCode(
      authorize(clientId, challenge).params,
      "jane@ramprate.com",
    );
    const res = exchangeToken({
      grant_type: "authorization_code",
      code,
      code_verifier: pkce().verifier,
      redirect_uri: CHATGPT_CB,
      client_id: clientId,
    });
    expect(res.ok).toBe(false);
  });

  it("a code can't be redeemed by a different client or redirect", () => {
    const clientId = register();
    const other = register("https://claude.ai/api/mcp/auth_callback");
    const { verifier, challenge } = pkce();
    const code = issueAuthCode(
      authorize(clientId, challenge).params,
      "jane@ramprate.com",
    );
    expect(
      exchangeToken({
        grant_type: "authorization_code",
        code,
        code_verifier: verifier,
        redirect_uri: CHATGPT_CB,
        client_id: other,
      }).ok,
    ).toBe(false);
    expect(
      exchangeToken({
        grant_type: "authorization_code",
        code,
        code_verifier: verifier,
        redirect_uri: "https://claude.ai/api/mcp/auth_callback",
        client_id: clientId,
      }).ok,
    ).toBe(false);
  });

  it("an expired code is rejected", () => {
    const clientId = register();
    const { verifier, challenge } = pkce();
    const code = signBlob("code", {
      c: "x",
      r: CHATGPT_CB,
      ch: challenge,
      e: "jane@ramprate.com",
      exp: 1,
    });
    expect(
      exchangeToken({
        grant_type: "authorization_code",
        code,
        code_verifier: verifier,
        redirect_uri: CHATGPT_CB,
        client_id: clientId,
      }).ok,
    ).toBe(false);
  });

  it("one kind of token can't be passed off as another", () => {
    const { tokens } = fullSignIn();
    expect(authenticateMcpBearer(tokens.refresh_token)).toBeNull();
    const clientId = register();
    expect(authenticateMcpBearer(clientId)).toBeNull();
    const tampered = tokens.access_token.replace(
      /\.[^.]+\./,
      `.${Buffer.from(JSON.stringify({ e: "bob@ramprate.com", exp: 9999999999 })).toString("base64url")}.`,
    );
    expect(authenticateMcpBearer(tampered)).toBeNull();
  });
});

describe("HTTP routes", () => {
  it("MCP endpoint answers 401 with a pointer to the sign-in metadata", async () => {
    const { POST } = await import("@/app/api/mcp/route");
    const res = await POST(
      new Request("https://ramprate.com/api/mcp", {
        method: "POST",
        body: "{}",
      }),
    );
    expect(res.status).toBe(401);
    expect(res.headers.get("www-authenticate")).toBe(
      'Bearer resource_metadata="https://ramprate.com/.well-known/oauth-protected-resource/api/mcp"',
    );
  });

  it("metadata endpoints describe the sign-in flow", async () => {
    const pr = await (
      await import("@/app/.well-known/oauth-protected-resource/[[...path]]/route")
    ).GET(
      new Request(
        "https://ramprate.com/.well-known/oauth-protected-resource/api/mcp",
      ),
    );
    expect((await pr.json()).authorization_servers).toEqual([
      "https://ramprate.com",
    ]);
    const as = await (
      await import("@/app/.well-known/oauth-authorization-server/[[...path]]/route")
    ).GET(
      new Request(
        "https://ramprate.com/.well-known/oauth-authorization-server",
      ),
    );
    const meta = await as.json();
    expect(meta.authorization_endpoint).toBe(
      "https://ramprate.com/oauth/authorize",
    );
    expect(meta.code_challenge_methods_supported).toEqual(["S256"]);
  });

  it("sign-in form: wrong password goes back to the page (no password in the URL), right one returns a code to ChatGPT", async () => {
    const { POST } = await import("@/app/api/oauth/authorize/route");
    const clientId = register();
    const { challenge } = pkce();
    const body = (password: string) =>
      new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        redirect_uri: CHATGPT_CB,
        code_challenge: challenge,
        code_challenge_method: "S256",
        state: "abc",
        email: "jane@ramprate.com",
        password,
      }).toString();

    const bad = await POST(
      new Request("https://ramprate.com/api/oauth/authorize", {
        method: "POST",
        body: body("nope"),
      }),
    );
    const badLoc = bad.headers.get("location")!;
    expect(bad.status).toBe(303);
    expect(badLoc).toContain("/oauth/authorize?");
    expect(badLoc).toContain("error=invalid");
    expect(badLoc).not.toContain("nope");

    const good = await POST(
      new Request("https://ramprate.com/api/oauth/authorize", {
        method: "POST",
        body: body(PASSWORD),
      }),
    );
    const loc = new URL(good.headers.get("location")!);
    expect(loc.origin + loc.pathname).toBe(CHATGPT_CB);
    expect(loc.searchParams.get("state")).toBe("abc");
    expect(loc.searchParams.get("code")).toMatch(/^rmcp_code\./);
  });

  it("locks sign-in after repeated wrong passwords", async () => {
    const { POST } = await import("@/app/api/oauth/authorize/route");
    const clientId = register();
    const { challenge } = pkce();
    const req = (password: string) =>
      new Request("https://ramprate.com/api/oauth/authorize", {
        method: "POST",
        headers: { "x-forwarded-for": "9.9.9.9" },
        body: new URLSearchParams({
          response_type: "code",
          client_id: clientId,
          redirect_uri: CHATGPT_CB,
          code_challenge: challenge,
          code_challenge_method: "S256",
          email: "jane@ramprate.com",
          password,
        }).toString(),
      });
    for (let i = 0; i < 8; i++) await POST(req("wrong"));
    const locked = await POST(req(PASSWORD));
    expect(locked.headers.get("location")).toContain("error=locked");
  });

  it("token endpoint exchanges a code sent as a normal form", async () => {
    const { POST } = await import("@/app/api/oauth/token/route");
    const clientId = register();
    const { verifier, challenge } = pkce();
    const code = issueAuthCode(
      authorize(clientId, challenge).params,
      "jane@ramprate.com",
    );
    const res = await POST(
      new Request("https://ramprate.com/api/oauth/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          code_verifier: verifier,
          redirect_uri: CHATGPT_CB,
          client_id: clientId,
        }).toString(),
      }),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.access_token).toMatch(/^rmcp_at\./);
    expect(res.headers.get("cache-control")).toBe("no-store");
  });
});
