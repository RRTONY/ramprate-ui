# Audit Methodology

> Sitewide sweep method for a11y/perf/bundle-size fixes, carried over from website-v3's proven rules — fix shared components, not just the flagged page

When fixing an a11y or performance finding (Lighthouse/PageSpeed/axe), or asked generally to
"check accessibility" or "check performance," don't stop at the single flagged page — sweep every
route and fix the shared component causing it. A violation reported on `/` from a shared
`Header`/`Carousel`/form component usually reproduces on every other page that renders it.

**Why:** Chitraket explicitly asked me to check what rules exist in the `website-v3` project
(a separate Next.js repo, `~/Desktop/website-v3`) and bring relevant ones over. That project's own
`feedback_a11y-perf-audit-method` memory documents this exact discipline, learned there when a
single reported `aria-prohibited-attr` violation on one page turned out to be reproduced across
20-30+ routes via a shared carousel wrapper — the user had explicitly asked to "check every page
and component," and a narrower fix would have left most of the real problem in place. Added to
[project_ramprate](project_ramprate.md)'s `CLAUDE.md` (2026-08-27) as a standing project rule, not just this memory.

**How to apply:** Two specific Next.js App Router pitfalls proven to recur (also from website-v3,
confirmed NOT currently present in ramprate-ui as of 2026-08-27, but worth checking on any future
audit here):
- A shared metadata/layout helper calling `headers()`/`cookies()` silently forces the whole site
  dynamic (kills static rendering, CDN caching, bfcache) — check `next build`'s route table for
  all/mostly-`ƒ (Dynamic)` as a first-pass signal.
- A barrel `index.ts` re-export can leak a heavy dependency (formik, a crypto polyfill, etc.) into
  every page's initial JS if a root layout imports a component through that barrel instead of
  directly — verify with a bundle analyzer before assuming a bundle-size finding is legitimate.
