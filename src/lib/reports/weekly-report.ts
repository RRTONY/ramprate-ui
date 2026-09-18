import { getReportableRoutes, routeUrl, type RegisteredRoute } from "@/lib/registered-urls";
import {
  DATE_RANGES,
  getPageMetrics,
  getTrafficSources,
  type PageMetrics,
  type TrafficSourceRow,
} from "./ga4-client";
import { checkAllPages, type PageUptimeResult } from "./uptime-check";
import { detectBrokenElementAlerts, type TrafficAlert } from "./alerts";
import { REPORT_RECIPIENTS } from "./constants";
import { sendEmail } from "@/lib/admin/resend-client";
import { client } from "@/lib/sanity/client";
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
  return pagePath.split("?")[0] || "/";
}

function toSessionsMap(rows: PageMetrics[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of rows) {
    const path = normalizePath(row.pagePath);
    map.set(path, (map.get(path) ?? 0) + row.sessions);
  }
  return map;
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

interface Ga4WeeklyData {
  current: Map<string, number>;
  prior: Map<string, number>;
  sources: TrafficSourceRow[];
}

async function fetchGa4WeeklyData(): Promise<Ga4WeeklyData | null> {
  try {
    const [currentRows, priorRows, sources] = await Promise.all([
      getPageMetrics(DATE_RANGES.trailing7Days),
      getPageMetrics(DATE_RANGES.priorTrailing7Days),
      getTrafficSources(DATE_RANGES.trailing7Days),
    ]);
    return {
      current: toSessionsMap(currentRows),
      prior: toSessionsMap(priorRows),
      sources,
    };
  } catch (err) {
    console.error("weekly-report: GA4 fetch failed:", err);
    return null;
  }
}

async function getPreviousWeekRegisteredPaths(): Promise<string[] | null> {
  const doc = await client.fetch<{ registeredPaths?: string[] } | null>(
    `*[_type == "reportRun" && type == "weekly"] | order(generatedAt desc)[0]{registeredPaths}`,
  );
  return doc?.registeredPaths ?? null;
}

function recommendedOwner(alert: TrafficAlert): string {
  return alert.severity === "broken" ? "webmaster (web.master@ramprate.com)" : "Tony";
}

function buildWeeklyBody(
  routes: RegisteredRoute[],
  ga4: Ga4WeeklyData | null,
  uptime: PageUptimeResult[],
  brokenAlerts: TrafficAlert[],
  newPaths: string[] | null,
): string {
  const lines: string[] = [];
  const dateLabel = new Date().toISOString().slice(0, 10);

  lines.push("RampRate Weekly Traffic Report");
  lines.push(`Trailing 7 days vs prior 7 days, reported ${dateLabel} 7:00am Pacific (Monday)`);
  lines.push("");

  lines.push("Seven-day traffic by URL (sessions, week-over-week change):");
  const rows: { path: string; sessions: number; change: number | null }[] = [];
  if (!ga4) {
    lines.push(`  ${NOT_CONNECTED}`);
  } else {
    for (const route of routes) {
      const sessions = ga4.current.get(route.path) ?? 0;
      const prior = ga4.prior.get(route.path) ?? 0;
      rows.push({ path: route.path, sessions, change: pctChange(sessions, prior) });
    }
    for (const r of rows) {
      lines.push(
        `  ${r.path}: ${r.sessions} sessions | WoW: ${r.change === null ? "n/a" : `${r.change.toFixed(0)}%`}`,
      );
    }
  }
  lines.push("");

  if (ga4 && rows.length > 0) {
    const withChange = rows.filter((r) => r.change !== null) as {
      path: string;
      sessions: number;
      change: number;
    }[];
    const top = [...withChange].sort((a, b) => b.change - a.change).slice(0, 5);
    const declining = [...withChange]
      .sort((a, b) => a.change - b.change)
      .slice(0, 5)
      .filter((r) => r.change < 0);

    lines.push("Top URLs (largest WoW gain):");
    for (const r of top) lines.push(`  ${r.path}: +${r.change.toFixed(0)}%`);
    lines.push("");

    lines.push("Declining URLs (largest WoW drop):");
    if (declining.length === 0) {
      lines.push("  None.");
    } else {
      for (const r of declining) lines.push(`  ${r.path}: ${r.change.toFixed(0)}%`);
    }
    lines.push("");
  }

  lines.push("Sources (sitewide, sessions, trailing 7 days):");
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

  lines.push("Conversions (form completions, prototype generation, copy-button use):");
  lines.push(`  ${NOT_CONNECTED}`);
  lines.push("");

  lines.push("Errors (broken pages / assets, trailing check):");
  const brokenPages = uptime.filter((u) => !u.ok || u.brokenAssets.length > 0);
  if (brokenPages.length === 0) {
    lines.push("  No broken pages or assets detected at last check.");
  } else {
    for (const p of brokenPages) {
      if (!p.ok) {
        lines.push(
          `  ${p.path}: page request failed${p.status ? ` (HTTP ${p.status})` : ""}`,
        );
      }
      if (p.brokenAssets.length > 0) {
        lines.push(`  ${p.path}: ${p.brokenAssets.length} broken asset(s)`);
      }
    }
  }
  lines.push("");

  lines.push("New URLs since last week's report:");
  if (newPaths === null) {
    lines.push("  No prior weekly report to compare against (this is the first run).");
  } else {
    const currentPaths = new Set(routes.map((r) => r.path));
    const added = routes
      .map((r) => r.path)
      .filter((p) => !newPaths.includes(p));
    const removed = newPaths.filter((p) => !currentPaths.has(p));
    if (added.length === 0 && removed.length === 0) {
      lines.push("  None.");
    } else {
      if (added.length > 0) lines.push(`  Added: ${added.join(", ")}`);
      if (removed.length > 0) lines.push(`  Removed: ${removed.join(", ")}`);
    }
  }
  lines.push("");

  lines.push("Recommended actions:");
  if (brokenAlerts.length === 0) {
    lines.push("  No urgent action items from this week's data.");
  } else {
    for (const a of brokenAlerts) {
      lines.push(`  - ${a.message} (owner: ${recommendedOwner(a)})`);
    }
  }
  lines.push("");

  lines.push(`Generated at ${new Date().toISOString()}`);
  return lines.join("\n");
}

function wowBadge(change: number | null): string {
  if (change === null) return badge("n/a", "neutral");
  const label = `${change >= 0 ? "+" : ""}${change.toFixed(0)}%`;
  if (change <= -60) return badge(label, "critical");
  if (change <= -25) return badge(label, "warn");
  return badge(label, "ok");
}

function buildWeeklyHtml(
  routes: RegisteredRoute[],
  ga4: Ga4WeeklyData | null,
  uptime: PageUptimeResult[],
  brokenAlerts: TrafficAlert[],
  newPaths: string[] | null,
): string {
  const dateLabel = new Date().toISOString().slice(0, 10);
  const sections: string[] = [];

  if (!ga4) {
    sections.push(renderSection("Seven-day traffic by URL", renderNotConnectedNote()));
  } else {
    const rows = routes
      .map((route) => {
        const sessions = ga4.current.get(route.path) ?? 0;
        const prior = ga4.prior.get(route.path) ?? 0;
        return { path: route.path, sessions, change: pctChange(sessions, prior) };
      })
      .filter((r) => r.sessions > 0 || r.change !== null)
      .sort((a, b) => b.sessions - a.sessions);

    sections.push(
      renderSection(
        "Seven-day traffic by URL",
        renderTable(
          ["URL", "Sessions (7d)", "WoW change"],
          rows.map((r) => [`<strong>${escapeHtml(r.path)}</strong>`, escapeHtml(r.sessions), wowBadge(r.change)]),
        ),
      ),
    );

    const withChange = rows.filter((r) => r.change !== null) as { path: string; sessions: number; change: number }[];
    const top = [...withChange].sort((a, b) => b.change - a.change).slice(0, 5);
    const declining = [...withChange].sort((a, b) => a.change - b.change).slice(0, 5).filter((r) => r.change < 0);

    sections.push(
      renderSection(
        "Top URLs (largest WoW gain)",
        renderTable(["URL", "Change"], top.map((r) => [escapeHtml(r.path), wowBadge(r.change)])),
      ),
    );
    sections.push(
      renderSection(
        "Declining URLs (largest WoW drop)",
        declining.length === 0
          ? `<p style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#1e7a3d;">None.</p>`
          : renderTable(["URL", "Change"], declining.map((r) => [escapeHtml(r.path), wowBadge(r.change)])),
      ),
    );
  }

  sections.push(
    renderSection(
      "Sources (sitewide, trailing 7 days)",
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
      "Conversions (form completions, prototype generation, copy-button use)",
      renderNotConnectedNote(),
    ),
  );

  const brokenPages = uptime.filter((u) => !u.ok || u.brokenAssets.length > 0);
  sections.push(
    renderSection(
      "Errors (broken pages / assets, last check)",
      brokenPages.length === 0
        ? `<p style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#1e7a3d;">No broken pages or assets detected at last check.</p>`
        : renderTable(
            ["URL", "Issue"],
            brokenPages.map((p) => [
              escapeHtml(p.path),
              !p.ok ? `Page request failed${p.status ? ` (HTTP ${p.status})` : ""}` : `${p.brokenAssets.length} broken asset(s)`,
            ]),
          ),
    ),
  );

  let newUrlsHtml: string;
  if (newPaths === null) {
    newUrlsHtml = `<p style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#6b5e52;">No prior weekly report to compare against (this is the first run).</p>`;
  } else {
    const currentPaths = new Set(routes.map((r) => r.path));
    const added = routes.map((r) => r.path).filter((p) => !newPaths.includes(p));
    const removed = newPaths.filter((p) => !currentPaths.has(p));
    newUrlsHtml =
      added.length === 0 && removed.length === 0
        ? `<p style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#6b5e52;">None.</p>`
        : `<p style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#2a1f14;">${added.length > 0 ? `<strong>Added:</strong> ${escapeHtml(added.join(", "))}<br/>` : ""}${removed.length > 0 ? `<strong>Removed:</strong> ${escapeHtml(removed.join(", "))}` : ""}</p>`;
  }
  sections.push(renderSection("New URLs since last week's report", newUrlsHtml));

  sections.push(
    renderSection(
      "Recommended actions",
      brokenAlerts.length === 0
        ? `<p style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:#1e7a3d;">No urgent action items from this week's data.</p>`
        : renderTable(
            ["Action", "Owner"],
            brokenAlerts.map((a) => [escapeHtml(a.message), escapeHtml(recommendedOwner(a))]),
          ),
    ),
  );

  return wrapEmail(
    "Weekly Traffic Report",
    `Trailing 7 days vs prior 7 days, reported ${dateLabel} 7:00am Pacific (Monday)`,
    sections.join(""),
  );
}

export interface WeeklyReportResult {
  body: string;
  emailId: string;
  reportRunId: string;
}

export async function generateWeeklyReport(): Promise<WeeklyReportResult> {
  const routes = await getReportableRoutes();
  const ga4 = await fetchGa4WeeklyData();
  const uptime = await checkAllPages(
    routes.map((r) => ({ path: r.path, url: routeUrl(r.path) })),
  );
  const brokenAlerts = detectBrokenElementAlerts(uptime);
  const previousPaths = await getPreviousWeekRegisteredPaths();

  const body = buildWeeklyBody(routes, ga4, uptime, brokenAlerts, previousPaths);
  const html = buildWeeklyHtml(routes, ga4, uptime, brokenAlerts, previousPaths);

  const { id: emailId } = await sendEmail({
    to: REPORT_RECIPIENTS,
    subject: `RampRate Weekly Traffic Report - week ending ${new Date().toISOString().slice(0, 10)}`,
    text: body,
    html,
  });

  const reportRunDoc = await writeClient.create({
    _type: "reportRun",
    type: "weekly",
    periodLabel: "trailing 7 days",
    generatedAt: new Date().toISOString(),
    summary: body,
    alertsTriggered: brokenAlerts.map((a) => a.key),
    emailedTo: REPORT_RECIPIENTS,
    emailIds: [emailId],
    registeredPaths: routes.map((r) => r.path),
  });

  return { body, emailId, reportRunId: reportRunDoc._id };
}
