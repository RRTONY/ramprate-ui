// Cron expressions run in UTC and don't shift for DST, so instead of a fixed
// UTC time this runs hourly and checks the real Pacific wall-clock hour
// before doing anything - keeps "7:00am Pacific" accurate across the
// PST/PDT transition without maintaining two different cron expressions.
function currentPacificHour(): number {
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    hourCycle: "h23",
  }).format(new Date());
  return parseInt(formatted, 10);
}

export default async () => {
  if (currentPacificHour() !== 7) {
    return new Response("Not 7am Pacific - skipping.", { status: 200 });
  }

  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return new Response("CRON_SECRET is not configured", { status: 500 });
  }
  const baseUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || "https://ramprate.com";

  const res = await fetch(`${baseUrl}/api/cron/daily-report`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const body = await res.text();
  console.log(`daily-report cron: ${res.status} ${body}`);
  return new Response(body, { status: res.status });
};

export const config = {
  schedule: "0 * * * *",
};
