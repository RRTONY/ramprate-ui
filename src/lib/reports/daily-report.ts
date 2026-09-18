import { getReportableRoutes, routeUrl, type RegisteredRoute } from "@/lib/registered-urls";
import {
  DATE_RANGES,
  getPageMetrics,
  getTrafficSources,
  getDeviceBrowserSummary,
  getRegionSummary,
  type PageMetrics,
  type TrafficSourceRow,
  type DeviceBrowserRow,
  type RegionRow,
} from "./ga4-client";
import { checkAllPages, type PageUptimeResult } from "./uptime-check";
import {
  detectTrafficDropAlerts,
  detectBrokenElementAlerts,
  type TrafficAlert,
} from "./alerts";
import { REPORT_RECIPIENTS } from "./constants";
import { sendEmail } from "@/lib/admin/resend-client";
import { writeClient } from "@/lib/sanity/write-client";
import {
  badge,
  escapeHtml,
  renderNotConnectedNote,
  renderSection,
  renderTable,
  wrapEmail,
} from "./email-template";

const NOT_CONNECTED = "Analytics not connected. Traffic cannot yet be verified.";

function normalizePath(pagePath: string): string {
  const path = pagePath.split("?")[0];
  return path || "/";
}

function toMetricsMap(rows: PageMetrics[]): Map<string, PageMetrics> {
  const map = new Map<string, PageMetrics>();
  for (const row of rows) {
    const path = normalizePath(row.pagePath);
    const existing = map.get(path);
    if (existing) {
      existing.pageviews += row.pageviews;
      existing.uniqueVisitors += row.uniqueVisitors;
      existing.sessions += row.sessions;
    } else {
      map.set(path, { ...row, pagePath: path });
    }
  }
  return map;
}

function toSessionsMap(rows: PageMetrics[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of rows) {
    const path = normalizePath(row.pagePath);
    map.set(path, (map.get(path) ?? 0) + row.sessions);
  }
  return map;
}

function pctChange(current: number, previous: number): string {
  if (previous === 0) return "n/a";
  return `${(((current - previous) / previous) * 100).toFixed(0)}%`;
}

interface Ga4Data {
  today: Map<string, PageMetrics>;
  prevDay: Map<string, number>;
  sameDayLastWeek: Map<string, number>;
  sources: TrafficSourceRow[];
  devices: DeviceBrowserRow[];
  regions: RegionRow[];
}

async function fetchGa4Data(): Promise<Ga4Data | null> {
  try {
    const [todayRows, prevDayRows, sameDayLastWeekRows, sources, devices, regions] =
      await Promise.all([
        getPageMetrics(DATE_RANGES.yesterday),
        getPageMetrics(DATE_RANGES.dayBeforeYesterday),
        getPageMetrics(DATE_RANGES.sameDayLastWeek),
        getTrafficSources(DATE_RANGES.yesterday),
        getDeviceBrowserSummary(DATE_RANGES.yesterday),
        getRegionSummary(DATE_RANGES.yesterday),
      ]);
    return {
      today: toMetricsMap(todayRows),
      prevDay: toSessionsMap(prevDayRows),
      sameDayLastWeek: toSessionsMap(sameDayLastWeekRows),
      sources,
      devices,
      regions,
    };
  } catch (err) {
    console.error("daily-report: GA4 fetch failed:", err);
    return null;
  }
}

function buildDailyBody(
  routes: RegisteredRoute[],
  ga4: Ga4Data | null,
  uptime: PageUptimeResult[],
  alerts: TrafficAlert[],
): string {
  const lines: string[] = [];
  const dateLabel = new Date().toISOString().slice(0, 10);

  lines.push("RampRate Daily Traffic Report");
  lines.push(`Covering the prior 24 hours, reported ${dateLabel} 7:00am Pacific`);
  lines.push("");

  lines.push("Per-URL summary (pageviews / unique visitors / sessions):");
  if (!ga4) {
    lines.push(`  ${NOT_CONNECTED}`);
  } else {
    for (const route of routes) {
      const m = ga4.today.get(route.path);
      const pv = m?.pageviews ?? 0;
      const uv = m?.uniqueVisitors ?? 0;
      const sess = m?.sessions ?? 0;
      const prev = ga4.prevDay.get(route.path) ?? 0;
      const lastWeek = ga4.sameDayLastWeek.get(route.path) ?? 0;
      const uptimeResult = uptime.find((u) => u.path === route.path);
      const status = uptimeResult?.ok
        ? `OK (${uptimeResult.latencyMs}ms)`
        : "DOWN";
      lines.push(
        `  ${route.path}: ${pv} pv / ${uv} uv / ${sess} sessions | vs prev day: ${pctChange(sess, prev)} | vs same day last week: ${pctChange(sess, lastWeek)} | ${status}`,
      );
    }
  }
  lines.push("");

  lines.push("Referrers and traffic sources (sitewide, sessions):");
  if (!ga4) {
    lines.push(`  ${NOT_CONNECTED}`);
  } else if (ga4.sources.length === 0) {
    lines.push("  No sessions recorded.");
  } else {
    for (const s of ga4.sources.slice(0, 10)) {
      lines.push(`  ${s.channel} / ${s.source}: ${s.sessions}`);
    }
  }
  lines.push("");

  lines.push("Device / browser summary (sitewide, sessions):");
  if (!ga4) {
    lines.push(`  ${NOT_CONNECTED}`);
  } else if (ga4.devices.length === 0) {
    lines.push("  No sessions recorded.");
  } else {
    for (const d of ga4.devices.slice(0, 10)) {
      lines.push(`  ${d.deviceCategory} / ${d.browser}: ${d.sessions}`);
    }
  }
  lines.push("");

  lines.push("Region summary (sitewide, sessions):");
  if (!ga4) {
    lines.push(`  ${NOT_CONNECTED}`);
  } else if (ga4.regions.length === 0) {
    lines.push("  No sessions recorded.");
  } else {
    for (const r of ga4.regions.slice(0, 10)) {
      lines.push(`  ${r.country} / ${r.region || "unknown"}: ${r.sessions}`);
    }
  }
  lines.push("");

  lines.push(
    "Form starts and completions, prototype generation and copy-button use, conversion rate:",
  );
  lines.push(`  ${NOT_CONNECTED}`);
  lines.push(
    "  (Custom event tracking for these was added in this same change; results will populate once at least a day of data has been collected.)",
  );
  lines.push("");

  lines.push("Errors, broken assets, and latency:");
  const brokenPages = uptime.filter((u) => !u.ok || u.brokenAssets.length > 0);
  if (brokenPages.length === 0) {
    lines.push("  No broken pages or assets detected.");
  } else {
    for (const p of brokenPages) {
      if (!p.ok) {
        lines.push(
          `  ${p.path}: page request failed${p.status ? ` (HTTP ${p.status})` : ""}${p.error ? ` - ${p.error}` : ""}`,
        );
      }
      if (p.brokenAssets.length > 0) {
        lines.push(
          `  ${p.path}: ${p.brokenAssets.length} broken asset(s): ${p.brokenAssets.map((a) => a.url).join(", ")}`,
        );
      }
    }
  }
  lines.push("");

  if (alerts.length > 0) {
    lines.push("ALERTS:");
    for (const a of alerts) lines.push(`  [${a.severity.toUpperCase()}] ${a.message}`);
    lines.push("");
  }

  lines.push(`Generated at ${new Date().toISOString()}`);
  return lines.join("\n");
}

function changeBadge(pctLabel: string): string {
  if (pctLabel === "n/a") return badge("n/a", "neutral");
  const value = parseInt(pctLabel, 10);
  if (value <= -60) return badge(pctLabel, "critical");
  if (value <= -25) return badge(pctLabel, "warn");
  return badge(pctLabel, "ok");
}

function buildDailyHtml(
  routes: RegisteredRoute[],
  ga4: Ga4Data | null,
  uptime: PageUptimeResult[],
  alerts: TrafficAlert[],
): string {
  const dateLabel = new Date().toISOString().slice(0, 10);
  const sections: string[] = [];

  if (alerts.length > 0) {
    const rows = alerts.map((a) => [
      badge(a.severity.replace("_", " ").toUpperCase(), a.severity === "critical" ? "critical" : a.severity === "broken" ? "critical" : "warn"),
      escapeHtml(a.message),
    ]);
    sections.push(renderSection("Alerts", renderTable(["Severity", "Detail"], rows)));
  }

  if (!ga4) {
    sections.push(renderSection("Per-URL summary", renderNotConnectedNote()));
  } else {
    const withActivity: { route: RegisteredRoute; sessions: number; pv: number; uv: number; prev: number; lastWeek: number; up: PageUptimeResult | undefined }[] = [];
    const noActivity: RegisteredRoute[] = [];
    for (const route of routes) {
      const m = ga4.today.get(route.path);
      const sessions = m?.sessions ?? 0;
      const prev = ga4.prevDay.get(route.path) ?? 0;
      const lastWeek = ga4.sameDayLastWeek.get(route.path) ?? 0;
      const up = uptime.find((u) => u.path === route.path);
      if (sessions > 0 || prev > 0 || lastWeek > 0) {
        withActivity.push({ route, sessions, pv: m?.pageviews ?? 0, uv: m?.uniqueVisitors ?? 0, prev, lastWeek, up });
      } else {
        noActivity.push(route);
      }
    }
    withActivity.sort((a, b) => b.sessions - a.sessions);

    const rows = withActivity.map(({ route, sessions, pv, uv, prev, lastWeek, up }) => [
      `<strong>${escapeHtml(route.path)}</strong>`,
      escapeHtml(pv),
      escapeHtml(uv),
      escapeHtml(sessions),
      changeBadge(pctChange(sessions, prev)),
      changeBadge(pctChange(sessions, lastWeek)),
      up?.ok ? badge(`OK ${up.latencyMs}ms`, "ok") : badge("DOWN", "critical"),
    ]);
    sections.push(
      renderSection(
        "Per-URL summary (pages with recorded activity)",
        renderTable(
          ["URL", "Pageviews", "Unique visitors", "Sessions", "vs prev day", "vs same day last wk", "Status"],
          rows,
        ),
      ),
    );

    if (noActivity.length > 0) {
      sections.push(
        renderSection(
          `No traffic recorded (${noActivity.length} URLs)`,
          `<p style="font-family:Arial,Helvetica,sans-serif; font-size:12px; color:#6b5e52; line-height:1.6;">${noActivity.map((r) => escapeHtml(r.path)).join(", ")}</p>`,
        ),
      );
    }
  }

  sections.push(
    renderSection(
      "Referrers and traffic sources (sitewide)",
      ga4
        ? renderTable(
            ["Channel", "Source", "Sessions"],
            ga4.sources.slice(0, 10).map((s) => [escapeHtml(s.channel), escapeHtml(s.source), escapeHtml(s.sessions)]),
          )
        : renderNotConnectedNote(),
    ),
  );

  sections.push(
    renderSection(
      "Device / browser summary (sitewide)",
      ga4
        ? renderTable(
            ["Device", "Browser", "Sessions"],
            ga4.devices.slice(0, 10).map((d) => [escapeHtml(d.deviceCategory), escapeHtml(d.browser), escapeHtml(d.sessions)]),
          )
        : renderNotConnectedNote(),
    ),
  );

  sections.push(
    renderSection(
      "Region summary (sitewide)",
      ga4
        ? renderTable(
            ["Country", "Region", "Sessions"],
            ga4.regions.slice(0, 10).map((r) => [escapeHtml(r.country), escapeHtml(r.region || "unknown"), escapeHtml(r.sessions)]),
          )
        : renderNotConnectedNote(),
    ),
  );

  sections.push(
    renderSection(
      "Form starts / completions, prototype generation, copy-button use, conversion rate",
      renderNotConnectedNote() +
        `<p style="font-family:Arial,Helvetica,sans-serif; font-size:12px; color:#6b5e52;">Custom event tracking for these was added in this same change; results populate once at least a day of data has been collected.</p>`,
    ),
  );

  const brokenPages = uptime.filter((u) => !u.ok || u.brokenAssets.length > 0);
  sections.push(
    renderSection(
      "Errors, broken assets, and latency",
      brokenPages.length === 0
        ? `<p style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#1e7a3d;">No broken pages or assets detected.</p>`
        : renderTable(
            ["URL", "Issue"],
            brokenPages.map((p) => [
              `<strong>${escapeHtml(p.path)}</strong>`,
              !p.ok
                ? `Page request failed${p.status ? ` (HTTP ${p.status})` : ""}${p.error ? `: ${escapeHtml(p.error)}` : ""}`
                : `${p.brokenAssets.length} broken asset(s)`,
            ]),
          ),
    ),
  );

  return wrapEmail(
    "Daily Traffic Report",
    `Covering the prior 24 hours, reported ${dateLabel} 7:00am Pacific`,
    sections.join(""),
  );
}

export interface DailyReportResult {
  body: string;
  alerts: TrafficAlert[];
  emailId: string;
  reportRunId: string;
}

export async function generateDailyReport(): Promise<DailyReportResult> {
  const routes = await getReportableRoutes();
  const ga4 = await fetchGa4Data();
  const uptime = await checkAllPages(
    routes.map((r) => ({ path: r.path, url: routeUrl(r.path) })),
  );

  // Restrict to our own registered routes - GA4's raw pagePath dimension
  // includes every path it has ever recorded (old WordPress-migration URLs,
  // removed pages, etc.), which produced dozens of false "zero traffic"
  // alerts for pages that were never actually part of the current site.
  const trafficAlerts = ga4
    ? detectTrafficDropAlerts(
        new Map(routes.map((r) => [r.path, ga4.today.get(r.path)?.sessions ?? 0])),
        new Map(routes.map((r) => [r.path, ga4.sameDayLastWeek.get(r.path) ?? 0])),
      )
    : [];
  const brokenAlerts = detectBrokenElementAlerts(uptime);
  const alerts = [...trafficAlerts, ...brokenAlerts];

  const body = buildDailyBody(routes, ga4, uptime, alerts);
  const html = buildDailyHtml(routes, ga4, uptime, alerts);

  const { id: emailId } = await sendEmail({
    to: REPORT_RECIPIENTS,
    subject: `RampRate Daily Traffic Report - ${new Date().toISOString().slice(0, 10)}`,
    text: body,
    html,
  });

  const reportRunDoc = await writeClient.create({
    _type: "reportRun",
    type: "daily",
    periodLabel: "yesterday",
    generatedAt: new Date().toISOString(),
    summary: body,
    alertsTriggered: alerts.map((a) => a.key),
    emailedTo: REPORT_RECIPIENTS,
    emailIds: [emailId],
  });

  return { body, alerts, emailId, reportRunId: reportRunDoc._id };
}
