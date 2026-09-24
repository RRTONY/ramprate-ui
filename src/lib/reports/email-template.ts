// Minimal, email-client-safe HTML helpers (table-based layout, inline
// styles only - no flexbox/grid, no external CSS) for the traffic report
// emails. Uses the site's own gold/navy brand colors (see AGENTS.md's CSS
// Design System) rather than inventing new ones, matching the same palette
// scripts/report-template/ uses for PDF reports.

const GOLD = "#d4a843";
const NAVY = "#0a0f1a";
const INK = "#2a1f14";
const INK_MID = "#6b5e52";
const WARM_BG = "#f5f0e8";
const BORDER = "#e3dccf";

export function escapeHtml(value: string | number): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const thStyle = `text-align:left; padding:8px 10px; font-size:12px; letter-spacing:0.04em; text-transform:uppercase; color:${INK_MID}; border-bottom:2px solid ${GOLD}; font-family:Arial,Helvetica,sans-serif;`;
const tdStyle = `padding:8px 10px; font-size:13px; color:${INK}; border-bottom:1px solid ${BORDER}; font-family:Arial,Helvetica,sans-serif; vertical-align:top;`;

export function renderTable(headers: string[], rows: string[][]): string {
  if (rows.length === 0) {
    return `<p style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:${INK_MID};">No data.</p>`;
  }
  const head = headers.map((h) => `<th style="${thStyle}">${escapeHtml(h)}</th>`).join("");
  const body = rows
    .map((row) => `<tr>${row.map((cell) => `<td style="${tdStyle}">${cell}</td>`).join("")}</tr>`)
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom:4px;"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

export function renderSection(title: string, bodyHtml: string): string {
  return `
    <tr><td style="padding:22px 0 4px;">
      <h2 style="margin:0 0 10px; font-family:Georgia,'Times New Roman',serif; font-size:17px; color:${NAVY};">${escapeHtml(title)}</h2>
      ${bodyHtml}
    </td></tr>`;
}

export function renderNotConnectedNote(): string {
  return `<p style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:${INK_MID}; font-style:italic;">Analytics not connected. Traffic cannot yet be verified.</p>`;
}

export type BadgeTone = "ok" | "warn" | "critical" | "neutral";

export function badge(text: string, tone: BadgeTone): string {
  const colors: Record<BadgeTone, { bg: string; fg: string }> = {
    ok: { bg: "#e6f4ea", fg: "#1e7a3d" },
    warn: { bg: "#fdf0da", fg: "#9a6a00" },
    critical: { bg: "#fbe4e2", fg: "#a3231b" },
    neutral: { bg: WARM_BG, fg: INK_MID },
  };
  const c = colors[tone];
  return `<span style="display:inline-block; padding:2px 8px; border-radius:999px; font-size:11px; font-weight:600; background:${c.bg}; color:${c.fg}; font-family:Arial,Helvetica,sans-serif;">${escapeHtml(text)}</span>`;
}

export function wrapEmail(title: string, subtitle: string, sectionsHtml: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0; padding:0; background:${WARM_BG};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${WARM_BG};">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="680" cellpadding="0" cellspacing="0" style="max-width:680px; width:100%; background:#ffffff;">
        <tr><td style="background:${NAVY}; padding:22px 28px;">
          <div style="font-family:Georgia,'Times New Roman',serif; font-size:20px; color:#ffffff;">RampRate</div>
          <div style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:${GOLD}; letter-spacing:0.04em; text-transform:uppercase; margin-top:4px;">${escapeHtml(title)}</div>
        </tr></td>
        <tr><td style="padding:6px 28px 0;">
          <p style="font-family:Arial,Helvetica,sans-serif; font-size:13px; color:${INK_MID}; margin:14px 0 0;">${escapeHtml(subtitle)}</p>
        </td></tr>
        <tr><td style="padding:0 28px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${sectionsHtml}
          </table>
        </td></tr>
        <tr><td style="padding:16px 28px; border-top:1px solid ${BORDER};">
          <p style="font-family:Arial,Helvetica,sans-serif; font-size:11px; color:${INK_MID}; margin:0;">Generated automatically by ramprate.com's traffic reporting system. Source data: Google Analytics 4.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
