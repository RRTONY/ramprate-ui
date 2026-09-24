# Payments Advisory

> New /payments-advisory pages: RFP-authorship tool for payment processor selection, standalone (not a registered practice)

Built `/payments-advisory` (2026-07-09) from two pasted mockups (`payment-rfp-app.tsx` and
an equivalent standalone `.html`) describing a "RampRate Payments Advisory" service:
RampRate authors a client's payment-processing RFP, shops it to 25+ vetted processors,
and negotiates on the client's behalf. See [feedback_prompt_injection_docs](feedback_prompt_injection_docs.md) for why
this was treated as a legitimate feature request rather than flagged as injection.

**Routes/files:** `src/app/payments-advisory/page.tsx` (overview/hero, process steps,
ImpactSoul/STBL integration block, qualify banner), `src/app/payments-advisory/intel/page.tsx`
+ `src/components/payments/IndustryGrid.tsx` (25 industries with risk/ticket/fraud-rate,
click-to-expand top processors; 25-processor rate benchmark table), `src/app/payments-advisory/intake/page.tsx`
+ `src/components/payments/PaymentsIntakeForm.tsx` (7-section Formik+Yup intake ~700 lines,
same step-progress-bar pattern as [project_client_intake](project_client_intake.md)'s ClientIntakeForm), plus two
API routes (below). Static data lives in `src/lib/payments-advisory-data.ts`.

**Security fix applied, not just ported:** the source mockups called
`https://api.anthropic.com/v1/messages` directly from browser JS with no API key — this
cannot work, and if "fixed" by hardcoding a key client-side it would leak the key to
anyone viewing page source. Built `src/app/api/payments-rfp/route.ts` instead: a
server-side proxy using `ANTHROPIC_API_KEY` (same env var as `/api/ai`), with its own
daily call counter (`DAILY_LIMIT = 30`, block at 95%) so this is cost-bounded independent
of `/api/ai`'s limit. **Bug caught during live testing** (not by typecheck): the initial
implementation checked `response.content[0]?.type === "text"` — but `claude-sonnet-5`
actually returns a `thinking` block *before* the `text` block for this kind of long
generation, so index-0 was never the text block, silently returning the "couldn't
generate" fallback string every time. Fixed by `response.content.find(b => b.type ===
"text")`. Also had to raise `max_tokens` from 4096 to 8192 — the 11-section board-level
RFP plus the thinking block were hitting `stop_reason: "max_tokens"` and getting cut off.
Confirmed working end-to-end with a real test call — full generation takes ~60-90 seconds
(long document + reasoning), so the form now shows a full-screen spinner with explicit
"this usually takes 60-90 seconds, don't close this tab" copy instead of just a disabled
button, which would have looked broken/hung to a real user waiting that long.

**Backend, consistent with this session's established pattern:** `src/app/api/payments-intake/route.ts`
posts intake form data to the same Google Apps Script `GOOGLE_APPS_SCRIPT_URL` used by
vendor/client intake (see [project_client_intake](project_client_intake.md) for the shared-script architecture),
with `projectName = "Payments — RampRate"` via the same `BRAND_NAMES` hostname-map
pattern, landing in its own Sheet tab. Verified with a labeled test row
(`"TEST — Claude verification, safe to delete"`).

**Scope decisions, all explicitly confirmed via AskUserQuestion before building (not assumed):**
- **Not a registered practice.** Built as a standalone page tree only — deliberately did
  NOT touch `Header.tsx`'s `practices` array, the homepage practice grid, `/expertise`,
  footer links, sitemap, or the AI chat's practices list. Avoids repeating the "Four
  practices" multi-file drift bug documented in [project_ramprate](project_ramprate.md). If this becomes a
  real 6th practice later, all of those files need the same coordinated update Private
  Advisory got.
- **Design matches RampRate's brand**, not the mockups' own cobalt-blue/purple palette
  and Syne/IBM Plex Mono fonts — rebuilt with gold/amber (`var(--gold)`), Playfair
  Display/DM Sans, and oklch colors per [project_ramprate](project_ramprate.md)'s CLAUDE.md rules, same
  choice made for [project_biochain_sourcing](project_biochain_sourcing.md).
- **ImpactSoul/STBL claims kept as-is** — user explicitly confirmed this "Impact Dollar /
  STBL stablecoin rail" integration is real, despite it not appearing anywhere else in
  the codebase or prior session notes. Don't second-guess or remove it without asking
  again if touched in a future session; the confirmation already happened.
- **Dropped the "Developer Score" column** from the processor table — every single row in
  the pasted data had the exact same corrupted placeholder string (mis-encoded star
  characters, byte-identical across all 25 processors), meaning it was never real
  differentiated data. Rather than publish fabricated-looking identical ratings, the
  column was cut entirely. If real developer-experience ratings are wanted later, they'd
  need to come from an actual source, not be reconstructed from this corrupted column.

**Not yet done:** no link to `/payments-advisory` exists anywhere else on the site (same
"standalone, not linked" status as [project_biochain_sourcing](project_biochain_sourcing.md) and
[project_client_intake](project_client_intake.md) before their nav/CTA decisions were made) — a future session
may be asked to wire it into nav or a CTA somewhere.
