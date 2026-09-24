# Css Layer Bug

> Any unlayered CSS in globals.css silently overrides Tailwind v4 utility classes regardless of specificity — put base resets in @layer base

Custom CSS written directly in `globals.css` (outside an `@layer` block) always wins over Tailwind v4 utility classes, even ones with higher specificity — Tailwind's own styles live in `@layer theme, base, components, utilities`, and per the CSS cascade-layers spec, unlayered rules beat all layered rules regardless of specificity or source order.

**Why:** Found 2026-08-11 — `a { color: inherit; text-decoration: none; }` at the top of `globals.css` was unlayered, so it silently overrode every Tailwind text-color utility (`text-white/80`, `text-[oklch(...)]`) applied to any `<Link>`/`<a>` element sitewide, making header nav links (Proof/About/Blog/Thinking/Engage) render invisible white-on-light while the sibling `<button>` ("Practices") rendered fine since buttons aren't touched by that selector. Fixed by wrapping the base-reset block (`*`, `a`, `body`, `html`, `img`, `h1-h6`, cursor rule) in `@layer base { ... }`, the layer Tailwind's `@import "tailwindcss"` already declares.

**How to apply:** When adding any new global element-selector rule (not a `.class`) to `globals.css`, wrap it in `@layer base { ... }` unless the intent is specifically to override Tailwind utilities unconditionally. If a color/style change via a Tailwind class silently "does nothing" on this project, check whether an unlayered rule in `globals.css` is winning the cascade before assuming the class name or generation is wrong. See [project_ramprate](project_ramprate.md) and [feedback_tailwind_over_inline_style](feedback_tailwind_over_inline_style.md).
