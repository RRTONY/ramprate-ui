import { describe, expect, it } from "vitest";

const timeoutMs = 20_000;

async function externalRequest(url: string, init?: RequestInit) {
  return fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
}

describe("retained runtime service configuration", () => {
  const externalServicesEnabled =
    process.env.RUN_EXTERNAL_SERVICE_CHECKS === "true";

  it.runIf(externalServicesEnabled)("reaches configured Google Sheet delivery endpoints without submitting data", async () => {
    const endpoints = [
      process.env.GOOGLE_APPS_SCRIPT_URL,
      process.env.ENGAGEMENT_INTAKE_SCRIPT_URL,
    ].filter((endpoint): endpoint is string => Boolean(endpoint));
    expect(endpoints).toHaveLength(2);

    const responses = await Promise.all(
      endpoints.map((endpoint) => externalRequest(endpoint, { method: "GET" })),
    );
    responses.forEach((response) => expect(response.status).toBeLessThan(500));
  }, 30_000);

  it.runIf(externalServicesEnabled)("authenticates retained service integrations through read-only endpoints", async () => {
    const [github, clickup, resend] = await Promise.all([
      externalRequest("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ""}`,
          Accept: "application/vnd.github+json",
        },
      }),
      externalRequest("https://api.clickup.com/api/v2/user", {
        headers: { Authorization: process.env.CLICKUP_API_TOKEN ?? "" },
      }),
      externalRequest("https://api.resend.com/domains?limit=1", {
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY ?? ""}` },
      }),
    ]);

    expect(github.status).toBe(200);
    expect(clickup.status).toBe(200);
    expect(resend.status).toBe(200);
  }, 30_000);

  it("contains syntactically usable analytics and server access-control settings", () => {
    expect(process.env.GA4_PROPERTY_ID_RAMPRATE).toMatch(/^\d+$/);
    expect(process.env.GOOGLE_GA_CLIENT_EMAIL).toMatch(/^[^\s@]+@[^\s@]+$/);
    expect(process.env.GOOGLE_GA_PRIVATE_KEY).toMatch(
      /-----BEGIN\s*PRIVATE\s*KEY-----/,
    );
    expect(process.env.MCP_ADMIN_TOKEN?.length).toBeGreaterThanOrEqual(24);
    expect(process.env.PORTAL_AUTH_SECRET?.length).toBeGreaterThanOrEqual(24);
    expect(process.env.NEXT_PUBLIC_GA_ID).toMatch(/^G-[A-Z0-9]+$/);
  });
});
