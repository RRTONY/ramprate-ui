# Pdf Report Template

> Reusable branded PDF report template + generator script (scripts/report-template/), built 2026-09-05 after past guide PDFs (Sanity CMS Guide, Supplier Intake Manual Guide) turned out to have no saved template at all

Built `scripts/report-template/report-template.html` + `generate-report.sh` as a persistent,
brand-locked template for any future PDF report in this project — see the full "PDF Report
Template" section added to CLAUDE.md (same content, treat CLAUDE.md as the living doc, this memory
as the "why").

**Why this got built:** the user asked for GA4 analytics reports to be created/emailed, then
separately asked "every time [Claude generates] a report it's using different colors" and to fix
that — investigation found the two prior guide PDFs referenced in [project_supplier_intake](project_supplier_intake.md)/
memory (`Sanity-CMS-Guide.pdf`, `Supplier-Intake-Manual-Guide.pdf`) were built from HTML that lived
only in a session scratchpad and was never saved anywhere — so every future report was being
reinvented from scratch with no fixed template, which is exactly why styling drifted. This template
fixes that at the root: one saved HTML/CSS file with the site's real brand colors hard-coded in.

**User explicitly said not to use purple or "your" (Claude's/Anthropic's) primary color** for these
reports — confirmed the site's own gold/dark/warm palette (per [project_ramprate](project_ramprate.md) CLAUDE.md) is
the only palette to use here, same as everywhere else on the site.

**Verified real, not just written:** rendered a multi-section/multi-page test doc via local Chrome
headless print-to-pdf, confirmed via `pdfinfo` (A4, correct page count) and `pdftoppm` (visually
inspected a *middle* page specifically, not just first/last) that margins are present on every page
and no content overlaps/gets sliced across a page break. Also caught that `--print-to-pdf-no-header`
is a silently-ignored/non-existent flag — the real flag is `--no-pdf-header-footer`; without it
Chrome's own date/title/URL/page-number header-footer bleeds into every generated report.

**Logo:** `public/ramprate-logo.png` is dark text on transparent background — embedded as a base64
data URI (not a file path, so the template stays portable/self-contained for a future server-side
use too) and reused the site's own existing `brightness(0) invert(1)` CSS trick (from
`src/components/shared/Logo.tsx`) to render it white on the cover's dark background; natural color
in the content-page footer.

**Not yet live on the MCP server.** The user asked for this to also work as an MCP tool (so
Claude Desktop/ChatGPT could generate reports directly against the deployed site, not just a local
Claude Code session) — but this script depends on a local Chrome install, which a Netlify function
doesn't have. Posed 3 options (`@react-pdf/renderer`, an external HTML-to-PDF API + key, or
`puppeteer-core`+`@sparticuz/chromium`) and the user's replies didn't clearly land on one — still an
open decision, see [project_admin_vibecoding](project_admin_vibecoding.md) for the MCP server's existing tool-adding pattern
(`src/lib/admin/tools.ts`) once a PDF engine is chosen.

**Same session also built** (see reference_clickup_board for the ClickUp piece):
`create_clickup_task`/`update_clickup_task`/`delete_clickup_task` MCP tools backed by
`CLICKUP_API_TOKEN` (already live and tested), and confirmed `GOOGLE_API_KEY` structurally cannot
reach GA4 (API keys are rejected outright by Analytics Admin/Data APIs — needs a service account or,
per the user's later preference, a Google Apps Script running under the user's own Google login,
same "no new dependency, no service-account secret in Netlify" reasoning already used for the
supplier-intake `.gs` script). GA4 property ID and the Apps Script report content/recipients were
never provided before the conversation moved to the PDF template — still outstanding if that GA4
report is picked back up.

**Template fixes (2026-09-25):** (1) the cover logo was rendering squashed flat on every report: `.cover` is a flex column, so the `<img>` got stretched to full width with its height fixed at 26px. Fixed with `align-self: flex-start` + `height: 16mm`. (2) Added page numbers ("Page X of Y") plus the doc title in the footer of every page except the cover, using CSS `@page` margin boxes (`@bottom-left`/`@bottom-right`, confirmed working in headless Chrome 153). (3) `generate-report.sh` now takes optional env vars `EYEBROW` (cover label, default "RampRate Report") and `PREPARED_BY` (footer credit, default "Claude"). Contents lists can't show page numbers because Chrome has no `target-counter()`.

**MCP `create_report` brought in line with the HTML template (2026-09-26):** it now has a "Page X of Y" footer on every page after the cover, optional `eyebrow`, `preparedBy` (default "RampRate Web Team", was a hardcoded "Prepared by Claude"), an optional `documentInfo` page + Contents, and `bullets`/`steps` lists. Fixed a real bug: every section had `wrap={false}`, so a section taller than one page was clipped. Sections now flow, headings use `minPresenceAhead`, and short lists (8 items or fewer), callouts and table rows stay unbroken. `create_report` was added to the rules gate because it sends email. `/scripts/` is gitignored but `scripts/report-template/` is kept via a `.gitignore` exception.
