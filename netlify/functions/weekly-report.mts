// See daily-report.mts for why this checks Pacific wall-clock time instead
// of relying on a fixed UTC cron expression.
function currentPacificHour(): number {
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    hourCycle: "h23",
  }).format(new Date());
  return parseInt(formatted, 10);
}

function currentPacificWeekday(): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
  }).format(new Date());
}

export default async () => {
  if (currentPacificWeekday() !== "Mon" || currentPacificHour() !== 7) {
    return new Response("Not Monday 7am Pacific - skipping.", { status: 200 });
  }

  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return new Response("CRON_SECRET is not configured", { status: 500 });
  }
  const baseUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || "https://ramprate.com";

  const res = await fetch(`${baseUrl}/api/cron/weekly-report`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const body = await res.text();
  console.log(`weekly-report cron: ${res.status} ${body}`);
  return new Response(body, { status: res.status });
};

export const config = {
  schedule: "0 * * * *",
};
