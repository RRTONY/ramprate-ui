// Runs every hour, no gating - dedup against same-day-already-alerted keys
// happens server-side in src/lib/reports/alerts.ts. This is the practical
// ceiling for "notify Tony immediately" on a 25/40/60% traffic drop or a
// broken form/CTA/image/script/redirect, since GA4's standard Data API has
// its own processing latency and can't be polled meaningfully faster.
export default async () => {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return new Response("CRON_SECRET is not configured", { status: 500 });
  }
  const baseUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || "https://ramprate.com";

  const res = await fetch(`${baseUrl}/api/cron/alert-check`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const body = await res.text();
  console.log(`hourly-alert-check cron: ${res.status} ${body}`);
  return new Response(body, { status: res.status });
};

export const config = {
  schedule: "0 * * * *",
};
