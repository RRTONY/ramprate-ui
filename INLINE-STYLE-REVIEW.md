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

## Guardrail

New reusable or static presentation must use semantic CSS or Tailwind classes. Inline styles remain appropriate only when their value is calculated from runtime content, interaction state, geometry, or a bounded content model that cannot be represented safely by static class names.
