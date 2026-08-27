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
| `/admin`            | Admin vibecoding panel (noindex, password-gated) |

---

## Admin Vibecoding Platform

`/admin` is a password-gated internal tool (not a marketing page) where the site owner chats with
Claude to edit real code files and Sanity content, then ships changes with a single Publish button.

**How it works:**
- Auth reuses the existing multi-portal password system (`src/lib/portal-auth.ts`), just with
  `"admin"` as another portal id — same HMAC-cookie mechanism as `/attorney` etc., no separate auth
  system.
- Code edits go through GitHub's REST API (`src/lib/admin/github-client.ts`, plain `fetch`, no
  `@octokit/rest`) to a per-session branch (`admin/vibe-<date>-<random>`), never committed straight
  to the default branch.
- Content edits go through a dedicated Sanity write client (`src/lib/sanity/write-client.ts`) and
  are always saved as `drafts.<id>` — never touch the published document directly.
- **Publish = merge the PR + publish the matching Sanity drafts.** Nothing goes live any other way.
  The Publish button stays disabled until the PR's GitHub build-check status (Netlify's own deploy
  preview) reports success — never on `eslint`, since this repo has pre-existing lint debt that
  would keep an eslint-based gate permanently red.
- The admin agent's system prompt (`src/lib/admin/system-prompt.ts`) reads this **actual CLAUDE.md
  file at request time** — so the rules in this document apply to its edits too, automatically, with
  no separate copy to keep in sync.

**Required env vars — must be set in Netlify's dashboard (Site settings → Environment variables),
not just locally, or `/admin` will 500 in production:**

| Var | Purpose |
| --- | --- |
| `PORTAL_PASSWORD_ADMIN` | Password to unlock `/admin` |
| `GITHUB_TOKEN` | Fine-grained PAT scoped to only this repo, Contents + Pull requests = Read and write. Not the token in the git remote URL. |
| `SANITY_API_TOKEN` | Must be an **Editor**-role token (write access) — the existing value may be read-only |

**This repo's default branch is `master`, not `main`** — anything touching the GitHub API must
resolve `default_branch` dynamically rather than assuming `main`.

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
