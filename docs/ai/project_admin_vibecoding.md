# Admin Vibecoding

> Admin chat-driven site-editing platform at /admin — architecture, gotchas found during E2E testing, and standing requirements

Built (2026-08-27) a password-gated `/admin` panel where Chitraket chats with a Sonnet-backed
agent that edits real repo files (via GitHub's REST API) and Sanity content (as drafts), with a
manual Publish button that merges the PR and publishes matching drafts. See
[project_ramprate](project_ramprate.md) for general repo context.

**Confirmed decisions (don't relitigate without a new explicit ask):**
- Publish = merge a reviewed PR, never a direct commit to the default branch.
- Access = single shared password (`PORTAL_PASSWORD_ADMIN`, reusing `src/lib/portal-auth.ts`'s
  existing multi-portal pattern), not per-user accounts.
- Publish must stay gated on a test/build check (not auto-publish) — user explicitly re-confirmed
  this mid-build when asking about the publish button.
- File/image upload in the admin chat is a standing requirement, not a one-off ask — images are
  inlined as vision content, any attachment is retrievable via a `get_attachment` tool paired with
  `github_write_binary_file` for committing binary content.
- The admin agent's system prompt embeds the live `CLAUDE.md` at request time (`readFileSync`),
  not a hand-summarized version — user explicitly asked for this to avoid drift from the real
  house rules.

**Gotchas hit during real E2E testing — check these first in any future session touching this repo's GitHub automation:**
- **This repo's default branch is `master`, not `main`.** Any new GitHub API code must resolve
  the actual default branch (`GET /repos/{owner}/{repo}` → `default_branch`) rather than
  hardcoding `main` — this caused a real 500 on first test.
- **Cookie `path` must match the routes that read it.** A cookie scoped to `path: "/admin"` is
  never sent to `/api/admin/*` routes since that's a sibling path, not a subpath — silently broke
  session tracking (pending-changes always showed empty) until changed to `path: "/"`.
- **GitHub's combined-status endpoint genuinely does return `"pending"` while Netlify's deploy
  preview is building** (confirmed via real check-runs: "Redirect rules", "Header rules", "Pages
  changed" — all Netlify checks) — it took ~90 seconds to flip to `"success"` in testing, so don't
  assume a stuck "pending" is a bug without waiting a couple minutes first.
- **This repo has zero test framework** prior to this build — added Vitest (dev dependency) purely
  to satisfy the "tests must pass before Publish" requirement; only one test file exists so far
  (`src/lib/admin/guardrails.test.ts`).
- **`npm run lint` has ~574 pre-existing errors repo-wide**, unrelated to this feature (Hero.tsx,
  useFlowScopeContainer.ts, etc.) — confirmed `next build` does NOT fail on these (production
  builds succeed despite them), which is exactly why Publish is gated on the PR's real GitHub
  build-check status, not on `eslint` passing — an eslint-based gate would have been permanently
  red.
- **`ConditionalChrome.tsx`** (`src/components/shared/ConditionalChrome.tsx`) is the existing
  pattern for excluding the global Header/Footer on a route (previously only `/flow`) — added
  `/admin` to its `hideChrome` check. Any future full-page internal tool should use this same
  pattern rather than fighting the root layout.
- **File attachments failed with a generic "Request failed — try again."** — the original
  `MAX_ATTACHMENT_BYTES` (8MB) was set without accounting for the runtime: this app deploys via
  `@netlify/plugin-nextjs`, so `/api/admin/chat` runs as a Netlify Function, which hard-caps request
  payloads at 6MB. An 8MB file becomes ~10.9MB once base64-encoded, so Netlify rejected the request
  before it ever reached the route handler, returning a non-JSON error page — `res.json()` on the
  client then threw, landing in the generic catch block. Fixed 2026-09-01: lowered the limit to 3MB
  per file / 4MB combined (client `AdminChatClient.tsx` and server `route.ts`, kept in sync — no
  shared constants file exists for this yet), and made the client distinguish "payload rejected"
  from "network failure" instead of always showing the same generic message. This turned out NOT to
  be the actual blocker for real-world PDF use (see next item) — it was a real bug worth fixing, but
  the file that triggered the original report was only 132KB, nowhere near either limit.
- **PDFs were functionally unreadable by the agent** — only images were inlined into the model's
  context (`INLINE_IMAGE_TYPES`); PDFs were left out entirely, so the agent's only path to a PDF's
  content was the `get_attachment` tool, which hands back raw base64 as plain text. Claude cannot
  parse PDF structure out of a base64 blob, so any "read this doc and update the page" request had
  no real way to work. Fixed 2026-09-01: PDFs are now inlined as native Anthropic `document` content
  blocks (`type: "document", source: {type: "base64", media_type: "application/pdf", ...}`) — same
  mechanism as image vision support, confirmed against the installed SDK's `DocumentBlockParam`
  type. System prompt (`system-prompt.ts`) updated to tell the agent PDFs are already readable from
  context, so it doesn't waste tool calls on `get_attachment` trying to "read" one.
- **Netlify's free-plan synchronous function timeout is a hard 10 seconds — not configurable, and
  this caused a real production 504 on any non-trivial edit.** Confirmed via Netlify's own docs
  (`docs.netlify.com/build/functions/configuration/`) that timeouts are NOT settable in
  `netlify.toml` at all (the 60s figure that page states is a fixed default, not something plans or
  config can raise) and via Netlify's support forum that free/Starter is hard-capped at 10s
  specifically (Pro raises the *cap* to 26s, but that's still a different number than the docs'
  "default"; treat forum-confirmed real-world numbers as more reliable than a summarized docs fetch
  when they disagree). **First attempted fix was WRONG and broke every deploy**: added
  `[functions]\n  timeout = 26` to `netlify.toml`, which is invalid syntax — Netlify's actual schema
  reserves `functions.timeout` as a *table* for `external_node_modules` bundling config, not a
  scalar duration, and the build failed outright ("Configuration property functions.timeout must be
  an object") on every push from 47e3f9f until the revert at 7984b24. **Lesson: verify exact config
  schema against official docs or a real example before writing infra config, not from a
  paraphrased search summary** — the invalid syntax looked plausible enough from forum-post
  summaries alone. **Real fix (2026-09-01, commit 8680fde)**: redesigned `/api/admin/chat` so the
  server does exactly ONE Claude call (+ any tools it requests) per HTTP request instead of running
  the whole `MAX_TOOL_ITERATIONS`-step agentic loop inside a single request. If the turn isn't done,
  the server returns an opaque `turnState` (the full in-progress `Anthropic.MessageParam[]` plus
  accumulated `auditLog`/`downloads`/`iteration` count); `AdminChatClient.tsx`'s `send()` loops,
  automatically POSTing that `turnState` back until `done: true`, so from the admin's side it still
  looks like sending one message. This needed no Netlify plan change and no new hosting — it works
  within the free plan's real constraint rather than around it. Side effect: the daily call counter
  (`callsToday`) previously incremented once per user turn even though a turn could make up to 25
  real Claude API calls internally (a latent undercount of real spend) — now it counts one increment
  per actual step/call, so `DAILY_LIMIT` was raised from 20 to 150 to preserve roughly the same
  real-world headroom under the now-accurate count. **If future work touches this endpoint**: any
  new tool or code path must stay compatible with the fact that the server is fully stateless between
  steps of one turn — nothing may be assumed to persist in memory across requests except what's
  threaded through `turnState` or read fresh from GitHub/Sanity/cookies each time.
- **`max_tokens: 8192` silently dropped full-file rewrites of any moderately large page** —
  discovered 2026-09-01 via a real test, not inspection: wrote a standalone script
  (`tsx` against the actual `ADMIN_SYSTEM_PROMPT` + `ADMIN_TOOLS` + real Claude Sonnet 5 API, with
  `github_read_file`/`github_write_file` mocked to the local filesystem so nothing touched GitHub)
  and ran it against the real PDF and `src/app/sourcing/page.tsx` (~1057 lines / ~39K chars). At
  8192 tokens, the model's response for the `github_write_file` call on `page.tsx` got cut off
  mid-generation (`stop_reason: "max_tokens"`) — and the route's loop only checked
  `stop_reason !== "tool_use"` to decide the turn was "done," so a truncated response looked
  EXACTLY like a normal finish: no error, no write, just a short/empty final answer. This is very
  likely why PR #3's earlier session only ever touched `layout.tsx` (small file, fits easily) and
  never `page.tsx` (large file, silently truncated) — not purely the metadata-scoping prompt issue
  fixed earlier, though that was real too. Fixed (commit 4462c5b): raised `max_tokens` to 16000
  (re-ran the same test script at this value — completed cleanly with `stop_reason: "end_turn"`,
  correctly wrote both files, verified the exact written output with a real `tsc`+`eslint`+`yarn
  build` pass before discarding the scratch files) and added an explicit
  `stop_reason === "max_tokens"` check that now returns a clear 502 error instead of silently
  succeeding. **If a future page is large enough to truncate even at 16000, this needs the same
  treatment again — check for it explicitly, don't just raise the number blindly.**
- **When verifying a fix to this endpoint's actual behavior (not just "does it compile"), a
  standalone script that imports the real `ADMIN_SYSTEM_PROMPT`/`ADMIN_TOOLS` and drives the real
  Claude API, with only `github_read_file`/`github_write_file` mocked to the local filesystem, is a
  fast and safe way to get real evidence** — no GitHub writes, no auth/cookie setup needed (skips
  `route.ts`'s Next.js request plumbing entirely), costs one real Sonnet call chain. This is how the
  `max_tokens` bug above was actually found, not guessed at from reading code. Worth reaching for
  again before claiming a system-prompt or agent-loop change "should" fix something.
- **`AdminChatClient.tsx` had a hydration mismatch from reading `localStorage` inside a `useState`
  lazy initializer** (`useState(() => loadStoredMessages())`). That initializer runs during SSR too,
  where `localStorage` doesn't exist — server always rendered empty chat history, but client
  hydration re-ran the same initializer with real `localStorage` available, pulling in real history
  from prior sessions (guaranteed to exist after all the testing this build has had). The "Clear
  chat" button only renders when history is non-empty, so it appeared only on the client — classic
  Next.js hydration mismatch. Fixed (commit 9fa1611) with `useSyncExternalStore`: server snapshot
  and the client's FIRST hydration-pass snapshot are both the same stable empty array, avoiding the
  mismatch; the real client snapshot swaps in immediately after, before any passive effect can see
  stale data. This is React's documented mechanism for exactly this "browser-only data source"
  problem — a manual mount-`useEffect` + `setState` was tried first but correctly flagged by a
  newer, stricter eslint rule (`react-hooks/set-state-in-effect`). **Two real gotchas hit while
  building this, worth remembering for any future `useSyncExternalStore` use in this repo**: (1) both
  the client `getSnapshot` and server `getServerSnapshot` functions MUST return a referentially
  stable value across repeated calls with no underlying change — a fresh `[]` or freshly-parsed-JSON
  array on every call trips React's "should be cached to avoid an infinite loop" warning; cache the
  loaded value in a module-level variable / shared constant instead of computing fresh each call. (2)
  Verified this fix for real — not just "should work" — with a standalone script rendering the
  actual component via `react-dom/server` (SSR) then `react-dom/client` hydration inside `jsdom`
  (already an installed dependency, no new package added), with real chat history pre-seeded in a
  fake `localStorage`, checking whether React actually logs a hydration-mismatch console error. This
  caught a SECOND real bug along the way (the un-cached server snapshot above) that code review
  alone hadn't caught.
- **PR #3 got published (merged, commit fba7e57) with ONLY the `layout.tsx` metadata/testimonials/
  JsonLd changes from the Aug 31 session** — the admin (Chitraket) clicked Publish before the
  `page.tsx` fix (H1/hero/section copy) was ready. This means the live site briefly had a real
  mismatch: SEO title says "Enterprise IT Infrastructure Consulting Services" but the H1 still says
  the old "AI Studies the Process. We Get the Deal Done." copy — until a follow-up admin chat request
  (now that `max_tokens` is fixed) actually updates `page.tsx` to match. Flag this if it comes up
  again — the fix is a normal follow-up PR, not a rollback.

**Security items surfaced, not fixed as part of this build (flagged to user, action is theirs):**
- The git remote URL had a classic GitHub PAT embedded in plaintext
  (`https://token:ghp_...@github.com/...`) — told user to rotate it; not touched by this session.
- Several classic PATs on the GitHub account (`manus-tony-token`, `manus token`,
  `manus-git-token-classic`) carry `admin:org`/`admin:enterprise`/`delete_repo` scope, no
  expiration, and show "Never used" — flagged for review/revocation, not actioned.
- `PORTAL_PASSWORD_ADMIN` was set to a weak, guessable value (`ramprate-admin`) per explicit user
  choice after being offered a strong random one — flagged once, respected the user's call.

**Key files:** `src/lib/admin/github-client.ts` (raw-fetch GitHub API wrapper, no octokit — matches
existing raw-fetch convention for Sanity writes), `src/lib/admin/session.ts` (signed branch/PR
cookies), `src/lib/admin/tools.ts` + `src/lib/admin/system-prompt.ts` (agent tools + prompt),
`src/app/api/admin/{chat,pending-changes,publish}/route.ts`, `src/components/admin/AdminChatClient.tsx`.

**Not yet done:** real Netlify env vars (`PORTAL_PASSWORD_ADMIN`, `GITHUB_TOKEN`) still need to be
mirrored from local `.env` into Netlify's dashboard before this works in production, not just
locally.
- **Session cookie can outlive its branch, crashing every request with a raw GitHub 404** — hit
  live 2026-09-01: PR #3 got merged/its branch deleted, but the browser's 8-hour session cookie
  still pointed at it, so every `compareToDefaultBranch`/`listDir`/etc. call 404'd and the whole
  request 500'd, repeatedly, since nothing ever cleared the stale cookie. Fixed (commit 4bbe739):
  exported `isNotFound` from `github-client.ts`; `chat/route.ts` now calls `branchExists()` up
  front and resets to a fresh session (clearing the cookie) if the stored branch is gone instead of
  crashing mid-turn; `pending-changes/route.ts` catches the same 404 and returns an empty pending
  state instead of a 500. **Always run `npx prettier --check` (not just eslint) on any file before
  pushing** — missed this twice in a row tonight (PR #4's CI failed on a Prettier-only issue that
  eslint didn't catch) before remembering this repo's CI runs them as separate steps.
- Also shipped tonight: `/sourcing` H1/section-copy update (PR #4, merged) completing the content
  brief whose metadata-only half landed via PR #3 — see the `max_tokens` bug entry above for why
  the agent never got to `page.tsx` in the original attempt.

- **The one-Claude-call-per-request split was NOT enough — a single step still 504'd on free
  Netlify (2026-09-02).** `/api/admin/chat` still called `client.messages.create()` (non-streaming),
  which blocks until the *entire* Claude response is built. On a big pasted brief + a full-file
  rewrite of `/sourcing/page.tsx`, that one call alone runs well past the free plan's ~10s
  synchronous cap → Netlify returns a raw 504 HTML page → client's `res.json()` throws → user sees
  *"Server returned an unreadable response (status 504)."* **Fix: converted `/api/admin/chat` to a
  streaming SSE route handler.** Netlify gives a *streaming* response ~60s (vs ~10s synchronous),
  available on the free/credit-based plan. Implementation notes for anyone touching this again:
  - Route returns `new Response(ReadableStream, {headers: {"Content-Type":"text/event-stream",
    "Cache-Control":"no-cache, no-transform","X-Accel-Buffering":"no"}})` with `export const
    dynamic = "force-dynamic"`. First thing enqueued is a `: open\n\n` comment frame to force
    headers to flush immediately, before any GitHub/Claude latency.
  - Uses `client.messages.stream(...)`, `.on("text", d => emit({type:"text",delta:d}))`, then
    `await mstream.finalMessage()` for the full message to run tools against. SDK is
    `@anthropic-ai/sdk@0.78.0`.
  - SSE event types: `text` (live delta), `status` (stepLabel before tools run), and one terminal
    `done` / `step` / `error`. The client keeps its existing multi-step loop — on `step` it
    re-POSTs `turnState` exactly as before; only the transport changed.
  - **Cookie gotcha:** a streamed response has already flushed its headers by the time a branch is
    created mid-stream, so `/api/admin/chat` can no longer `setAdminSessionCookies`. `branch`/
    `prNumber` are now also threaded through `turnState` (intra-turn continuity no longer needs the
    cookie), and a new tiny **`POST /api/admin/session`** route owns cookie writes: client calls it
    once a turn settles (`await`ed on `done` so Publish is safe, fire-and-forget on `step`). That
    route re-validates the branch (`startsWith(ADMIN_BRANCH_PREFIX)` + `gh.branchExists`) before
    trusting it into the signed cookie, and clears the cookie when called with `branch: null`.
  - Files: `src/app/api/admin/chat/route.ts` (rewritten), `src/app/api/admin/session/route.ts`
    (new), `src/components/admin/AdminChatClient.tsx` (`send()` now reads the SSE stream; added
    module-level `persistSession()` + `ChatEvent` type). Verified: `tsc`, `eslint` (clean on
    touched files), `prettier --check`, `vitest` (14 pass), `yarn build` all green. The lone build
    warning (`code-check.ts:52` dynamic-fs-tracing) is pre-existing, not from this change.
  - Not yet verified against real deployed Netlify — the 60s streaming limit is from Netlify docs/
    forum, same caveat as the 10s number. If a single step's Claude call still exceeds 60s, the
    stream ends with no terminal event; the client shows "response was cut off (server time
    limit)" and there's no turnState to resume from — would need server-side loop chunking with a
    ~50s self-imposed cutoff that emits a `step` early.

- **2026-09-04: Added a remote MCP server at `/api/mcp` as an alternative front-end to the same
  edit tools**, after the chat UI's repeated timeout/streaming/polling firefighting (10 straight
  "bug fix" commits, then a same-day SSE→background-job+poll rewrite) made Chitraket ask to
  eliminate that whole custom orchestration layer. With Claude Desktop/Code driving tool calls
  instead of this app's own agentic loop, there's no more in-house streaming, job-runner, or
  turnState-threading code to keep fighting Netlify's timeouts with — see [project_ramprate](project_ramprate.md) for
  general context. **New dependency added with explicit user sign-off** (`@modelcontextprotocol/sdk`
  `^1.30.0`) — CLAUDE.md requires discussing new deps first; asked, got yes.
  - Reused `runAdminTool`/`ADMIN_TOOLS` from `tools.ts` as-is (already transport-agnostic via
    `AdminToolContext`) — no changes needed there. Excluded `get_attachment`/`create_download` from
    the MCP tool list (chat-attachment-only concepts). Added `list_pending_changes` and
    `publish_changes` as MCP-only tools mirroring the existing `pending-changes`/`publish` routes.
  - **Auth: a new `MCP_ADMIN_TOKEN` bearer secret, not `PORTAL_PASSWORD_ADMIN`** — user's explicit
    choice when asked, specifically because that portal password is already known-weak (chosen
    deliberately by the user earlier, flagged once) and this would have made it double as a machine
    credential. Still needs to be added to Netlify's env vars for production, same as the other
    admin secrets.
  - **Stateless-by-design, no cookies at all**: built on the SDK's
    `WebStandardStreamableHTTPServerTransport` (`sessionIdGenerator: undefined`, one fresh `Server`
    per request) instead of anything session-based, because Netlify Functions guarantee no memory
    between invocations — the exact constraint that forced the chat UI's cookie/turnState design
    through multiple rounds of bugs. Every tool call resolves "the pending change" fresh via
    `gh.findOpenAdminPR` (same single-operator, one-PR-at-a-time assumption the chat UI already
    makes). New file `src/lib/admin/mcp-tool-context.ts`.
  - **Real bug caught before shipping, not just by inspection**: the first draft of
    `ensureWriteBranch` created a branch but never opened its PR. Since `findOpenAdminPR` only
    queries *open PRs* (not bare branches) by prefix, a later independent tool call would never find
    that branch again — every write would've silently forked a new orphan branch instead of
    continuing the same pending change. Fixed by adding a `finalize()` step (opens the PR the
    instant a branch has its first commit — any earlier and GitHub rejects the PR for having no
    diff from base) called right after every write-capable tool call.
  - **Verified for real** (not just "should work"): ran the actual dev server, drove it with a real
    `@modelcontextprotocol/sdk` `Client` over `StreamableHTTPClientTransport` — confirmed 401
    without the bearer token, a real `tools/list` (16 tools), a real `github_list_dir` call against
    the actual repo, and — the important one — wrote a real throwaway file
    (`mcp-verify-test.txt`), confirmed it opened PR #12 with a branch, then opened a **second,
    independent client connection** and confirmed `list_pending_changes` found that same PR with
    zero shared state. Closed PR #12 (unmerged) and deleted its branch immediately after — no trace
    left in the real repo. `tsc`, eslint, prettier, and the existing Vitest suite (38 tests) all
    green on the touched files.
  - **Team distribution, verified via a research pass, not guessed**: (1) Claude Code — added a
    `.mcp.json` at the repo root declaring this server with `Authorization: Bearer
    ${MCP_ADMIN_TOKEN}` (env-var reference only, no literal secret, safe to commit) — anyone who
    opens this repo in Claude Code gets prompted to approve it and it reads their own local env var.
    (2) Claude.ai Team/Enterprise — an org admin CAN add a custom connector once (Admin settings →
    Connectors → Add → Custom) with a static `Authorization: Bearer <token>` request header (no
    OAuth needed, this header-auth feature is in beta on some orgs) and it becomes available to
    every workspace member automatically; Team or Enterprise only, not Pro/Free.
  - **User explicitly does NOT want to pay more for this** — confirmed this migration actually
    *removes* metered cost: the old `/admin` chat panel billed the user's own `ANTHROPIC_API_KEY`
    per token (that's why a daily call-limit counter existed in its code); MCP tool calls are
    instead driven by whatever Claude subscription the connecting app is logged into, not that API
    key.
  - **ChatGPT needed a second auth path**: ChatGPT's connector UI (Settings → Connectors →
    Advanced → Developer Mode, Plus/Pro/Team+ only) only offers OAuth or "No Authentication" for a
    custom remote MCP server — no static bearer-header option like Claude Code/Desktop support
    (verified via a research pass, not assumed). Rather than stand up a full OAuth server (real
    option, ~a day of work via a hosted provider like Auth0/WorkOS, explicitly offered to the user),
    user chose the lighter path: added `src/app/api/mcp/[token]/route.ts`, a second route taking the
    same `MCP_ADMIN_TOKEN` as a URL path segment instead of a header, for use with ChatGPT's
    "No Authentication" mode. Refactored the actual server-building logic into
    `src/lib/admin/mcp-handler.ts` (`respondToMcp`) shared by both routes, and split
    `mcp-auth.ts`'s check into `isValidMcpToken()` (used by both) and `isMcpRequestAuthorized()`
    (header-only, used by the original route). Verified both paths for real against the dev server,
    including a deliberate wrong-token 401 check on the path-based route.
  - **2026-09-04: removed `/admin` entirely** — user explicitly confirmed after MCP was fully
    verified (both auth paths, real write+PR+independent-read-back). Deleted: `src/app/admin/`,
    all of `src/app/api/admin/`, `src/components/admin/AdminChatClient.tsx`,
    `netlify/functions/admin-job-runner.mts`, and the chat-loop-only lib modules
    (`agent-step.ts`, `system-prompt.ts`, `session.ts`, `job-store.ts`, `rate-limit.ts`,
    `workflow-steps.ts`) plus their tests. **Kept** (still used by MCP):
    `github-client.ts`, `guardrails.ts`, `tools.ts`, `sanity-content.ts`, `seo-check.ts`,
    `lighthouse-check.ts`, `code-check.ts`, all `mcp-*.ts`. Follow-on cleanup: removed `"admin"`
    from `PORTAL_IDS` in `src/lib/portal-auth.ts` (simplified `cookieMaxAgeFor` since the 4-hour
    admin-only case no longer exists — inlined the resulting constant at its one call site in
    `api/private-portal/route.ts` instead of keeping a now-trivial wrapper function), dropped
    `/admin` from `ConditionalChrome.tsx`'s hide-chrome check, removed the now-empty
    `netlify/functions` `[functions]` block from `netlify.toml`, uninstalled the now-unused
    `@netlify/blobs` dependency (only consumer was the deleted `job-store.ts`). Re-verified clean
    after: `next build`, `tsc --noEmit`, full `eslint` (574 pre-existing repo-wide errors unchanged,
    none new), `vitest` (18 tests, all passing). `PORTAL_PASSWORD_ADMIN` and `ANTHROPIC_API_KEY` left
    in `.env` untouched (harmless if unused; `ANTHROPIC_API_KEY` is still used elsewhere by
    `api/ai/route.ts` and `api/payments-rfp/route.ts`, unrelated to admin).
  - **Real behavior change worth remembering**: the old chat UI's system prompt embedded this
    repo's actual CLAUDE.md into every request; the MCP server has no system prompt of its own at
    all — whatever Claude/ChatGPT session connects supplies its own reasoning and whatever repo
    context it happens to have (Claude Code opened in this repo sees CLAUDE.md naturally; a
    Claude.ai Team connector or ChatGPT session does not). Documented in CLAUDE.md so future tool
    description edits don't assume house-rule context reaches the model for free.
  - Added `^src/app/api/mcp/` to `guardrails.ts`'s `DENYLIST_PATTERNS` so the agent (via either
    interface) can't edit its own MCP gate — `src/lib/admin/` was already covered, so the new
    `mcp-*.ts` lib files needed no separate entry.
  - Files: `src/app/api/mcp/route.ts`, `src/lib/admin/mcp-server.ts`, `src/lib/admin/mcp-auth.ts`,
    `src/lib/admin/mcp-tool-context.ts`, `.mcp.json` (repo root).

- **2026-09-04, same session: added an interactive MCP Apps widget for `list_pending_changes`**,
  after fixing a real PR (#13) live through the new MCP server proved the base tool-calling worked.
  MCP Apps is a real, verified-via-direct-fetch open standard (launched 2026-01-26, absorbed the
  earlier "MCP-UI" project) that Claude and ChatGPT both render — confirmed by fetching
  `blog.modelcontextprotocol.io` and `claude.com`'s actual posts, not trusting a research agent's
  summary at face value (that first pass had suspiciously tidy claims; verifying it directly turned
  out to be the right call — it checked out as real, but the underlying package needed for the
  interactive piece turned out to be `@modelcontextprotocol/ext-apps`, the official successor, not
  the `@mcp-ui/server` predecessor the research agent suggested first).
  - **Sequenced deliberately, not built as one shot**: shipped the read-only status card first
    (check status, changed files, preview link) and verified it rendering correctly in production
    with a real MCP client (`resources/list`, `resources/read`, and the tool's `_meta` all checked)
    *before* adding the interactive Publish button on top — catching a rendering bug at that stage
    would have been much harder to isolate with both pieces built at once. Both were separate
    commits/deploys for the same reason.
  - **Ended up needing zero new dependencies**, contrary to the initial assumption. The client-side
    protocol runtime (`@modelcontextprotocol/ext-apps`'s `App` class — capability handshake, sizing,
    theming, the `callServerTool` bridge) loads from `esm.sh` at browser/iframe render time, so it
    never touches this server's own bundle. Server-side, the "convenience" helpers
    (`registerAppTool`/`registerAppResource`) are just thin wrappers over the low-level `Server`
    class's `_meta` fields and `resources/list`+`resources/read` handlers — all of which the already
    -installed `@modelcontextprotocol/sdk` supports natively. Verified this by extracting the real
    `.d.ts` files from the npm-packed tarball (`npm pack` + `tar xzf`, not `npm install`) rather than
    trusting doc-summary snippets, after noticing the docs page's own example cited a stale package
    version (0.4.1 vs the actual published 1.7.5).
  - **Publish button needed no server-side visibility change**: MCP Apps tool visibility defaults
    to `["model", "app"]`, so `publish_changes` was already callable from the widget's
    `app.callServerTool({name: "publish_changes"})` with no `_meta` changes — verified via the
    actual shipped type definitions' doc comments, not assumed.
  - **Real UX bug caught and fixed same session**: the widget's first version showed "Open preview"
    whenever `previewUrl` was present, but Netlify's own preview-build check can finish (populating
    `previewUrl`) while other checks (lint, tests) are still running or have failed — misleading in
    both cases. Fixed by gating the preview link (and the whole action row) on
    `checkStatus === "success"`, with an explicit "please wait" / "needs a fix" message otherwise.
  - Two-step confirm (Publish → Confirm publish) inside the widget instead of `window.confirm()`,
    since modal dialogs aren't reliably available inside a sandboxed iframe.
  - Files: `src/lib/admin/mcp-ui-widgets.ts` (new — the HTML/CSS/JS resource), plus the
    `resources: {}` capability, `ListResourcesRequestSchema`/`ReadResourceRequestSchema` handlers,
    and `_meta` on `list_pending_changes` in `mcp-server.ts`.

- **Model passed a JSON-quoted path (`""` → `%22%22`) to `github_list_dir` and 404'd
  (2026-09-02).** `tools.ts` did `String(input.path ?? "")` with no sanitizing, so a literal
  two-quote string reached `gh.listDir` → `encodeURI('""')` = `%22%22` →
  `GET /repos/RRTONY/ramprate-ui/contents/%22%22 -> 404`. Fixed: added `normalizeRepoPath()` in
  `tools.ts` (strips surrounding `"`/`'` quotes, leading `./` and `/`, trailing `/`; maps `.`,
  `/`, `root`, `""` → `""` = repo root) and applied it to every repo-path tool (`github_list_dir`,
  `github_read_file`, `github_write_file`, `github_delete_file`, `github_write_binary_file`,
  `check_code_quality`); the write/read/delete cases now return a clear "path is required" error
  on an empty path instead of hitting the API. `github-client.ts` `listDir` also now builds
  `/contents` (no trailing segment) for the repo root instead of `/contents/`. Tool schema
  description for `github_list_dir.path` updated to tell the model to use `""` (not quotes/`.`/`/`)
  for root. All green: tsc, eslint, prettier, vitest (14), `yarn build`.

**Update 2026-09-26: `MCP_ADMIN_TOKEN` removed.** The single shared token described above leaked in a screen share and was replaced by per-person access (`MCP_ADMIN_USERS`, roles read/edit/write) plus a RampRate sign-in page (OAuth, `src/lib/admin/mcp-oauth.ts`). The server never accepts `MCP_ADMIN_TOKEN` now; `.mcp.json` holds only the URL and Claude Code signs in through the browser. See AGENTS.md "MCP server".
