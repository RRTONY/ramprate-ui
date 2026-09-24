# Client Intake

> New /client-intake page: 8-step BioChain Sourcing demand-side intake form, built from screenshots, mirrors supplier-intake backend

**Note:** all `/vendor-intake`, `vendor-intake-fields.ts`, and `VendorIntakeForm` references
below are historical - that feature was renamed to `/supplier-intake` /
`SupplierIntakeForm.tsx` / `supplier-intake-fields.ts` on 2026-07-10, see
[project_supplier_intake](project_supplier_intake.md). The page itself also moved: `/client-intake` →
`/biochain/buyer-intake` (see [project_biochain_sourcing](project_biochain_sourcing.md) route-group note). Paths
below reflect what was true when this memory was written; see the 2026-07-21 section
at the bottom for current state.

---

**2026-07-21 — Full QA pass + human-gated two-stage flow.** User did a hands-on
review of live `/biochain/buyer-intake` and reported 15 findings (validation gaps,
wrong interaction patterns, UX decisions, feature requests). All implemented in one
session:

- **Validation:** website (regex, lenient bare-domain-or-URL), phone (digit-count
  7-15, same rule as `formShared.tsx`'s supplier-form validator, re-implemented
  locally in `ClientIntakeForm.tsx` rather than importing — those helpers aren't
  exported), Step 5 spend breakdown fields (currency regex + `$`-prefixed
  `CurrencyField` component, USD-only per user decision, no currency selector added).
- **Interaction fixes:** "How did you find your suppliers" → multi-select
  (`CheckboxGroup` instead of `SelectField`); "Other" under pain points now reveals a
  required `pain_points_other_text` field; Step 3 requires ≥1 product (schema-level
  `.test()` across all `PRODUCT_FIELD_NAMES`, error surfaces via synthetic
  `products_any` field key); Step 4 "Key Delivery Regions" now required.
- **Decided items:** Pricing Origin Preference options `"US-sourced only"` and
  `"No preference — advise us"` are now mutually exclusive with everything else
  (`CheckboxGroup` gained an `exclusiveOptions` prop) — user's call, not a guess.
- **Step 3 visual pass:** product catalogue (13 categories) is now a collapsible
  accordion (`CategoryAccordion`) inside a `CatalogCard` wrapper, separated visually
  from Delivery Format and Volume, which got their own `CatalogCard`s too.
- **Catalogue extracted + linked:** `PRODUCT_CATEGORIES`/`catField` moved out of
  `ClientIntakeForm.tsx` into `src/lib/biochain-catalogue.ts` (shared, so no
  duplication) and a new read-only `/biochain/catalogue` page was built from it.
  Linked from the BioChain landing page ("Two Ways to Join" section) and from the
  site header — header link only renders when `pathname.startsWith("/biochain")`,
  not site-wide (a global "Browse Catalogue" link made no sense on unrelated
  practice pages).
- **Review screen:** added before final submit — reuses the actual Step1-8
  components wrapped in `<fieldset disabled>` inside `ReviewSummary`, rather than
  duplicating field labels in a separate summary view. Each section has an Edit
  button that jumps back to that step.
- **Tooltips:** added a lightweight CSS-hover `Tooltip` component (no dependency) for
  API/cGMP jargon on the Pricing Origin and Pain Points checkbox groups only —
  native `<select>` options can't hold JSX, so tooltips aren't feasible on
  `SelectField`-based fields.

**Auto-save + resume — human-gated by explicit user decision, not self-service.**
User was asked directly and confirmed: mirror the supplier Stage 1→Stage 2 pattern
*exactly*, including the manual approval wait, even though this adds real friction to
a self-serve lead form. Implementation:
- Form is now two-stage. Fresh visit with no `?token=` shows **only Step 1**
  (org + contact info) with a single Submit button — posts
  `formStage: "stage1-client-intake"` to `/api/client-intake`, shows a "we'll be in
  touch" holding screen, and stops. There is no way to reach Steps 2-8 in the same
  sitting.
- `scripts/supplier-intake-apps-script.gs` (still untracked in git, sits alongside
  the handoff docs in `scripts/`) gained a parallel client-intake path: `handleAppend`
  writes `Client Token` / `Stage 2 Link`
  / `Stage 2 Status: Pending` / `Stage: 'Stage 1 Submitted'` on a
  `stage1-client-intake` submit, sends `sendClientStage1ReceiptEmail`. A human must
  manually flip that row's `Stage` cell to `"Approved for Stage 2"` in the Sheet —
  the existing `onStageEdit` trigger now branches on whether the row has a
  `Client Token` column (client) vs `Supplier Token` (supplier) and sends
  `sendClientStage2InviteEmail` with the resume link. `findRowByToken` was
  generalized to check both token columns. New `handleClientStage2Update` (mirrors
  `handleStage2Update`, no scoring logic) handles autosave-on-step-change and final
  submit by token; final submit sends `sendClientStage2ReceiptEmail` (the
  confirmation email item from the QA list).
- `/api/client-intake/route.ts` gained a `GET` handler (prefill-by-token, mirrors
  `supplier-intake-long`'s route) and the `POST` body now passes through
  `formStage`, `clientToken` (from body's `token`), `stage2UrlBase`, `final`.
- Frontend (`ClientIntakeForm.tsx`): reads `?token=` via `useSearchParams` (page.tsx
  now wraps the form in `<Suspense>`, required by Next.js for that hook). No token →
  `stage1` phase (Step 1 only). Token present → fetches saved values, starts at
  `active=1` (Step 2), Back button floors at step 1 (can't re-edit Step 1 post
  approval). `goToStep`/`proceedToReview` fire a best-effort `saveDraft()` autosave
  on every successful step advance.
- **Action needed:** this only works after `scripts/supplier-intake-apps-script.gs`
  is redeployed to Apps Script — same manual redeploy step already pending for the
  supplier-intake side per [project_supplier_intake](project_supplier_intake.md). Both should be redeployed
  together since they're the same script file.

Built `/client-intake` (2026-07-08): an 8-step multi-step intake form for BioChain
Sourcing's demand side (clinics/practices wanting sourcing help), as the counterpart
to the existing supply-side `/vendor-intake` (see [project_supplier_intake](project_supplier_intake.md)). Origin:
user pasted ~40 screenshots of a rendered 8-step wizard mockup ("RampRate BioChain
Sourcing — Client Intake Application") and asked to build it as a real page — content
was transcribed directly from the screenshots (org info, current sourcing, a ~150-item
peptide/biologic product catalog across 12 categories, delivery formats, logistics,
spend, compliance, customers, goals).

**Files:** `src/app/client-intake/page.tsx` (hero + section-warm wrapper, matches
`/vendor-intake`'s page pattern exactly), `src/components/biochain/ClientIntakeForm.tsx`
(~950 lines, Formik + Yup, same styling tokens/conventions as
`src/components/vendor/VendorIntakeForm.tsx` but a linear step-progress-bar +
dot-indicator UI instead of VendorIntakeForm's tab bar, since that's what the source
screenshots showed), `src/lib/client-intake-fields.ts` (field-count constants,
same convention as `vendor-intake-fields.ts`), `src/app/api/client-intake/route.ts`.

**Backend reuses the vendor-intake Apps Script**, not a new one: posts to the same
`GOOGLE_APPS_SCRIPT_URL`, but overrides `projectName` to `<hostname>-client-intake`
(vendor-intake's route derives `projectName` from referer hostname alone, which would
collide both forms into the same Sheet tab on the same domain — see the
"multi-tenant" note in [project_supplier_intake](project_supplier_intake.md), that mechanism differentiates
*sites*, not multiple forms on the same site). This distinct projectName gives
client-intake its own Sheet tab/Drive folder automatically (Apps Script auto-creates
per projectName). Same local `.env` `GOOGLE_APPS_SCRIPT_URL` covers both forms —
if that var is still missing from Netlify's production env (unresolved as of the
last vendor-intake session), `/client-intake` will hit the exact same 500 in
production that vendor-intake would.

**Deviations from the source mockup, deliberate:**
- Kept the full site chrome (Header/Footer) instead of the mockup's chrome-less
  cream page with black top/bottom bars — followed the established
  vendor-intake page pattern (dark hero + `section-warm` wrapping the form) per
  [project_ramprate](project_ramprate.md) "prefer editing/matching existing patterns" convention.
- The mockup's final "Submit Application" button was blue — changed to a dark-gold
  tone instead, since [project_ramprate](project_ramprate.md) CLAUDE.md explicitly forbids introducing
  arbitrary blue/non-brand colors.
- Fixed two stale/inconsistent numbers baked into the mockup's own copy: "6 sections"
  → "8 sections" (mockup actually has 8 steps), and "~13 minutes total" → recomputed
  from the sum of each step's own displayed per-step minute estimate (~20 min) —
  same category of bug as the "Four practices" stale-count issue in
  [project_ramprate](project_ramprate.md), caught by cross-checking the copy against the actual content
  rather than transcribing it verbatim.

**Not yet linked from anywhere in the live site** — user explicitly asked NOT to
repoint biochain-sourcing's CTAs to it after initially approving that change (see
[feedback_ambiguous_corrections](feedback_ambiguous_corrections.md)), so it currently only exists as a standalone
route with no inbound nav/CTA link. If a later session is asked to "make the intake
form discoverable," this is the page to wire up.

**Search/AI discoverability added (2026-07-08, same day):** even with no nav/CTA
link, the user asked for `/client-intake` to be findable via site search — added to
both mechanisms per [project_ramprate](project_ramprate.md)'s "two separate hardcoded search systems"
note: `NAV_INDEX` in `src/components/shared/SiteSearch.tsx` (keywords: "client
intake", "become a client/customer", "patient intake", "clinic intake", "sourcing
audit", "biochain sourcing", peptide/exosome/stem cell/NAD+ terms) and a new
"CLIENT INTAKE (Become a Client)" section in `RAMPRATE_SYSTEM_PROMPT`
(`src/lib/ramprate-knowledge.ts`), mirroring the vendor-intake entries added earlier
the same session. Checked `/search` (`src/app/search/page.tsx`) too — it only runs
GROQ `match` queries against Sanity blog posts via `searchPostsQuery`, no mechanism
for static pages (vendor-intake isn't indexed there either), so nothing to add there.

**Added to Header nav (2026-07-08, same day):** despite the earlier explicit "don't
link biochain-sourcing's CTAs to it" instruction, the user separately asked to add
it to the site-wide "Become a..." header dropdown ([project_ramprate](project_ramprate.md) Header
dropdown pattern) — added `{ label: "Become a Client", href: "/client-intake", desc:
"BioChain sourcing" }` to the `becomeA` array in `Header.tsx`, right after "Become a
Supplier". No other changes needed since both desktop and mobile menus already map
over that array. This shows the "no CTA link" instruction was scoped narrowly to
biochain-sourcing's own page CTAs, not a blanket "keep this page unlinked" — worth
re-reading as case-by-case scope, not a standing rule, if asked about this page again.
