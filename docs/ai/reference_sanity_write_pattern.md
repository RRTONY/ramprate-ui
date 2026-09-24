# Sanity Write Pattern

> How to write/patch Sanity content programmatically in this repo — a persistent write client now exists (src/lib/sanity/write-client.ts) for the admin chat; one-off scripts can also still use SANITY_API_TOKEN directly

**Update (2026-08-27):** A persistent write client now exists at `src/lib/sanity/write-client.ts`
(`@sanity/client`, `SANITY_API_TOKEN`, Editor role required), built for the admin vibecoding
platform — see [project_admin_vibecoding](project_admin_vibecoding.md). It always writes to `drafts.<id>` via helpers in
`src/lib/admin/sanity-content.ts` (`patchDraft`, `createDraft`, `publishDraft`,
`listPendingDrafts`), never touching the published doc directly. For app-code Sanity writes going
forward, prefer reusing that client/helpers over a fresh one-off script. The one-off script pattern
below is still valid for ad-hoc content patches outside the admin chat.

`src/lib/sanity/client.ts` only exports a read-only client (`useCdn: false`, no token). All blog/thinking post content lives in Sanity, not in repo files — there is no local MDX/content directory, so editing post bodies requires either Sanity Studio UI or a script using the write token.

`.env` has `SANITY_API_TOKEN` (unused by any app code) plus `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`. For a one-off content patch: write a small `.mjs` script using `@sanity/client`'s `createClient({...token})`, run it via `node -r dotenv/config <script>`. It must be placed inside the project root (or anywhere `node_modules` resolves from) since `@sanity/client` is only installed there — running from an external scratch dir throws `ERR_MODULE_NOT_FOUND`. Delete the temp script after running (don't commit throwaway patch scripts).

For targeted patches to array fields (e.g. a specific portable-text link's `href`), use Sanity's bracket-filter patch paths: `body[_key=="<blockKey>"].markDefs[_key=="<linkKey>"].href`. Always dry-run first (`patch.serialize()`) before `.commit()` on a live/published document.

**Why:** Discovered 2026-08-19 while updating 3 CTA links in the-tollbooth-and-the-alternative blog post — see [project_talk_to_us_page](project_talk_to_us_page.md). No write client existed because nothing in the app previously needed to mutate Sanity content from server code.

**How to apply:** Reuse this pattern for future one-off Sanity content edits requested outside Studio. Don't build a persistent write client into the app unless a recurring need shows up — the user has not asked for that yet.
