# RampRate UI - Claude Rules

## Workflow Rules (Always Follow)

1. **Create a todo list before starting any task** - even a small one. Use `TodoWrite` immediately after the user sends a request.
2. **One task at a time** - mark a task `in_progress` before working on it, `completed` the moment it is done. Never have two tasks `in_progress`.
3. **Update the todo list in real time** - do not batch completions. Mark done as soon as it is done.
4. **After every session, save new patterns, decisions, or preferences to memory** - use the memory folder at `~/.claude/projects/-Users-dharmketsavani-Desktop-ramprate-ui/memory/`.
5. **If any tasks remain unfinished at the end of a response, say so explicitly** - list what is still pending.

---

## Stack

- **Framework:** Next.js App Router (`src/app/`)
- **CMS:** Sanity (schemas in `src/sanity/schemas/`, client in `src/lib/sanity/`)
- **Styling:** Tailwind v4 + custom CSS in `src/app/globals.css`
- **Fonts:** Playfair Display (`--font-display`), DM Sans (`--font-body`), JetBrains Mono (`--font-mono`)
- **Deploy:** Netlify

---

## CSS Design System

### Section Backgrounds

```
.section-dark   → oklch(0.18 0.01 250) bg, light text  - hero alternates, dark CTAs
.section-warm   → oklch(0.94 0.03 80) bg, dark text    - "about / intro" sections
.section-light  → white bg, dark text                  - feature grids, service lists
```

### Glass Effects

```
.glass-card       → dark frosted card (used on dark hero sections)
.glass-card-warm  → light frosted card
.glass-card-dark  → deep dark frosted card
.glass-orb        → blurred ambient blob (position:absolute, pointer-events:none)
  .glass-orb-amber  → oklch(0.82 0.15 75)
  .glass-orb-blue   → oklch(0.55 0.22 260)
  .glass-orb-rust   → oklch(0.55 0.15 30)
```

### Accent Colors by Practice

| Practice         | Accent                                           |
| ---------------- | ------------------------------------------------ |
| Sourcing         | -                                                |
| Syzygy / Growth  | -                                                |
| Stratum / Web3   | -                                                |
| ImpactSoul       | `oklch(0.55 0.15 30)` rust/amber                 |
| Private Advisory | `var(--gold)` / `oklch(0.52 0.12 70)` gold/amber |

> **Always use the site's gold/amber theme (`var(--gold)`, `--gold-light`, `oklch(0.52 0.12 70)`) as the default accent for new pages.** Only introduce a completely separate color (e.g., rust for ImpactSoul) when the practice has a strongly distinct brand identity. Never use arbitrary blues or non-brand colors.

### Glass Orbs on Practice Pages

Always use `glass-orb-amber` + `glass-orb-rust` on practice pages - these match the gold/warm brand palette. Only use `glass-orb-blue` on pages where blue is explicitly part of that practice's identity.

### Header Dropdown Rules

- Dropdown panel width: `min-w-[270px]` - wide enough for longest label + desc without crowding
- Each row must have `gap-4` between label and desc, and desc must have `shrink-0` so it never wraps into the label

### CSS Variables

```
--dark: #0a0f1a          - default page bg
--gold: #d4a843          - brand gold
--warm-bg: #f5f0e8       - warm off-white
--text-dark: #2a1f14
--text-mid: #6b5e52
```

---

## Page Patterns

### Practice Page Structure (follow for every new practice)

```
src/app/<slug>/page.tsx   - server component, exports metadata
```

**Section order:**

1. **Hero** - `pt-32 pb-20`, `background: var(--dark)`, glass orbs, headline, 3 stat glass-cards
2. **Who / What** - `section-warm`, eyebrow label + h2 + body copy
3. **Services Grid** - `section-light`, icon cards (`rounded-xl p-7 border border-black/5`)
4. **How We Engage / Process** - `section-dark`, 3-column detail cards
5. **Trust Badge** (B Corp / credential) - `section-warm`, white card with icon
6. **CTA** - solid accent-color bg, h2 + 2 buttons

**Icon card template:**

```tsx
<div className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
     style={{ background: accentLight }}>
  {icon}  {/* SVG stroke in accent color */}
</div>
<h3 style={{ fontFamily: 'var(--font-display)' }}>Title</h3>
<p  style={{ color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)' }}>Desc</p>
```

**Eyebrow label template:**

```tsx
<span
  className="text-xs font-semibold tracking-[0.2em] uppercase"
  style={{ color: accent, fontFamily: "var(--font-body)" }}
>
  Label
</span>
```

**Stat glass-card template (hero):**

```tsx
<div className="glass-card p-4">
  <div
    className="text-xl font-bold mb-1"
    style={{ color: accentLight60, fontFamily: "var(--font-display)" }}
  >
    {value}
  </div>
  <div
    className="text-xs text-white/50"
    style={{ fontFamily: "var(--font-body)" }}
  >
    {label}
  </div>
</div>
```

---

## Navigation

Practices dropdown lives in `src/components/layout/Header.tsx` - `const practices` array at the top.

**Entry shape:**

```ts
{ label: "Display Name", href: "/slug", desc: "Short audience descriptor" }
```

When adding a new practice page, always:

1. Add the entry to `practices` in `Header.tsx`
2. If the page has a **white/light background** (no dark hero), add its path to `lightBgPaths` in `Header.tsx` so the nav renders in dark mode from page load

---

## Coding Rules

- **No `'use client'` unless the component needs browser APIs or React state/effects.** Server components by default.
- **No comments** unless the WHY is non-obvious.
- **No new dependencies** without discussing with the user first.
- **Prefer editing existing files** over creating new ones.
- **SVG icons inline** - no icon library imports.
- **Use Tailwind utility classes, not inline `style={{...}}`** (changed 2026-08-10). The design tokens are registered in `src/app/globals.css`'s `@theme inline` block, so they're real Tailwind classes: `bg-gold` / `text-gold` / `border-gold`, `bg-dark` / `bg-dark-mid` / `bg-dark-card`, `bg-warm-bg` / `bg-warm-light`, `text-rust` / `border-rust`, `text-ink` / `text-ink-mid` (maps to `--text-dark`/`--text-mid`), and `font-display` / `font-body` / `font-mono`. For a one-off color/size not in the token list, use Tailwind's arbitrary-value syntax (`text-[clamp(1.5rem,4vw,2.5rem)]`, `bg-white/6`) rather than inventing a new inline style. Migration off the old inline-style convention is in progress across the codebase - not every file has been converted yet; when you touch a file, convert what you touch.
- **oklch colors everywhere** - match the existing design system. No raw hex except for the CSS variable definitions.
- **No `framer-motion` on the main marketing site** (practice pages, `src/components/sections`, homepage, etc.) - it's a heavy dependency (~140KB), don't add new usage there. **It IS used extensively by the separate `/flow` product** (~38 files under `src/app/flow/` and `src/components/flow/`) - that's a real, active dependency for that product, not dead code; don't remove those imports.
- **Images: use `<Image>` from `next/image`**, not `<img>`, for anything user-visible.
- **`global-error.tsx` is the one exception** to the Tailwind rule - it renders its own document outside the root layout, so `globals.css` never loads there. It must stay hardcoded inline styles.

---

## Audit Methodology (a11y / performance / bundle size)

When asked to fix a specific Lighthouse/PageSpeed/axe finding, or to "check accessibility" or
"check performance" generally, don't stop at the one flagged page — sweep every route and fix the
shared component causing it, not just the reported instance. A violation on `/` from a shared
`Header`/`Carousel`/form component is usually reproduced on every other page that renders it.

Two specific Next.js App Router pitfalls to check for, since they're easy to introduce silently:

- **A shared metadata/layout helper calling `headers()` or `cookies()` forces the *entire site*
  dynamic**, even pages with zero personalization — killing static rendering, CDN caching, and
  bfcache. First-pass check: run `next build` and look at the route table — if most/all routes
  show `ƒ (Dynamic)` instead of `○ (Static)`, look for a Dynamic API call in whatever
  `generateMetadata`/canonical-URL helper every page shares.
- **A barrel `index.ts` re-export can leak a heavy dependency (formik, a crypto polyfill, etc.)
  into every page's initial JS**, even pages that never use the feature that needs it, if
  `layout.tsx` or another root-level import pulls a component through that barrel instead of
  importing it directly. If bundle size looks off, check what a shared barrel pulls in
  transitively before assuming the size is legitimate.
- **Never trust a single local Lighthouse run's Performance score** — CPU contention on a dev
  machine can swing the same unchanged build's score by 10-15 points across back-to-back runs.
  Test against a real production build (`next build && next start`, never `next dev` — dev mode is
  always heavier and produces misleading "unused JavaScript"/bundle-size warnings) or, better,
  against the deployed site. The admin chat's `lighthouse_check_page` tool already does this
  correctly — it calls Google's PageSpeed Insights API against the live `ramprate.com`, not a local
  run.

---

## Registered Pages / Routes

| Route               | Purpose                                |
| ------------------- | -------------------------------------- |
| `/`                 | Home                                   |
| `/about`            | About                                  |
| `/sourcing`         | Practice: Enterprise IT Sourcing       |
| `/growth`           | Practice: Syzygy (Founders)            |
| `/web3`             | Practice: Stratum (Web3)               |
| `/impactsoul`       | Practice: ImpactSoul (NGOs)            |
| `/private-advisory` | Practice: Private Advisory (Executive) |
| `/process`          | How We Work                            |
| `/proof`            | Case Studies                           |
| `/blog`             | Blog                                   |
| `/thinking`         | Thinking                               |
| `/contact`          | Engage / Contact                       |
| `/careers`          | Careers                                |
| `/expertise`        | Expertise                              |

---

## Admin Vibecoding Platform

The site owner edits real code files and Sanity content by connecting Claude Code, Claude Desktop,
Claude.ai (Team/Enterprise), or ChatGPT to this repo's own **MCP server** (`/api/mcp`) — there is no
in-house chat UI or admin page; the connecting app's own agent loop drives the tool calls.

> **Superseded design, 2026-08-27 through 2026-09-03:** a password-gated `/admin` chat page used to
> do this via an in-house Claude-powered chat loop (its own streaming/job-polling infrastructure to
> work around Netlify's function timeouts). Removed 2026-09-04 in favor of the MCP server below,
> once verified working end-to-end — Claude Desktop/Code/ChatGPT already have their own robust
> agent loops, so none of that in-house orchestration (and its recurring timeout/truncation bugs)
> needed to exist at all. See `project_admin_vibecoding.md` in memory for the full history if
> anything here looks unfamiliar from an older session.

**How it works:**
- Code edits go through GitHub's REST API (`src/lib/admin/github-client.ts`, plain `fetch`, no
  `@octokit/rest`) to a per-session branch (`admin/vibe-<date>-<random>`), never committed straight
  to the default branch.
- Content edits go through a dedicated Sanity write client (`src/lib/sanity/write-client.ts`) and
  are always saved as `drafts.<id>` — never touch the published document directly.
- **Publishing = merging the PR + publishing the matching Sanity drafts**, done via the
  `publish_changes` MCP tool. Nothing goes live any other way. It refuses to merge while the PR's
  GitHub build-check status (Netlify's own deploy preview) is pending or failing — never gated on
  `eslint`, since this repo has pre-existing lint debt that would keep an eslint-based gate
  permanently red.
- **No system prompt on this server's side** — unlike the old chat UI (which embedded this
  CLAUDE.md file into every request), the MCP server is just tool definitions; the connecting
  Claude/ChatGPT session supplies its own reasoning and whatever project context it already has.
  Claude Code operating inside this repo sees this file naturally; a Claude.ai Team connector or
  ChatGPT session with no repo context does not — keep each MCP tool's `description` in
  `src/lib/admin/tools.ts`/`mcp-server.ts` self-sufficient rather than assuming house-rule context
  from this file will reach the model automatically.

**Required env vars — must be set in Netlify's dashboard (Site settings → Environment variables),
not just locally, or `/api/mcp` will 500 in production:**

| Var | Purpose |
| --- | --- |
| `GITHUB_TOKEN` | Fine-grained PAT scoped to only this repo, Contents + Pull requests = Read and write. Not the token in the git remote URL. |
| `SANITY_API_TOKEN` | Must be an **Editor**-role token (write access) — the existing value may be read-only |
| `MCP_ADMIN_TOKEN` | Bearer token for `/api/mcp` — a long random secret (not a memorable password; see below) |

**This repo's default branch is `master`, not `main`** — anything touching the GitHub API must
resolve `default_branch` dynamically rather than assuming `main`.

### MCP server (`/api/mcp`)

The edit tools (`src/lib/admin/tools.ts`'s `runAdminTool`, minus `get_attachment`/
`create_download`, which were chat-UI-only concepts that no longer apply) plus
`list_pending_changes`/`publish_changes` are exposed as a remote MCP server at `/api/mcp`, so
Claude Desktop, Claude Code, Claude.ai Team/Enterprise, or ChatGPT can drive the GitHub-PR +
Sanity-draft workflow directly, with no in-house chat loop, streaming, or job-polling
infrastructure to maintain.

- **Auth:** `Authorization: Bearer <MCP_ADMIN_TOKEN>` header — checked in
  `src/lib/admin/mcp-auth.ts`. Not the portal password; a separate secret.
- **Stateless by design:** built with the SDK's `WebStandardStreamableHTTPServerTransport` in
  stateless mode (`sessionIdGenerator: undefined`) — a fresh `Server` per HTTP request, matching
  Netlify Functions' actual no-memory-between-invocations behavior. Instead of a session cookie,
  every tool call resolves "the pending change" by asking GitHub whether an admin branch/PR is
  already open (`gh.findOpenAdminPR`, same single-operator assumption as the chat UI). See
  `src/lib/admin/mcp-tool-context.ts` — its `finalize()` opens the PR the instant a branch gets its
  first commit; skipping that step means a later independent tool call can never find the branch
  again (GitHub only lets you query *open PRs* by branch prefix, not branches with no PR), and would
  silently fork a new orphan branch per call. Verified against a real GitHub PR during this build,
  not just by inspection.
- **Connecting Claude Code (per-repo, team-wide):** `.mcp.json` at the repo root already declares
  this server (`type: "http"`, url + `Authorization: Bearer ${MCP_ADMIN_TOKEN}`) — the token is NOT
  in that file, only the `${MCP_ADMIN_TOKEN}` reference, so it's safe to commit. Anyone who opens
  this repo in Claude Code is prompted to approve the server on first use, and it reads the token
  from their own local `MCP_ADMIN_TOKEN` env var — share the actual token value with teammates out
  of band (not by putting it in this file or in chat/commit history).
- **Connecting Claude.ai Team/Enterprise (org-wide, no per-person setup):** an org admin can add
  this as a custom connector once — Admin settings → Connectors → Add → Custom — with the same URL
  and an `Authorization: Bearer <token>` request header (Anthropic's header-based auth for custom
  connectors, currently in beta on some orgs; no OAuth needed). Once added, it shows up for every
  workspace member automatically (they just connect it under Customize → Connectors). Requires Team
  or Enterprise — not available on Pro/Free.
- **Connecting ChatGPT:** ChatGPT's connector UI (Settings → Connectors → Advanced → Developer
  Mode → Create connector, Plus/Pro/Team+ only, not Free) only offers OAuth or "No Authentication"
  for a custom remote MCP server — no static-bearer-header option like Claude's. So there's a
  second route, `src/app/api/mcp/[token]/route.ts`, that takes the same `MCP_ADMIN_TOKEN` as a URL
  path segment instead of a header (`https://ramprate.com/api/mcp/<token>`) — paste that full URL
  as the server URL and pick "No Authentication" in ChatGPT's setup. Same secret, same
  `isValidMcpToken()` check either way (`src/lib/admin/mcp-auth.ts`); only the transport differs.
  Slightly weaker than a header (URLs are more likely to land in a proxy/access log or browser
  history than headers), so prefer the header route (`/api/mcp`) for any client that supports it —
  this one exists only because ChatGPT currently leaves no other option short of standing up a full
  OAuth server.
- Files: `src/app/api/mcp/route.ts`, `src/app/api/mcp/[token]/route.ts`,
  `src/lib/admin/mcp-server.ts`, `src/lib/admin/mcp-auth.ts`, `src/lib/admin/mcp-handler.ts`
  (the shared stateless-server-per-request logic both routes call into),
  `src/lib/admin/mcp-tool-context.ts`. Denylist in `src/lib/admin/guardrails.ts` blocks the agent
  from editing `src/app/api/mcp/` itself (as well as `src/lib/admin/`, already covered).

See `~/.claude/projects/-Users-dharmketsavani-Desktop-ramprate-ui/memory/project_admin_vibecoding.md`
for the full build history, gotchas found during testing, and flagged security follow-ups.

---

## Memory Location

`~/.claude/projects/-Users-dharmketsavani-Desktop-ramprate-ui/memory/`

Files:

- `MEMORY.md` - index (one line per memory)
- `project_ramprate.md` - stack, architecture, known issues, patterns
- `user_profile.md` - user role and preferences
- `feedback_eod_format.md` - EOD report format
- `feedback_sod_format.md` - SOD plan format
- `reference_clickup_board.md` - ClickUp board structure
- `reference_weekly_report.md` - weekly report form
- `reference_flags_blockers_report.md` - flags & blockers report

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
