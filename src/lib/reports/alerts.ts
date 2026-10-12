import { client } from "@/lib/sanity/client";
import { ALERT_THRESHOLDS } from "./constants";
import type { PageUptimeResult } from "./uptime-check";

export type AlertSeverity =
  | "investigate"
  | "urgent"
  | "critical"
  | "zero_traffic"
  | "broken";

export interface TrafficAlert {
  key: string; // dedup key, e.g. "traffic-drop-critical:/kumbaya"
  severity: AlertSeverity;
  message: string;
}

// A traffic dip is a visibility note, not a site error, so it is worded and
// coloured calmly. Only "broken" (page or asset failing to load) is a real
// problem shown in red.
export function isSiteError(alert: TrafficAlert): boolean {
  return alert.severity === "broken";
}

export function alertLabel(alert: TrafficAlert): string {
  if (alert.severity === "broken") return "Broken";
  if (alert.severity === "zero_traffic") return "No visits yet";
  return "Lower traffic";
}

export function alertTone(alert: TrafficAlert): "critical" | "neutral" {
  return isSiteError(alert) ? "critical" : "neutral";
}

// Compares trailing sessions-per-path against sessions-per-path from the
// same point one week earlier (a same-weekday baseline controls for normal
// weekly traffic rhythm better than yesterday-vs-today would).
export function detectTrafficDropAlerts(
  currentByPath: Map<string, number>,
  previousByPath: Map<string, number>,
): TrafficAlert[] {
  const alerts: TrafficAlert[] = [];
  for (const [path, previous] of previousByPath) {
    if (previous === 0) continue; // no baseline to compare against
    const current = currentByPath.get(path) ?? 0;
    const dropFraction = (previous - current) / previous;
    const dipMessage = `${path}: fewer visits than usual, ${current} vs ${previous} at the same point last week (down ${(dropFraction * 100).toFixed(0)}%).`;

    if (current === 0) {
      alerts.push({
        key: `zero-traffic:${path}`,
        severity: "zero_traffic",
        message: `${path}: no visits yet today (had ${previous} at the same point last week). The page is working, it just had fewer visitors.`,
      });
      continue;
    }

    if (dropFraction >= ALERT_THRESHOLDS.critical) {
      alerts.push({
        key: `traffic-drop-critical:${path}`,
        severity: "critical",
        message: dipMessage,
      });
    } else if (dropFraction >= ALERT_THRESHOLDS.urgent) {
      alerts.push({
        key: `traffic-drop-urgent:${path}`,
        severity: "urgent",
        message: dipMessage,
      });
    } else if (dropFraction >= ALERT_THRESHOLDS.investigate) {
      alerts.push({
        key: `traffic-drop-investigate:${path}`,
        severity: "investigate",
        message: dipMessage,
      });
    }
  }
  return alerts;
}

export function detectBrokenElementAlerts(
  uptimeResults: PageUptimeResult[],
): TrafficAlert[] {
  const alerts: TrafficAlert[] = [];
  for (const result of uptimeResults) {
    if (!result.ok) {
      alerts.push({
        key: `broken-page:${result.path}`,
        severity: "broken",
        message: `${result.path}: page request failed${
          result.status ? ` (HTTP ${result.status})` : ""
        }${result.error ? ` - ${result.error}` : ""}.`,
      });
    }
    if (result.brokenAssets.length > 0) {
      alerts.push({
        key: `broken-asset:${result.path}`,
        severity: "broken",
        message: `${result.path}: ${result.brokenAssets.length} broken asset(s) - ${result.brokenAssets
          .map((a) => a.url)
          .join(", ")}.`,
      });
    }
  }
  return alerts;
}

// Dedup: has this exact alert key already fired today? Prevents the hourly
// alert-check function from re-emailing the same unresolved issue every
// hour. Keyed by calendar day in UTC (good enough for "once per day" dedup;
// doesn't need to be Pacific-exact).
export async function getAlreadyAlertedKeysToday(): Promise<Set<string>> {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const docs = await client.fetch<{ alertsTriggered?: string[] }[]>(
    `*[_type == "reportRun" && type == "alert" && generatedAt >= $todayStart]{alertsTriggered}`,
    { todayStart: todayStart.toISOString() },
  );
  const keys = new Set<string>();
  for (const doc of docs) {
    for (const key of doc.alertsTriggered ?? []) keys.add(key);
  }
  return keys;
}
