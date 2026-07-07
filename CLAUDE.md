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
- **All text styling via `style={{ fontFamily: 'var(--font-body)' }}`** - do not use Tailwind font classes.
- **oklch colors everywhere** - match the existing design system. No raw hex except for the CSS variable definitions.
- **No `framer-motion`** - it is a dead dependency (~140KB), do not import it.
- **Images: use `<Image>` from `next/image`**, not `<img>`, for anything user-visible.

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
