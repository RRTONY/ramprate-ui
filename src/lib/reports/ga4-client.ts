import { createSign } from "crypto";

// Hand-rolled GA4 Data API REST client - no `googleapis`/`@google-analytics/data`
// dependency, matching this repo's existing convention of raw `fetch` clients
// over SDKs (see src/lib/admin/resend-client.ts, src/lib/admin/github-client.ts).
// Authenticates as a Google service account via a self-signed JWT exchanged for
// an OAuth2 access token - no service-account library needed since RS256 signing
// is just Node's built-in `crypto`.

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const GA4_API_BASE = "https://analyticsdata.googleapis.com/v1beta";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;

function base64url(input: Buffer | string): string {
  return (typeof input === "string" ? Buffer.from(input) : input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function getServiceAccountCredentials(): {
  clientEmail: string;
  privateKey: string;
} {
  const clientEmail = process.env.GOOGLE_GA_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_GA_PRIVATE_KEY;
  if (!clientEmail || !privateKeyRaw) {
    throw new Error(
      "GOOGLE_GA_CLIENT_EMAIL / GOOGLE_GA_PRIVATE_KEY is not configured",
    );
  }
  // .env stores the PEM's newlines escaped as literal "\n" - restore them.
  return { clientEmail, privateKey: privateKeyRaw.replace(/\\n/g, "\n") };
}

function getPropertyId(): string {
  const id = process.env.GA4_PROPERTY_ID_RAMPRATE;
  if (!id) throw new Error("GA4_PROPERTY_ID_RAMPRATE is not configured");
  return id;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.accessToken;
  }

  const { clientEmail, privateKey } = getServiceAccountCredentials();
  const now = Math.floor(Date.now() / 1000);

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claimSet = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: SCOPE,
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    }),
  );
  const unsigned = `${header}.${claimSet}`;
  const signature = base64url(
    createSign("RSA-SHA256").update(unsigned).sign(privateKey),
  );
  const assertion = `${unsigned}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data?.error_description === "string"
        ? data.error_description
        : `Google OAuth token exchange failed (${res.status})`,
    );
  }

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.accessToken;
}

// GA4 accepts relative date keywords directly ("today", "yesterday",
// "NdaysAgo") - using these instead of computing calendar dates ourselves
// avoids guessing the GA4 property's configured reporting timezone.
export interface DateRange {
  startDate: string;
  endDate: string;
}

export const DATE_RANGES = {
  yesterday: { startDate: "yesterday", endDate: "yesterday" },
  dayBeforeYesterday: { startDate: "2daysAgo", endDate: "2daysAgo" },
  sameDayLastWeek: { startDate: "8daysAgo", endDate: "8daysAgo" },
  trailing7Days: { startDate: "7daysAgo", endDate: "yesterday" },
  priorTrailing7Days: { startDate: "15daysAgo", endDate: "8daysAgo" },
} satisfies Record<string, DateRange>;

export interface GA4ReportRequest {
  dateRanges: DateRange[];
  dimensions?: string[];
  metrics: string[];
  limit?: number;
}

export interface GA4ReportRow {
  dimensions: string[];
  metrics: number[];
}

export interface GA4ReportResult {
  dimensionNames: string[];
  metricNames: string[];
  rows: GA4ReportRow[];
}

export async function runReport(
  req: GA4ReportRequest,
): Promise<GA4ReportResult> {
  const accessToken = await getAccessToken();
  const propertyId = getPropertyId();

  const res = await fetch(
    `${GA4_API_BASE}/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: req.dateRanges,
        dimensions: (req.dimensions ?? []).map((name) => ({ name })),
        metrics: req.metrics.map((name) => ({ name })),
        ...(req.limit ? { limit: String(req.limit) } : {}),
      }),
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

  const dimensionNames: string[] = (data.dimensionHeaders ?? []).map(
    (h: { name: string }) => h.name,
  );
  const metricNames: string[] = (data.metricHeaders ?? []).map(
    (h: { name: string }) => h.name,
  );
  const rows: GA4ReportRow[] = (data.rows ?? []).map(
    (row: {
      dimensionValues?: { value: string }[];
      metricValues?: { value: string }[];
    }) => ({
      dimensions: (row.dimensionValues ?? []).map((v) => v.value),
      metrics: (row.metricValues ?? []).map((v) => Number(v.value)),
    }),
  );

  return { dimensionNames, metricNames, rows };
}

export interface PageMetrics {
  pagePath: string;
  pageviews: number;
  uniqueVisitors: number;
  sessions: number;
}

export async function getPageMetrics(
  dateRange: DateRange,
): Promise<PageMetrics[]> {
  const result = await runReport({
    dateRanges: [dateRange],
    dimensions: ["pagePath"],
    metrics: ["screenPageViews", "totalUsers", "sessions"],
    limit: 250,
  });
  return result.rows.map((row) => ({
    pagePath: row.dimensions[0],
    pageviews: row.metrics[0] ?? 0,
    uniqueVisitors: row.metrics[1] ?? 0,
    sessions: row.metrics[2] ?? 0,
  }));
}

export interface TrafficSourceRow {
  channel: string;
  source: string;
  sessions: number;
}

export async function getTrafficSources(
  dateRange: DateRange,
): Promise<TrafficSourceRow[]> {
  const result = await runReport({
    dateRanges: [dateRange],
    dimensions: ["sessionDefaultChannelGroup", "sessionSource"],
    metrics: ["sessions"],
    limit: 25,
  });
  return result.rows
    .map((row) => ({
      channel: row.dimensions[0],
      source: row.dimensions[1],
      sessions: row.metrics[0] ?? 0,
    }))
    .sort((a, b) => b.sessions - a.sessions);
}

export interface DeviceBrowserRow {
  deviceCategory: string;
  browser: string;
  sessions: number;
}

export async function getDeviceBrowserSummary(
  dateRange: DateRange,
): Promise<DeviceBrowserRow[]> {
  const result = await runReport({
    dateRanges: [dateRange],
    dimensions: ["deviceCategory", "browser"],
    metrics: ["sessions"],
    limit: 25,
  });
  return result.rows
    .map((row) => ({
      deviceCategory: row.dimensions[0],
      browser: row.dimensions[1],
      sessions: row.metrics[0] ?? 0,
    }))
    .sort((a, b) => b.sessions - a.sessions);
}

export interface RegionRow {
  country: string;
  region: string;
  sessions: number;
}

export async function getRegionSummary(
  dateRange: DateRange,
): Promise<RegionRow[]> {
  const result = await runReport({
    dateRanges: [dateRange],
    dimensions: ["country", "region"],
    metrics: ["sessions"],
    limit: 25,
  });
  return result.rows
    .map((row) => ({
      country: row.dimensions[0],
      region: row.dimensions[1],
      sessions: row.metrics[0] ?? 0,
    }))
    .sort((a, b) => b.sessions - a.sessions);
}
