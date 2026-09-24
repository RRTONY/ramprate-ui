# Ramprate

> RampRate UI codebase — architecture, known issues, stack summary

Next.js 16.1.6 (App Router) + React 19 + Sanity CMS + Tailwind v4 deployed on Netlify.

**Practices pages pattern** (as of 2026-06-30): Static `.tsx` files in `src/app/<slug>/page.tsx`. Each exports a `metadata` object and a default server component. Theme uses: `section-dark`, `section-warm`, `section-light` CSS classes; `glass-orb`, `glass-card` for visual depth; CSS vars `--font-display` (Playfair Display), `--font-body` (DM Sans), `--dark` for hero bg. Navigation practices array is in `src/components/layout/Header.tsx`.

**Color rule (confirmed 2026-06-30):** Default accent for all practice pages is the site's gold/amber — `var(--gold)` on dark sections, `oklch(0.52 0.12 70)` for text on light/warm sections. Glass orbs: always `glass-orb-amber` + `glass-orb-rust`. Never use arbitrary blues or non-brand colors unless the practice has an explicit distinct brand (e.g., ImpactSoul uses rust `oklch(0.55 0.15 30)`).

**Header dropdown (fixed 2026-06-30):** Panel width `min-w-[270px]`. Each row uses `gap-4` + `shrink-0` on desc to prevent label/desc from visually merging on longer names like "Private Advisory".

**Practices registered (2026-06-30):** Sourcing `/sourcing`, Syzygy `/growth`, Stratum `/web3`, ImpactSoul `/impactsoul`, Private Advisory `/private-advisory`.

**"Four practices" vs 5, sitewide (fixed 2026-07-07):** Private Advisory was added as a practice page + nav entry, but it is NOT derived from a single source of truth — it's duplicated by hand across at least 7 files, and most of them were never updated. Found and fixed all of: `src/app/expertise/page.tsx` (`practices` array + "Four Brands"/"Four practices" copy + metadata + JsonLd description), `src/components/home/HomeContent.tsx` (`brands` array + "Four practices" headline + grid changed `lg:grid-cols-4`→`lg:grid-cols-3` for 5-card wrap), `src/app/careers/page.tsx` (perk card said "Four Practices, One Coalition" with a stale tag missing both Stratum and Private Advisory), `src/lib/ramprate-knowledge.ts` (AI chatbot system prompt — "FOUR PRACTICES" list had no Private Advisory entry at all, meaning the live AI assistant couldn't answer questions about it), `src/components/layout/Footer.tsx` (`brandLinks` array — practice missing from footer nav), `src/app/sitemap.ts` (`/private-advisory` was absent from `staticRoutes`, so it wasn't in sitemap.xml — SEO gap), `src/components/shared/SiteSearch.tsx` (`NAV_INDEX` — site search couldn't surface the page for queries like "crisis management" or "board advisory"). Triggered by Tony/Josh flagging a practice-count mismatch in Slack (also confirmed there's no "Justice" practice and never was, checked via Wayback Machine back to 1999 — pure naming mix-up, not a legacy artifact). **Why:** there is no single registry practices are read from — each surface (nav, expertise page, homepage, careers copy, AI prompt, footer, sitemap, search index) maintains its own hardcoded list/count. **How to apply:** whenever a practice is added, removed, or renamed, grep the whole `src/` tree for the other practice names (e.g. `grep -rl "impactsoul" src`) to find every file with a practice list, not just `Header.tsx` — that grep pattern is how all 7 stale spots were found.

**SEO overhaul (2026-07-07):** A Slack "Full SEO Overhaul" report from a *different* property (tonygreenberg.com — has `ssr-pages`, `llms.txt` route, 115 static blog posts, manus.im bot traffic; none of that exists here) was adapted to ramprate-ui's actual Next.js/Sanity stack. Applied: (1) `keywords` metadata field added to root layout + all static practice/about/process/proof/contact/careers pages + blog/thinking `generateMetadata` (derived from Sanity `categories`) — previously only 2 of ~14 pages had it. (2) `webSiteJsonLd()` in `src/components/shared/JsonLd.tsx` now emits a `SearchAction` pointing at `/search?q={search_term_string}` — it was previously disabled by a stale comment saying "no /search route exists," which is no longer true. (3) Blog (`src/app/blog/[slug]/page.tsx`) and thinking (`src/app/thinking/[slug]/page.tsx`) post templates now render a "Continue Reading" related-posts section (matched by shared Sanity category via new `relatedPostsQuery`/`relatedThinkingPostsQuery` in `src/lib/sanity/queries.ts`, falling back to `recentPostsQuery`/`recentThinkingPostsQuery` when a post has no categories) plus a closing `CtaSection` linking to `/contact` — deliberately generic ("Start a Conversation"), not an ImpactSoul-specific CTA like the source report, since this site's blog covers enterprise IT/Web3/growth topics where a hard ImpactSoul push on every post wouldn't fit contextually. (4) `src/app/sitemap.ts` now sets `lastModified` from Sanity `_updatedAt`/`publishedAt` on pages/posts/categories (previously only the homepage had a `lastModified`), and posts with a `mainImage` get the Next.js image-sitemap `images` field (Next's `MetadataRoute.Sitemap` type supports `images?: string[]` natively — confirmed in `node_modules/next/dist/lib/metadata/types/metadata-interface.d.ts`). (5) `public/llms.txt` updated from "four advisory practices" (same stale-count bug as the nav/expertise issue above) to five, and missing Key Pages links (Growth, Web3, ImpactSoul, Private Advisory, Careers) were added. **Skipped deliberately:** Google Search Console verification meta tag — user confirmed verification is already done outside the codebase (DNS or another method), so no `verification` field was added to `layout.tsx` metadata; a standalone `Person` schema with `sameAs` was also skipped since there's no single public-figure page here (unlike tonygreenberg.com) and organizationJsonLd already carries `sameAs` for the company. **Why:** the source report's items only partially map onto this codebase's architecture — always verify claimed files/features exist here before implementing, don't port 1:1. **How to apply:** if another "apply elsewhere" SEO/content report shows up in Slack, audit current state first (grep for the specific files/fields named) rather than assuming parity with whatever site produced the report.

Key architectural issues identified (see ARCHITECTURE_AND_SCALE_REVIEW.md in repo root):

**Why:** Comprehensive review done 2026-05-19 for traffic/scale planning.

**How to apply:** Reference these when suggesting changes to any of the affected files.

Critical:
- ~~`HomeContent.tsx` (1104 lines) is a `'use client'` god component~~ FIXED 2026-06-17: split into a server `HomeContent.tsx` + 3 client islands (`ClientWall`, `TestimonialsCarousel`, `NewsletterSection`). Home `/` now builds as Static (prerendered) with ISR.
- AI endpoint `/api/ai` has no rate limiting and `max_tokens: 32768` (cost risk)
- Newsletter form (HomeContent.tsx:241) POSTs to Netlify forms but is silently broken because Netlify never sees the HTML form at build time (client component)
- `/api/revalidate` only calls `revalidatePath('/', 'layout')` — doesn't bust blog post caches

Performance:
- `framer-motion` is in dependencies but has zero imports — dead weight (~140KB)
- Blog post images use `<img>` not `<Image>` (no lazy load, no WebP, layout shift)
- `sourcing/page.tsx` (539 lines) is `'use client'` just for an FAQ toggle — should be split

**Site "AI search" is two separate hardcoded mechanisms, not one config (confirmed 2026-07-08):** There is no Sanity `searchKeywords` field, no Algolia, no embeddings. (1) `src/components/shared/SiteSearch.tsx` — `NAV_INDEX` array with a `keywords` string per page, used for client-side quick-nav fuzzy match in the ⌘K "Ask RampRate" modal before it falls back to the AI chat. (2) `src/lib/ramprate-knowledge.ts` — `RAMPRATE_SYSTEM_PROMPT`, the system prompt for the actual LLM chat (`/api/ai` route, calls `claude-haiku-4-5-20251001`). Both must be updated together whenever a new page needs to be discoverable — this is the same class of bug as the "Four practices" duplication above (project-ramprate-ui 2026-07-07 entry), just for search instead of nav. **How to apply:** when adding a new page that should be findable via site search/AI chat, add an entry to `NAV_INDEX` (title/path/type/keywords) AND a short paragraph in `RAMPRATE_SYSTEM_PROMPT` describing what the page does and when to point users to it. Grepping for an existing similar page's name across `src/` (same technique as the practices fix) surfaces both spots.

**Header dropdown pattern (established 2026-07-08 adding a second dropdown):** `Header.tsx` previously had exactly one hover-dropdown ("Practices"); a "Become a..." dropdown was added following the identical structure — useful as the template for any future dropdown. To add one: (1) a top-level `const xyz = [{ label, href, desc }]` array before the component, (2) an `xyzOpen` `useState(false)`, (3) reset it to `false` in the `pathname !== lastPathname` block alongside the others, (4) a desktop `<div onMouseEnter/onMouseLeave>` block with a button + conditionally-rendered absolutely-positioned panel (copy the Practices block verbatim, swap the array/state names), (5) a matching mobile-menu section (label + mapped `Link` rows) inserted into the mobile dropdown panel. Links inside hover-dropdown panels only appear in server-rendered HTML once the corresponding `*Open` state is true (client-side hover) — absence from a plain `curl` of the page is expected, not a bug.

**Vendor Intake discoverability push (2026-07-08):** Tony reviewed the site and flagged that `/vendor-intake` was hard to find — not surfaced in site search/AI chat keywords, and no nav path to it besides a direct link. Fixed by adding it to both `NAV_INDEX` and `RAMPRATE_SYSTEM_PROMPT` (see above), and adding a "Become a..." nav dropdown with a single "Become a Supplier" → `/vendor-intake` entry. **Deliberately did not** add placeholder "Become a Partner" / "Become an Advisor" entries Tony mentioned as examples — no corresponding pages exist yet (confirmed `/attorney-rfi` is a separate private, noindexed portal, not a candidate). User chose "only add real links, extend later" over placeholders when asked. **Why this matters going forward:** Tony has asked to keep proactively surfacing and fixing discoverability/usability issues sitewide, not just this one ask — treat this as a standing, open-ended engagement rather than a one-off task. **How to apply:** when a new intake/application-style page is built, add it to the `becomeA` array in `Header.tsx` in addition to the search-index updates above; when auditing discoverability, check both the nav (Header.tsx) and the two search mechanisms since a page can be missing from either independently.

**Shared static-page registry for search (2026-07-09):** `src/lib/site-pages.ts` now holds
the single `SITE_PAGES` array (title/path/type/keywords/description) + a `matchSitePages()`
helper, used by BOTH `src/components/shared/SiteSearch.tsx` (⌘K quick-nav) and
`src/app/search/page.tsx` (the real `/search` results page, which previously only queried
Sanity blog posts via `searchPostsQuery` and had no way to surface static pages at all).
**Why:** avoids yet another instance of the "multiple hardcoded lists drift apart" bug
class already documented above for practices — before this, `SiteSearch.tsx`'s `NAV_INDEX`
was the only registry and `/search` had no equivalent. **How to apply:** any time a new
static page should be findable via site search, add ONE entry to `SITE_PAGES` — it now
automatically covers both the ⌘K modal and the `/search` results page's new "Pages"
section (rendered above Blog Posts/Thinking, since a direct page match is usually the
strongest intent signal for a query like "vendor" or "client").

**Multi-tenant Google Sheets backend, tab-per-form convention (2026-07-08/09):** Every
intake-style form (`/vendor-intake`, `/client-intake`, `/payments-advisory/intake`) POSTs
to its own `src/app/api/*/route.ts`, which all proxy to the SAME `GOOGLE_APPS_SCRIPT_URL`
(one deployed Apps Script, one Sheet, one Drive folder — source of truth for the script
is `scripts/vendor-intake-apps-script.gs`, recreated 2026-07-09 after the user deleted the
old copy). The Apps Script creates a new Sheet tab per exact `projectName` string it
receives, so each route's `projectName` value IS the tab name. Established convention:
`vendor-intake/route.ts` uses the bare referer hostname (`"ramprate.com"`) — this is LIVE
production data since 2026-07-01 and was deliberately left unchanged (renaming it would
split historical rows into two tabs, confirmed with user not to do this). Every route
built *after* that follows a clearer `BRAND_NAMES` hostname-map pattern instead:
`` `Client — ${BRAND_NAMES[hostname] || hostname}` `` / `` `Payments — ${...}` ``, giving
tabs like "Client — RampRate" and "Payments — RampRate". **How to apply:** any new intake
form added later should copy this `BRAND_NAMES`-map pattern (not the bare-hostname
pattern vendor-intake uses), and must use a projectName distinct from every existing one
or it will silently merge rows into another form's tab. tonygreenberg.com forms (if built,
in that site's own separate repo) can point at the same `GOOGLE_APPS_SCRIPT_URL` and would
get their own tabs automatically via the same hostname map — no changes needed on this
side for that to work.

Good patterns already in place:
- `generateStaticParams` on blog/thinking slug pages
- `Promise.all` for parallel Sanity fetches
- `useCdn: true` in Sanity client
- Proof page split correctly: `page.tsx` (server fetch) + `ProofClient.tsx` (client interactivity)
