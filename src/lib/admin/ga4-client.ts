import { createSign } from "crypto";

// GA4's Data API only accepts a Google OAuth access token, and this repo has
// no OAuth user-consent flow (nor should it, for a server-to-server admin
// tool) - a service account JWT-bearer exchange is the standard headless
// path. Signed by hand with Node's built-in `crypto` (RS256) rather than
// pulling in `google-auth-library` - this is a two-step fetch, not worth a
// new dependency for.
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const GA4_API_BASE = "https://analyticsdata.googleapis.com/v1beta";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

function base64url(input: Buffer | string): string {
  return (typeof input === "string" ? Buffer.from(input) : input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function getCredentials(): { clientEmail: string; privateKey: string } {
  const clientEmail = process.env.GOOGLE_GA_CLIENT_EMAIL;
  const rawKey = process.env.GOOGLE_GA_PRIVATE_KEY;
  if (!clientEmail || !rawKey) {
    throw new Error(
      "GOOGLE_GA_CLIENT_EMAIL / GOOGLE_GA_PRIVATE_KEY is not configured",
    );
  }
  // Env vars can't hold real newlines - the key is stored with literal `\n`
  // escapes and needs unescaping before it's a valid PEM block.
  return { clientEmail, privateKey: rawKey.replace(/\\n/g, "\n") };
}

async function getAccessToken(): Promise<string> {
  const { clientEmail, privateKey } = getCredentials();
  const now = Math.floor(Date.now() / 1000);

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const signature = base64url(
    createSign("RSA-SHA256").update(`${header}.${claims}`).sign(privateKey),
  );
  const jwt = `${header}.${claims}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data?.error_description === "string"
        ? data.error_description
        : `Google token exchange failed (${res.status})`,
    );
  }
  return data.access_token as string;
}

interface RunReportResponse {
  dimensionHeaders?: Array<{ name: string }>;
  metricHeaders?: Array<{ name: string }>;
  rows?: Array<{
    dimensionValues?: Array<{ value: string }>;
    metricValues?: Array<{ value: string }>;
  }>;
}

async function runReport(
  propertyId: string,
  body: Record<string, unknown>,
): Promise<RunReportResponse> {
  const accessToken = await getAccessToken();
  const res = await fetch(
    `${GA4_API_BASE}/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data?.error?.message === "string"
        ? data.error.message
        : `GA4 Data API error (${res.status})`,
    );
  }
  return data as RunReportResponse;
}

export interface AnalyticsSummary {
  propertyId: string;
  days: number;
  totals: {
    sessions: number;
    activeUsers: number;
    screenPageViews: number;
  };
  topPages: Array<{ path: string; views: number }>;
}

export async function getAnalyticsSummary(days = 7): Promise<AnalyticsSummary> {
  const propertyId = process.env.GA4_PROPERTY_ID_RAMPRATE;
  if (!propertyId) {
    throw new Error("GA4_PROPERTY_ID_RAMPRATE is not configured");
  }
  const dateRanges = [{ startDate: `${days}daysAgo`, endDate: "today" }];

  const [totalsReport, pagesReport] = await Promise.all([
    runReport(propertyId, {
      dateRanges,
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" },
        { name: "screenPageViews" },
      ],
    }),
    runReport(propertyId, {
      dateRanges,
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: "10",
    }),
  ]);

  const totalsRow = totalsReport.rows?.[0]?.metricValues ?? [];
  const topPages = (pagesReport.rows ?? []).map((row) => ({
    path: row.dimensionValues?.[0]?.value ?? "",
    views: Number(row.metricValues?.[0]?.value ?? 0),
  }));

  return {
    propertyId,
    days,
    totals: {
      sessions: Number(totalsRow[0]?.value ?? 0),
      activeUsers: Number(totalsRow[1]?.value ?? 0),
      screenPageViews: Number(totalsRow[2]?.value ?? 0),
    },
    topPages,
  };
}
