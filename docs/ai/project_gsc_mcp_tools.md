# Gsc Mcp Tools

> 09-24 added 4 Google Search Console tools to the /api/mcp admin server (uncommitted); needs service account added as GSC user

2026-09-24: user asked for "full control" of Google Search Console from the MCP server, then said "you decide, add everything". Built (local, NOT committed as of this note): `search_console_sites`, `search_console_performance` (dimensions/filters/compare), `search_console_inspect_url` (up to 20 URLs), `search_console_sitemaps` (list/submit/delete). Code: `src/lib/admin/gsc-client.ts`; shared JWT signer moved to `src/lib/admin/google-auth.ts` (GA4 client now uses it); tests `tests/admin/gsc-client.test.ts`.

Auth = same service account as GA4 (`GOOGLE_GA_CLIENT_EMAIL`/`GOOGLE_GA_PRIVATE_KEY`), no new env vars or deps. It only works once a human adds that email as a user on each GSC property (Full = read + submit; Owner = also delete sitemaps). 403s say so in the error.

**Why:** the MCP server previously had zero GSC tools, so Claude/ChatGPT kept hitting "can't do that".
**How to apply:** don't promise things the API can't do: request indexing for normal pages, removals, manual actions, links, settings, users, Core Web Vitals (use CrUX; would need GOOGLE_API_KEY restriction widened - deliberately not done). Deliberately excluded: site add/delete, Indexing API. Related: [project_admin_vibecoding](project_admin_vibecoding.md). A separate, still-undecided guardrail change (read-only access to netlify.toml/package.json/.github/workflows/middleware) sits in the same uncommitted tools.ts diff.

**2026-09-26: "Search Console API has not been used in project 515026601292" fixed.** Search Console access for the service account and the API being switched on are two separate things. The API was DISABLED in the Cloud project that owns `vcos-ga4-reader@top-footing-500220-u9.iam.gserviceaccount.com`. It was enabled from this repo using the service account's own key via the Service Usage API (`POST https://serviceusage.googleapis.com/v1/projects/515026601292/services/searchconsole.googleapis.com:enable`, which succeeded, so the account can manage that project). After that, `sites.list` returned only `sc-domain:clarisseartist.com`: the account was **not yet a user on ramprate.com's property**, which still has to be added by a person in Search Console.

**2026-11-07: access confirmed, and how to run it locally.** The service account is now a Full user on
`https://ramprate.com/` and `https://tonygreenberg.com/` (plus `sc-domain:clarisseartist.com`). With the MCP
connection not signed in, the same code runs from a terminal: a throwaway `.ts` file at the repo root that imports
`@/lib/admin/gsc-client`, run with `npx tsx --env-file=.env <file>` (keys stay in the process, never printed; delete
the file after). Used that day to inspect the America, Unbundled pages (both essays indexed, last crawled 09-29 and
10-17; the RampRate intro "URL is unknown to Google", since ramprate.com's sitemap was last read 10-31, before the
intro went up) and to resubmit both `sitemap.xml` files. "Request indexing" is still website-only. The ramprate.com
property also listed five 2019 WordPress-era sitemaps (`post-sitemap.xml`, `page-`, `post_tag-`, `category-`,
`resource-sitemap.xml`; all 404 on the live site) with errors; removed the same day with the webmaster's yes, leaving
only `sitemap.xml`. Deleting worked with the account's **Full** permission, so "Owner needed to delete" above is wrong.

### 2026-11-07: every sitemap page inspected, both sites
- Recipe: a throwaway `.mts` file at the repo root that fetches `/sitemap.xml`, calls `inspectUrls()`
  in batches of 10 (the helper caps at 20), and writes the results to a scratch JSON file. Run with
  `npx tsx --env-file=.env`. 657 pages took a few minutes, well under the ~2,000/day quota.
  (A `.ts` file fails: tsx compiles it as CommonJS and top-level `await` is refused.)
- ramprate.com: 150 of 154 indexed. The other four are new pages Google hasn't reached yet.
- tonygreenberg.com: every page in its "Why pages aren't indexed" report (noindex, robots.txt
  blocked, soft 404, redirect) was re-checked live, including with Googlebot's user agent and the
  `X-Robots-Tag` header. All are clean now. Google's records date from the May–June Manus crawls,
  so the fix is "Validate fix" in Search Console, not code. Real fixes made: sitemap coffee URLs
  are now percent-encoded (the accented "tarrazú" page didn't match its own canonical).
- Thin brewsoul coffee pages (~220 words, same template) got grouped by Google under one canonical
  (`stumptown-hair-bender`). Cause: every coffee's own written `connoisseurNote` (27-75 words, all
  107 unique), brew methods, food pairings and farm/harvest/lot data were in the data but never
  shown on the page. Now shown (tonyg-site branch `index-america-unbundled-2026-11-07`), so each
  page has its own words. Re-check those 7 URLs in Search Console a few weeks after it's live.
- Charity Scorecard (2026-11-07): 61 profiles "Discovered - currently not indexed" and 22 unknown to
  Google. Cause: the hub's HTML linked none of the 103 profiles (the explorer only shows a
  "Full Profile" link after a row is expanded, and renders 25 rows), and Google's last look at the hub
  was May 21 under the old Manus robots.txt. Fix on tonyg-site branch
  `index-america-unbundled-2026-11-07`: a closed-by-default "All N charities, by sector" list of
  plain links under the explorer. After it's live, Request indexing on `/charity-scorecard`.
- Plausible on ramprate.com: plausible.io serves its own scripts fine but returns 404 for our
  per-site script (`pa-...js`), so the site was removed from the account or the plan lapsed. No
  Plausible key exists in either repo; needs a login to plausible.io, not a code change.
