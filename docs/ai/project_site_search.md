# Site Search

> Site search architecture - keyword search page and AI chatbot, and the 2026-07-10 fix that unified their page keywords

RampRate has two separate, previously-disconnected search surfaces:

1. **Keyword search** at `/search` (`src/app/search/page.tsx`) - queries Sanity for blog/thinking posts via `searchPostsQuery` (`src/lib/sanity/queries.ts`), and matches static pages via `matchSitePages()` in `src/lib/site-pages.ts` (the `SITE_PAGES` array is the single source of truth for every static page's title/path/keywords/description).
2. **AI chatbot ("Ask RampRate")** - `src/components/shared/SiteSearch.tsx` → `POST /api/ai` (`src/app/api/ai/route.ts`) → Claude Haiku with a hand-written system prompt in `src/lib/ramprate-knowledge.ts`.

**Why this matters:** these two systems used to have zero shared data - the AI's knowledge of pages was manually duplicated and easily went stale (e.g. it knew about `/vendor-intake` (renamed `/supplier-intake` on 2026-07-10, see [project_supplier_intake](project_supplier_intake.md)) and `/client-intake` explicitly but had no idea `/careers`, `/expertise`, `/howwework`, `/payments-advisory`, `/biochain` (was `/biochain-sourcing` until 2026-07-18, see [project_biochain_sourcing](project_biochain_sourcing.md)), `/service-provider-intelligence-index`, `/values` existed - `SITE_PAGES` was also missing those routes).

**How to apply:** `src/lib/ramprate-knowledge.ts` now imports `SITE_PAGES` and generates a `SITE_PAGE_DIRECTORY` block injected into the AI system prompt, so **`SITE_PAGES` is the one place to add/update a page's keywords** - it automatically flows into both the keyword search and the AI chatbot. When adding a new public page, always add an entry to `SITE_PAGES` (title, path, rich keywords covering synonyms/alt-phrasing, description) - do not just add Next.js `metadata.keywords` (that only affects `<meta name="keywords">`, not site search).

Do NOT add private/gated routes to `SITE_PAGES` - `attorney`, `attorney-rfi`, `legal-master`, `henry-jannol`, `josh-bykowski` are `noindex` private portals, and `aidoc-ownership-brief` is password-gated (`AiDocGate`). Adding them would surface locked/private pages in public search.

`matchSitePages()` scores matches: title hit > keywords hit > description hit, with a bonus when every query token matches, and drops common stopwords (a/an/the/etc.) so short filler words don't pull in irrelevant pages. All three text fields (title, keywords, description) are searched - not just title+keywords like the original implementation.

Blog/thinking full-text search (`searchPostsQuery`) matches `title`, `excerpt`, category titles, and now also the full post `body` via `pt::text(body) match $q`, so a term buried in an article's body still surfaces the post (previously only title/excerpt were searched).

See also [project_supplier_intake](project_supplier_intake.md), [project_client_intake](project_client_intake.md), [project_biochain_sourcing](project_biochain_sourcing.md), [project_payments_advisory](project_payments_advisory.md).
