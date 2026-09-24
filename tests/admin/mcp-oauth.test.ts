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

async function authorize(
  clientId: string,
  challenge: string,
  uri = CHATGPT_CB,
) {
  const v = await validateAuthorizeRequest({
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

async function fullSignIn(email = "jane@ramprate.com") {
  const clientId = register();
  const { verifier, challenge } = pkce();
  const { params } = await authorize(clientId, challenge);
  const code = issueAuthCode(params, email);
  const res = await exchangeToken({
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
  it("accepts ChatGPT, Claude and localhost apps", async () => {
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
  it("rejects look-alike and insecure addresses", async () => {
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
  it("needs a team email AND the password (email is case-insensitive)", async () => {
    expect(login("jane@ramprate.com", PASSWORD)?.name).toBe("Jane");
    expect(login("BOB@ramprate.com", PASSWORD)?.role).toBe("read");
    expect(login("jane@ramprate.com", "wrong")).toBeNull();
    expect(login("stranger@ramprate.com", PASSWORD)).toBeNull();
    expect(login("", PASSWORD)).toBeNull();
  });
  it("fails closed when no password is configured", async () => {
    setEnv(TEAM, "");
    expect(login("jane@ramprate.com", "")).toBeNull();
  });
});

describe("authorize request validation", () => {
  it("rejects a redirect the client didn't register, and non-PKCE requests", async () => {
    const clientId = register();
    const { challenge } = pkce();
    const base = {
      response_type: "code",
      client_id: clientId,
      code_challenge: challenge,
      code_challenge_method: "S256",
    };
    expect(
      await validateAuthorizeRequest({
        ...base,
        redirect_uri: "https://claude.ai/api/mcp/auth_callback",
      }),
    ).toHaveProperty("error");
    expect(
      await validateAuthorizeRequest({
        ...base,
        redirect_uri: CHATGPT_CB,
        code_challenge_method: "plain",
      }),
    ).toHaveProperty("error");
    expect(
      await validateAuthorizeRequest({
        ...base,
        redirect_uri: CHATGPT_CB,
        client_id: "forged",
      }),
    ).toHaveProperty("error");
    expect(
      (
        await validateAuthorizeRequest({
          ...base,
          redirect_uri: CHATGPT_CB,
        })
      ).hasOwnProperty("params"),
    ).toBe(true);
  });
});

describe("full flow", () => {
  it("sign in -> code -> tokens -> the MCP server knows who it is", async () => {
    const { tokens } = await fullSignIn();
    expect(tokens.token_type).toBe("Bearer");
    expect(authenticateMcpBearer(tokens.access_token)).toEqual({
      name: "Jane",
      email: "jane@ramprate.com",
      role: "write",
    });
  });

  it("refresh gives a new working access token", async () => {
    const { clientId, tokens } = await fullSignIn();
    const res = await exchangeToken({
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
      client_id: clientId,
    });
    expect(res.ok).toBe(true);
    if (res.ok)
      expect(authenticateMcpBearer(res.body.access_token)?.name).toBe("Jane");
  });

  it("removing someone from the team list cuts them off immediately", async () => {
    const { clientId, tokens } = await fullSignIn();
    setEnv([TEAM[1]]);
    expect(authenticateMcpBearer(tokens.access_token)).toBeNull();
    expect(
      (
        await exchangeToken({
          grant_type: "refresh_token",
          refresh_token: tokens.refresh_token,
          client_id: clientId,
        })
      ).ok,
    ).toBe(false);
  });

  it("changing the password signs everyone out, but keeps app registrations", async () => {
    const { clientId, tokens } = await fullSignIn();
    setEnv(TEAM, "a-new-password");
    expect(authenticateMcpBearer(tokens.access_token)).toBeNull();
    expect(
      (
        await exchangeToken({
          grant_type: "refresh_token",
          refresh_token: tokens.refresh_token,
          client_id: clientId,
        })
      ).ok,
    ).toBe(false);
    expect(
      await validateAuthorizeRequest({
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
  it("a stolen code is useless without the PKCE verifier", async () => {
    const clientId = register();
    const { challenge } = pkce();
    const code = issueAuthCode(
      (await authorize(clientId, challenge)).params,
      "jane@ramprate.com",
    );
    const res = await exchangeToken({
      grant_type: "authorization_code",
      code,
      code_verifier: pkce().verifier,
      redirect_uri: CHATGPT_CB,
      client_id: clientId,
    });
    expect(res.ok).toBe(false);
  });

  it("a code can't be redeemed by a different client or redirect", async () => {
    const clientId = register();
    const other = register("https://claude.ai/api/mcp/auth_callback");
    const { verifier, challenge } = pkce();
    const code = issueAuthCode(
      (await authorize(clientId, challenge)).params,
      "jane@ramprate.com",
    );
    expect(
      (
        await exchangeToken({
          grant_type: "authorization_code",
          code,
          code_verifier: verifier,
          redirect_uri: CHATGPT_CB,
          client_id: other,
        })
      ).ok,
    ).toBe(false);
    expect(
      (
        await exchangeToken({
          grant_type: "authorization_code",
          code,
          code_verifier: verifier,
          redirect_uri: "https://claude.ai/api/mcp/auth_callback",
          client_id: clientId,
        })
      ).ok,
    ).toBe(false);
  });

  it("an expired code is rejected", async () => {
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
      (
        await exchangeToken({
          grant_type: "authorization_code",
          code,
          code_verifier: verifier,
          redirect_uri: CHATGPT_CB,
          client_id: clientId,
        })
      ).ok,
    ).toBe(false);
  });

  it("one kind of token can't be passed off as another", async () => {
    const { tokens } = await fullSignIn();
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
      (await authorize(clientId, challenge)).params,
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

describe("publicOrigin (the address advertised to ChatGPT/Claude)", () => {
  const internal = "https://master--ramprate.netlify.app/api/mcp";

  it("uses the real host the visitor asked for, not Netlify's internal address", async () => {
    const { publicOrigin } = await import("@/lib/admin/mcp-oauth");
    vi.stubEnv("MCP_PUBLIC_ORIGIN", "");
    const req = new Request(internal, {
      headers: {
        "x-forwarded-host": "ramprate.com",
        "x-forwarded-proto": "https",
      },
    });
    expect(publicOrigin(req)).toBe("https://ramprate.com");
  });

  it("falls back to Netlify's main site URL when only the internal address is known", async () => {
    const { publicOrigin } = await import("@/lib/admin/mcp-oauth");
    vi.stubEnv("MCP_PUBLIC_ORIGIN", "");
    vi.stubEnv("URL", "https://ramprate.com");
    expect(publicOrigin(new Request(internal))).toBe("https://ramprate.com");
  });

  it("an explicit MCP_PUBLIC_ORIGIN always wins", async () => {
    const { publicOrigin } = await import("@/lib/admin/mcp-oauth");
    vi.stubEnv("MCP_PUBLIC_ORIGIN", "https://ramprate.com/");
    expect(publicOrigin(new Request("http://localhost:3000/x"))).toBe(
      "https://ramprate.com",
    );
  });

  it("keeps localhost for local testing and ignores a malformed host header", async () => {
    const { publicOrigin } = await import("@/lib/admin/mcp-oauth");
    vi.stubEnv("MCP_PUBLIC_ORIGIN", "");
    vi.stubEnv("URL", "");
    expect(publicOrigin(new Request("http://localhost:3107/api/mcp"))).toBe(
      "http://localhost:3107",
    );
    const bad = new Request("https://ramprate.com/api/mcp", {
      headers: { "x-forwarded-host": 'evil.com/"><script>' },
    });
    expect(publicOrigin(bad)).toBe("https://ramprate.com");
  });

  it("the 401 and metadata use the public address even behind Netlify", async () => {
    vi.stubEnv("MCP_PUBLIC_ORIGIN", "");
    vi.stubEnv("URL", "https://ramprate.com");
    const { POST } = await import("@/app/api/mcp/route");
    const res = await POST(
      new Request(internal, { method: "POST", body: "{}" }),
    );
    expect(res.headers.get("www-authenticate")).toContain(
      "https://ramprate.com/.well-known/oauth-protected-resource/api/mcp",
    );
    const pr = await (
      await import("@/app/.well-known/oauth-protected-resource/[[...path]]/route")
    ).GET(
      new Request(
        "https://master--ramprate.netlify.app/.well-known/oauth-protected-resource/api/mcp",
      ),
    );
    expect((await pr.json()).resource).toBe("https://ramprate.com/api/mcp");
  });
});

describe("clients that register asking for a secret (ChatGPT can)", () => {
  function registerWith(method: string) {
    const r = registerClient({
      redirect_uris: [CHATGPT_CB],
      client_name: "ChatGPT",
      token_endpoint_auth_method: method,
    });
    if ("error" in r) throw new Error(r.error);
    return r;
  }
  async function codeFor(clientId: string) {
    const { verifier, challenge } = pkce();
    const code = issueAuthCode(
      (await authorize(clientId, challenge)).params,
      "jane@ramprate.com",
    );
    return { code, verifier };
  }

  it("gets a secret back, and 'none' clients still get none", async () => {
    expect(registerWith("client_secret_post").clientSecret).toBeTruthy();
    expect(registerWith("client_secret_basic").client.authMethod).toBe(
      "client_secret_basic",
    );
    expect(registerWith("none").clientSecret).toBeUndefined();
    expect(registerWith("something_else").client.authMethod).toBe("none");
  });

  it("must present the right secret to exchange a code", async () => {
    const r = registerWith("client_secret_post");
    const base = async (secret?: string) => {
      const { code, verifier } = await codeFor(r.clientId);
      return await exchangeToken({
        grant_type: "authorization_code",
        code,
        code_verifier: verifier,
        redirect_uri: CHATGPT_CB,
        client_id: r.clientId,
        ...(secret ? { client_secret: secret } : {}),
      });
    };
    expect((await base()).ok).toBe(false);
    expect((await base("wrong-secret")).ok).toBe(false);
    expect((await base(r.clientSecret)).ok).toBe(true);
  });

  it("token endpoint accepts the secret as HTTP Basic credentials", async () => {
    const { POST } = await import("@/app/api/oauth/token/route");
    const r = registerWith("client_secret_basic");
    const { code, verifier } = await codeFor(r.clientId);
    const basic = Buffer.from(
      `${encodeURIComponent(r.clientId)}:${encodeURIComponent(r.clientSecret!)}`,
    ).toString("base64");
    const res = await POST(
      new Request("https://ramprate.com/api/oauth/token", {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          authorization: `Basic ${basic}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          code_verifier: verifier,
          redirect_uri: CHATGPT_CB,
        }).toString(),
      }),
    );
    expect(res.status).toBe(200);
    expect((await res.json()).access_token).toMatch(/^rmcp_at\./);
  });

  it("registration endpoint returns the secret and metadata lists the methods", async () => {
    const { POST } = await import("@/app/api/oauth/register/route");
    const res = await POST(
      new Request("https://ramprate.com/api/oauth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          redirect_uris: [CHATGPT_CB],
          token_endpoint_auth_method: "client_secret_basic",
        }),
      }),
    );
    const body = await res.json();
    expect(res.status).toBe(201);
    expect(body.token_endpoint_auth_method).toBe("client_secret_basic");
    expect(body.client_secret).toBeTruthy();
    expect(body.client_secret_expires_at).toBe(0);
    const as = await (
      await import("@/app/.well-known/oauth-authorization-server/[[...path]]/route")
    ).GET(
      new Request(
        "https://ramprate.com/.well-known/oauth-authorization-server",
      ),
    );
    const meta = await as.json();
    expect(meta.token_endpoint_auth_methods_supported).toEqual([
      "none",
      "client_secret_basic",
      "client_secret_post",
      "private_key_jwt",
    ]);
    expect(meta.authorization_response_iss_parameter_supported).toBe(true);
    expect(meta.client_id_metadata_document_supported).toBe(true);
  });
});

describe("ChatGPT's client metadata document + private_key_jwt", () => {
  const CIMD = "https://chatgpt.com/oauth/client.json";
  const JWKS = "https://chatgpt.com/oauth/jwks.json";
  const TOKEN_URL = "https://ramprate.com/api/oauth/token";
  let privateKey: import("crypto").KeyObject;
  let docOverride: Record<string, unknown> | null = null;

  beforeEach(async () => {
    const { generateKeyPairSync } = await import("crypto");
    const pair = generateKeyPairSync("rsa", { modulusLength: 2048 });
    privateKey = pair.privateKey;
    const jwk = {
      ...pair.publicKey.export({ format: "jwk" }),
      kid: "k1",
      alg: "RS256",
      use: "sig",
    };
    const { clearRemoteClientCachesForTests } =
      await import("@/lib/admin/mcp-oauth");
    clearRemoteClientCachesForTests();
    docOverride = null;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url === CIMD) {
          return Response.json(
            docOverride ?? {
              client_id: CIMD,
              redirect_uris: [CHATGPT_CB],
              token_endpoint_auth_method: "private_key_jwt",
              jwks_uri: JWKS,
              client_name: "ChatGPT",
            },
          );
        }
        if (url === JWKS) return Response.json({ keys: [jwk] });
        return new Response("not found", { status: 404 });
      }),
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  async function assertion(claims: Record<string, unknown> = {}, kid = "k1") {
    const { sign } = await import("crypto");
    const t = Math.floor(Date.now() / 1000);
    const h = Buffer.from(
      JSON.stringify({ alg: "RS256", typ: "JWT", kid }),
    ).toString("base64url");
    const p = Buffer.from(
      JSON.stringify({
        iss: CIMD,
        sub: CIMD,
        aud: TOKEN_URL,
        exp: t + 60,
        iat: t,
        jti: "x",
        ...claims,
      }),
    ).toString("base64url");
    return `${h}.${p}.${sign("RSA-SHA256", Buffer.from(`${h}.${p}`), privateKey).toString("base64url")}`;
  }

  async function signInCode() {
    const { verifier, challenge } = pkce();
    const v = await validateAuthorizeRequest({
      response_type: "code",
      client_id: CIMD,
      redirect_uri: CHATGPT_CB,
      code_challenge: challenge,
      code_challenge_method: "S256",
    });
    if ("error" in v) throw new Error(v.error);
    expect(v.appName).toBe("ChatGPT");
    return { code: issueAuthCode(v.params, "jane@ramprate.com"), verifier };
  }

  const exchange = async (
    code: string,
    verifier: string,
    extra: Record<string, string>,
  ) =>
    exchangeToken(
      {
        grant_type: "authorization_code",
        code,
        code_verifier: verifier,
        redirect_uri: CHATGPT_CB,
        client_id: CIMD,
        client_assertion_type:
          "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        ...extra,
      },
      { origin: "https://ramprate.com" },
    );

  it("full sign-in with a valid signed assertion works and identifies the person", async () => {
    const { code, verifier } = await signInCode();
    const res = await exchange(code, verifier, {
      client_assertion: await assertion(),
    });
    expect(res.ok).toBe(true);
    if (res.ok)
      expect(authenticateMcpBearer(res.body.access_token)?.name).toBe("Jane");
  });

  it("refresh also needs a valid assertion", async () => {
    const { code, verifier } = await signInCode();
    const first = await exchange(code, verifier, {
      client_assertion: await assertion(),
    });
    if (!first.ok) throw new Error("setup");
    const base = {
      grant_type: "refresh_token",
      refresh_token: first.body.refresh_token,
      client_id: CIMD,
      client_assertion_type:
        "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    };
    expect(
      (await exchangeToken(base, { origin: "https://ramprate.com" })).ok,
    ).toBe(false);
    expect(
      (
        await exchangeToken(
          { ...base, client_assertion: await assertion() },
          { origin: "https://ramprate.com" },
        )
      ).ok,
    ).toBe(true);
  });

  it("rejects missing, forged, wrong-audience, expired or wrong-issuer assertions", async () => {
    const { code, verifier } = await signInCode();
    const good = await assertion();
    const forged =
      good.slice(0, -4) + (good.endsWith("AAAA") ? "BBBB" : "AAAA");
    for (const bad of [
      "",
      forged,
      await assertion({ aud: "https://evil.example/token" }),
      await assertion({ exp: Math.floor(Date.now() / 1000) - 3600 }),
      await assertion({
        iss: "https://evil.example",
        sub: "https://evil.example",
      }),
      await assertion({}, "unknown-kid"),
    ]) {
      expect(
        (await exchange(code, verifier, bad ? { client_assertion: bad } : {}))
          .ok,
      ).toBe(false);
    }
  });

  it("only trusts client documents from ChatGPT/Claude hosts, with matching id and allowed callbacks", async () => {
    const { resolveClient } = await import("@/lib/admin/mcp-oauth");
    expect(await resolveClient("https://evil.example/client.json")).toBeNull();
    expect(await resolveClient(CIMD)).not.toBeNull();

    const { clearRemoteClientCachesForTests } =
      await import("@/lib/admin/mcp-oauth");
    clearRemoteClientCachesForTests();
    docOverride = {
      client_id: "https://chatgpt.com/other.json",
      redirect_uris: [CHATGPT_CB],
    };
    expect(await resolveClient(CIMD)).toBeNull();

    clearRemoteClientCachesForTests();
    docOverride = {
      client_id: CIMD,
      redirect_uris: ["https://evil.example/cb"],
    };
    expect(await resolveClient(CIMD)).toBeNull();
  });
});
