const SLACK_API_BASE = "https://slack.com/api";

export interface SendSlackMessageInput {
  channel: string;
  text: string;
}

// Uses a Slack bot token + chat.postMessage (Web API), not an incoming
// webhook - matches the bot already set up for #supplier-intake-alerts
// elsewhere in this project. Same gotcha applies here: a valid
// SLACK_BOT_TOKEN is not enough on its own - the bot must also be invited
// into the target channel (channel → Integrations → Add apps, or
// `/invite @<bot-name>`), or this fails with a `not_in_channel` error that
// looks identical to a bad token from the response shape alone.
export async function sendSlackMessage(
  input: SendSlackMessageInput,
): Promise<void> {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) throw new Error("SLACK_BOT_TOKEN is not configured");

  const res = await fetch(`${SLACK_API_BASE}/chat.postMessage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ channel: input.channel, text: input.text }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : `Slack API error (${res.status})`,
    );
  }
}
