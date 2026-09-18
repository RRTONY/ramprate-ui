# Inline-Style Review

## Purpose

This review records the remaining JSX `style` usage following the public-site modernization. The objective is to eliminate **fixed, reusable presentation layers** from component markup while retaining inline values that are genuinely data-driven, interactive, or tied to a specific managed-content visualization.

## Review Result

The inventory found inline styles across public, protected, and Flow product surfaces. The highest counts occur in large visual explainers—BioChain overview, Process journeys, Values, About, specialist forms, and Flow dashboards. Those files use inline values for step colors, layered diagrams, positioning, progress widths, and stateful content. Replacing them mechanically would risk changing semantic data visualizations, accessibility states, form behavior, or the separate Flow product experience.

| Category | Examples | Treatment |
| --- | --- | --- |
| Fixed shared presentation | Shared Hero overlays; protected ownership-brief gate panel, input, and action surfaces | Moved to scoped semantic CSS classes. |
| Content-driven visual emphasis | Process-path colors, BioChain product-map markers, Values narrative cards | Retained where the style derives from the visible model and its editorial sequence; public colors were normalized to the approved palette. |
| Interactive measurements | Progress bars, drag and rank feedback, map positions, calculated widths | Retained as required runtime values. |
| Form and accessibility state | Validation, focus, loading, and submission feedback | Retained where state determines the rendered value or behavior. |
| Separate Flow product styling | Assessment, reporting, team-map, and research tool interfaces | Kept within the intentionally separate Flow architecture; no public RampRate CMS or marketing style is reintroduced there. |

## Completed Fixed-Style Refactors

1. The protected AI ownership-brief gate now uses scoped CSS for fixed layers, typography, inputs, actions, and error feedback.
2. The shared public Hero now uses semantic CSS classes for its fallback glow and gradient overlays.
3. The public Process, Payments Advisory, BioChain, Values, ImpactSol, and shared marketing CTA work moved common styling into the unified global system and removed retired competing visual treatments.
4. The root global-error boundary now uses a self-contained semantic stylesheet because it cannot rely on the root global CSS after a layout-level failure; its recovery control retains visible keyboard focus and an assertive accessible error announcement.
5. Flow Assessment phase textures and Flow Alignment Results text wrapping now use scoped CSS or semantic Tailwind utilities. The remaining Flow inline styles are dynamic progress, geometry, visual-model colors, or calculated entry delays.
6. The Open Graph image generator retains renderer-required inline layout declarations because it produces an image response rather than browser DOM; these values cannot be represented safely by static page classes.
7. The public Proof route now uses shared RampRate typography utilities and static Tailwind presentation tokens for its hero, client proof, advisors, filter controls, testimonial cards, confidential CTA, and closing actions. Its single remaining JSX style object derives a confidential-testimonial badge background and foreground from the managed `division` value.

## Guardrail

New reusable or static presentation must use semantic CSS or Tailwind classes. Inline styles remain appropriate only when their value is calculated from runtime content, interaction state, geometry, or a bounded content model that cannot be represented safely by static class names.
