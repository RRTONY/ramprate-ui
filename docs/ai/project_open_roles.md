# Open Roles page (/roles)

Built 2026-10-24 from Darryl's "roles-package" (a plain HTML/CSS/JS package meant for both
ramprate.com and impactsoul.is). On ramprate.com it was rebuilt as native Next.js pages at the
team's request, keeping the package's sections, order, wording and behaviour. The ImpactSoul copy
(WordPress) is separate and not in this repo.

## Where things live

- `src/lib/roles.ts`: the roles list, `ROLES_PREVIEW` flag, Tony's screening banner text,
  knockout minimums, visibility rules and the Dover link builder.
- `src/app/roles/page.tsx`: listing. `src/app/roles/[slug]/page.tsx`: one role (static, unknown
  slugs return a real 404 via `dynamicParams = false`).
- `src/components/roles/`: `PrescreenForm` (the two required questions), `RoleLink` (carries the
  `?src=` origin tag from the listing to the role page), `PreviewBar`.
- `/roles` is in the header's `lightBgPaths`. Tests: `tests/roles.test.ts`.

## Differences from the package

- Role URLs are `/roles/<slug>`, not `/roles/role.html?role=<slug>`. Origin tags work the same:
  `/roles/<slug>?src=linkedin` (allowed: braintrust, linkedin, referral, ats_board; anything else
  falls back to `ramprate_site`).
- Roles are compiled into the page, not served as a public `roles.json`, so Draft roles are not
  downloadable once preview is off. The package README's "remove Draft roles, the file is public"
  step does not apply here.
- The Dover link must be https or it is treated as not set up.

## Rules (from the brief)

- Do not publish until Sam and Tony approve. Do not reword Tony's banner. Structure changes need
  Sam's review. No paid plugins/services without Tony. Never name the client (TSI) on these pages
  (a test checks the role data).

## Go-live checklist

1. Sam and Tony approve; role text replaced with the approved EAP PDF wording.
2. Real Dover link in `apply_url` (from Kim), one test application checked in Dover, including
   whether the `src`/`role`/`site` tags arrive.
3. Role `status: "Approved"`, then `ROLES_PREVIEW = false` (removes the bar and noindex).
4. Add `/roles` to `STATIC_ROUTES` in `src/lib/registered-urls.ts` (sitemap) and to `SITE_PAGES`
   in `src/lib/site-pages.ts` (search + chatbot), and link it from `/careers`.

## Open items

- Exact wording of Tony's 10-year relationships knockout question (confirm with Kim).
- Whether `/careers` should redirect to `/roles` (Sam and Tony).
