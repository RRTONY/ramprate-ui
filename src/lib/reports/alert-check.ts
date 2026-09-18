import { getReportableRoutes, routeUrl } from "@/lib/registered-urls";
import { DATE_RANGES, getPageMetrics } from "./ga4-client";
import { checkAllPages } from "./uptime-check";
import {
  detectTrafficDropAlerts,
  detectBrokenElementAlerts,
  getAlreadyAlertedKeysToday,
  type TrafficAlert,
} from "./alerts";
import { REPORT_RECIPIENTS } from "./constants";
import { sendEmail } from "@/lib/admin/resend-client";
import { writeClient } from "@/lib/sanity/write-client";
import { badge, escapeHtml, renderSection, renderTable, wrapEmail } from "./email-template";

function normalizePath(pagePath: string): string {
  return pagePath.split("?")[0] || "/";
}

function toSessionsMap(rows: { pagePath: string; sessions: number }[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of rows) {
    const path = normalizePath(row.pagePath);
    map.set(path, (map.get(path) ?? 0) + row.sessions);
  }
  return map;
}

export interface AlertCheckResult {
  alertsFired: TrafficAlert[];
  emailId?: string;
  reportRunId?: string;
}

// Run hourly. GA4's standard Data API has processing latency, so this is the
// practical ceiling for "notify Tony immediately" - not literal real-time.
export async function runAlertCheck(): Promise<AlertCheckResult> {
  const routes = await getReportableRoutes();

  let trafficAlerts: TrafficAlert[] = [];
  try {
    const [todayRows, sameDayLastWeekRows] = await Promise.all([
      getPageMetrics(DATE_RANGES.yesterday),
      getPageMetrics(DATE_RANGES.sameDayLastWeek),
    ]);
    // Restrict to our own registered routes - see daily-report.ts for why
    // (GA4's raw pagePath list includes long-dead URLs).
    const todayByPath = toSessionsMap(todayRows);
    const lastWeekByPath = toSessionsMap(sameDayLastWeekRows);
    trafficAlerts = detectTrafficDropAlerts(
      new Map(routes.map((r) => [r.path, todayByPath.get(r.path) ?? 0])),
      new Map(routes.map((r) => [r.path, lastWeekByPath.get(r.path) ?? 0])),
    );
  } catch (err) {
    console.error("alert-check: GA4 fetch failed:", err);
  }

  const uptime = await checkAllPages(
    routes.map((r) => ({ path: r.path, url: routeUrl(r.path) })),
  );
  const brokenAlerts = detectBrokenElementAlerts(uptime);

  const allAlerts = [...trafficAlerts, ...brokenAlerts];
  if (allAlerts.length === 0) return { alertsFired: [] };

  const alreadyAlerted = await getAlreadyAlertedKeysToday();
  const newAlerts = allAlerts.filter((a) => !alreadyAlerted.has(a.key));
  if (newAlerts.length === 0) return { alertsFired: [] };

  const body = [
    "RampRate Traffic Alert",
    "",
    ...newAlerts.map((a) => `[${a.severity.toUpperCase()}] ${a.message}`),
    "",
    `Generated at ${new Date().toISOString()}`,
  ].join("\n");

  const html = wrapEmail(
    "Traffic Alert",
    `${newAlerts.length} issue(s) detected`,
    renderSection(
      "Alerts",
      renderTable(
        ["Severity", "Detail"],
        newAlerts.map((a) => [
          badge(a.severity.replace("_", " ").toUpperCase(), a.severity === "investigate" ? "warn" : "critical"),
          escapeHtml(a.message),
        ]),
      ),
    ),
  );

  const { id: emailId } = await sendEmail({
    to: REPORT_RECIPIENTS,
    subject: `RampRate Traffic Alert: ${newAlerts.length} issue(s) detected`,
    text: body,
    html,
  });

  const reportRunDoc = await writeClient.create({
    _type: "reportRun",
    type: "alert",
    periodLabel: "hourly check",
    generatedAt: new Date().toISOString(),
    summary: body,
    alertsTriggered: newAlerts.map((a) => a.key),
    emailedTo: REPORT_RECIPIENTS,
    emailIds: [emailId],
  });

  return { alertsFired: newAlerts, emailId, reportRunId: reportRunDoc._id };
}
