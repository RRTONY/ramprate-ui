# Project Structure

A map of the repo so any AI tool can find the right file fast. Read this with
[`/AGENTS.md`](../../AGENTS.md) (the rules) and [`TASK_GUIDE.md`](TASK_GUIDE.md) (what to do for
each kind of request). Checked against the code on 2026-09-26. If this map and the code disagree,
trust the code and update this file.

## At a glance

| What | Where |
| --- | --- |
| Framework | Next.js 16 App Router (`src/app/`), React server components by default |
| Styling | Tailwind v4 + design tokens in `src/app/globals.css` |
| Content | Sanity CMS: schemas `src/sanity/schemas/`, queries `src/lib/sanity/queries.ts`, Studio at `/studio` |
| Forms backend | Google Apps Script + Google Sheet (not in the repo's deploy; see "Outside the repo") |
| Hosting | Netlify (`netlify.toml`, scheduled jobs in `netlify/functions/`) |
| Tests | Vitest, `tests/**/*.test.ts`, run `npm test` |
| AI admin server | MCP server at `/api/mcp`, code in `src/lib/admin/` |

## Top-level folders

```
AGENTS.md            Rules for every AI tool (CLAUDE.md just points here)
docs/ai/             Background notes, this map, the task guide
src/app/             Pages and API routes (one folder = one URL)
src/components/      React components, grouped by area
src/lib/             Shared logic: Sanity, forms, search, admin/MCP, reports
src/sanity/schemas/  Sanity content types
src/content/, src/contexts/, src/hooks/, src/shared/   Mostly used by the /flow product
public/              Static files: images, logos, _redirects, llms.txt
netlify/functions/   Scheduled jobs: daily report, weekly report, hourly alert check
scripts/             Local tools and Apps Script copies (gitignored, see AGENTS.md)
tests/admin/         Unit tests for the MCP admin tools
.mcp.json            Connects Claude Code in this repo to the live MCP server
```

## Where each page's text lives

**Most visible page text is written in code, not Sanity.** Sanity mainly supplies each page's SEO
title/description (`pageSeo` documents, via `getPageSeo()` in `src/lib/sanity/seo.ts`), blog and
Thinking posts, team members, board advisors, and site settings (contact details, used by the
layout, `/contact` and `/about`).

| Route | Page file | Visible text lives in |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Code: `src/components/home/HomeContent.tsx` and siblings |
| `/about` | `src/app/about/page.tsx` | Code, plus Sanity team members, board advisors, site settings |
| `/blog`, `/blog/[slug]`, `/blog/category/[slug]` | `src/app/blog/...` | Sanity `post` + `category` |
| `/thinking`, `/thinking/[slug]` | `src/app/thinking/...` | Sanity `post` (Thinking section) |
| `/contact` | `src/app/contact/page.tsx` | Code, plus Sanity site settings |
| `/sourcing`, `/sourcing/process` | `src/app/sourcing/...` | Code |
| `/growth`, `/web3`, `/impactsoul`, `/torque` | `src/app/<slug>/page.tsx` | Code (practice pages) |
| `/process`, `/howwework`, `/values`, `/proof`, `/expertise`, `/careers` | `src/app/<slug>/page.tsx` | Code |
| `/champions` | `src/app/champions/page.tsx` | Code; form `src/components/champions/ChampionApplyForm.tsx` |
| `/talk-to-us` | `src/app/talk-to-us/page.tsx` | Code; form `src/components/engage/EngagementIntakeForm.tsx` |
| `/biochain` (+ `/process`, `/catalogue`) | `src/app/biochain/...` | Code; sub-nav `src/components/biochain/BioChainSubNav.tsx` |
| `/biochain/supplier-intake` | `src/app/biochain/supplier-intake/page.tsx` | Code; fields `src/lib/supplier-intake-fields.ts` |
| `/supplier-intake-long/[token]` | `src/app/supplier-intake-long/[token]/page.tsx` | Code; Stage 2 form, private link only |
| `/biochain/buyer-intake` | `src/app/biochain/buyer-intake/page.tsx` | Code; fields `src/lib/client-intake-fields.ts` |
| `/payments-advisory` (+ `/intake`, `/intel`) | `src/app/payments-advisory/...` | Code; data `src/lib/payments-advisory-data.ts` |
| `/service-provider-intelligence-index` | `src/app/service-provider-intelligence-index/page.tsx` | Code |
| `/search` | `src/app/search/page.tsx` | Sanity posts + `SITE_PAGES` in `src/lib/site-pages.ts` |
| `/artifacts`, `/artifacts/[slug]`, `/artifacts/admin` | `src/app/artifacts/...` | Sanity `artifact` (sales-published HTML) |
| `/privacy`, `/terms` | `src/app/<slug>/page.tsx` | Code |
| Private portals: `/attorney`, `/attorney-rfi`, `/legal-master`, `/henry-jannol`, `/josh-bykowski`, `/biochain-partner-faq`, `/aidoc-ownership-brief` | `src/app/<slug>/page.tsx` | Code, password-gated (`src/lib/portal-auth.ts`), noindex |
| `/kumbaya`, `/active-pharm-form` | `src/app/<slug>/page.tsx` | Code (intake forms) |
| `/flow/...` | `src/app/flow/` | Separate product (see below) |
| `/studio` | `src/app/studio/` | Sanity Studio (content editing UI) |

> **Sanity types that exist but no page shows today:** `testimonial`, `caseStudy`, `clientLogo`,
> `confidentialTestimonial`, and page-builder `page` documents (`PageBuilder.tsx` is not used by
> any route). Editing these in Sanity changes nothing on the live site. The testimonials, logos and
> case studies you see on pages are written in code.

## Shared site pieces

| Piece | File |
| --- | --- |
| Header + Practices dropdown (`practices` array, `lightBgPaths`) | `src/components/layout/Header.tsx` |
| Footer | `src/components/layout/Footer.tsx` |
| Hides header/footer on standalone pages | `src/components/shared/ConditionalChrome.tsx` |
| Root layout, fonts, site settings | `src/app/layout.tsx` |
| Design tokens, section/glass classes | `src/app/globals.css` |
| Reusable sections (hero, CTA, team grid, logo bar...) | `src/components/sections/` |
| Logo | `src/components/shared/Logo.tsx` |
| Site search + "Ask RampRate" chatbot | `src/components/shared/SiteSearch.tsx`, `src/app/api/ai/route.ts`, `src/lib/ramprate-knowledge.ts` |
| Page list for search + chatbot | `src/lib/site-pages.ts` (`SITE_PAGES`) |
| SEO per page | Sanity `pageSeo` + `src/lib/sanity/seo.ts`; JSON-LD in `src/components/shared/JsonLd.tsx` |
| Sitemap, robots | `src/app/sitemap.ts`, `src/app/robots.ts` |
| Redirects | `public/_redirects` (Netlify) and `next.config.ts` |

## Forms: where each one sends data

| Form | Page component | API route | Backend |
| --- | --- | --- | --- |
| Supplier Stage 1 | `src/components/supplier/SupplierIntakeStage1Form.tsx` | `src/app/api/supplier-intake/route.ts` | Supplier Apps Script, tab `ramprate.com` |
| Supplier Stage 2 | `src/components/supplier/SupplierIntakeStage2Form.tsx` | `src/app/api/supplier-intake-long/route.ts` | Same script, updates the row by token |
| Buyer intake | `src/components/biochain/ClientIntakeForm.tsx` | `src/app/api/client-intake/route.ts` | Same script, tab `Client - RampRate` |
| Payments intake | `src/components/payments/PaymentsIntakeForm.tsx` | `src/app/api/payments-intake/route.ts` | Same script, tab `Payments - RampRate` |
| Champions | `src/components/champions/ChampionApplyForm.tsx` | `src/app/api/champions-intake/route.ts` | Same script, tab `Champions - RampRate`; route also emails via Resend + creates a ClickUp task |
| Talk to Us / engagement | `src/components/engage/EngagementIntakeForm.tsx` | `src/app/api/engagement-intake/route.ts` | Separate script (`ENGAGEMENT_INTAKE_SCRIPT_URL`) |
| Active Pharm | `src/app/active-pharm-form/` | `src/app/api/active-pharm-intake/route.ts` | Separate script (`ACTIVE_PHARM_INTAKE_SCRIPT_URL`) |
| Kumbaya | `src/app/kumbaya/` | `src/app/api/kumbaya-intake/route.ts` | Sanity `kumbayaSubmission`, plus a ClickUp task and a Slack post |
| Contact | `src/components/sections/ContactForm.tsx` | none: posts to `/` | Netlify Forms (form definition in `public/netlify-forms.html`); submissions in the Netlify dashboard |

Form fields are defined once in a field file (`src/lib/*-fields.ts`) and rendered by
`src/components/supplier/formShared.tsx`. Change the field file, not the JSX.

## Other API routes

| Route | Purpose |
| --- | --- |
| `/api/ai` | "Ask RampRate" chatbot (Claude Haiku) |
| `/api/search` | Site search |
| `/api/revalidate` | Sanity webhook: refresh cached pages after a content publish |
| `/api/artifacts`, `/api/artifacts/[id]`, `/api/artifacts-auth` | Artifact Manager |
| `/api/private-portal` | Password portals login |
| `/api/payments-rfp` | Payments Advisory RFP generator |
| `/api/cron/daily-report`, `/weekly-report`, `/alert-check` | Called by `netlify/functions/` on a schedule |
| `/api/mcp`, `/api/mcp/[token]` | MCP admin server (Claude Desktop/Code, Claude.ai, ChatGPT) |
| `/oauth/authorize` (page), `/api/oauth/authorize`, `/api/oauth/token`, `/api/oauth/register`, `/.well-known/oauth-*` | Team sign-in for the MCP server (OAuth). See AGENTS.md |

## MCP admin server (`src/lib/admin/`)

| File | Role |
| --- | --- |
| `mcp-server.ts` | Tool list, handshake instructions, rules gate |
| `project-rules.ts` | `get_project_rules`: serves AGENTS.md + these guides, `rules_version` check |
| `tools.ts` | What each tool does (`runAdminTool`) |
| `guardrails.ts` | Files the AI may never edit, Sanity types it may edit |
| `github-client.ts` | Branch/PR/file operations (default branch is `master`) |
| `sanity-content.ts` | Sanity drafts + publish |
| `mcp-tool-context.ts` | Finds or opens the one pending admin branch/PR |
| `code-check.ts`, `seo-check.ts`, `lighthouse-check.ts` | Quality checks |
| `gsc-client.ts`, `ga4-client.ts` | Search Console, Analytics |
| `clickup-client.ts`, `resend-client.ts`, `slack-client.ts` | ClickUp tasks, email, Slack |
| `mcp-ui-widgets.ts` | Pending-changes card with a Publish button |

## The /flow product

`src/app/flow/`, `src/components/flow/`, `src/lib/flow/`, `src/contexts/flow/`, `src/hooks/flow/`,
`src/shared/flow/`, `src/content/flow/`. A separate assessment product with its own login, API
(`/flow/api/...`) and UI. It uses `framer-motion`, which is allowed there and nowhere else. Don't
apply marketing-site page patterns to it.

## Outside the repo (can't be changed by editing files here)

| Thing | Where it really lives | How it changes |
| --- | --- | --- |
| Supplier/buyer/payments/champions form backend | Google Apps Script (local copy `scripts/supplier-intake-apps-script.gs`) + Google Sheet | Paste into the Apps Script editor, then Deploy → New version |
| Form data | Google Sheet `1S0lgEsyXsrGoBMlIY7ZPDtUV8x84M1Z7qsLzjvYrur0`, uploads in Google Drive | By hand in Google |
| Environment variables / secrets | `.env` locally, Netlify dashboard in production | By hand; the AI must never write them |
| DNS, domains | Registrar / Netlify | By hand |
| Slack channels and bot | ramprate.slack.com | By hand |
| tonygreenberg.com | Separate codebase, run through Manus AI | Handoff notes only |
