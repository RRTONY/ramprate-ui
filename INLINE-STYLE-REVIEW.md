# Inline-Style Review

## Purpose

This review records the remaining JSX `style` usage following the public-site modernization. The objective is to eliminate **fixed, reusable presentation layers** from component markup while retaining inline values that are genuinely data-driven, interactive, or tied to a specific managed-content visualization.

## Review Result

The inventory found inline styles across public, protected, and Flow product surfaces. The highest counts occur in large visual explainers—BioChain overview, Process journeys, Values, About, specialist forms, and Flow dashboards. Those files use inline values for step colors, layered diagrams, positioning, progress widths, and stateful content. Replacing them mechanically would risk changing semantic data visualizations, accessibility states, form behavior, or the separate Flow product experience.

| Category                       | Examples                                                                               | Treatment                                                                                                                                  |
| ------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Fixed shared presentation      | Shared Hero overlays; protected ownership-brief gate panel, input, and action surfaces | Moved to scoped semantic CSS classes.                                                                                                      |
| Content-driven visual emphasis | Process-path colors, BioChain product-map markers, Values narrative cards              | Retained where the style derives from the visible model and its editorial sequence; public colors were normalized to the approved palette. |
| Interactive measurements       | Progress bars, drag and rank feedback, map positions, calculated widths                | Retained as required runtime values.                                                                                                       |
| Form and accessibility state   | Validation, focus, loading, and submission feedback                                    | Retained where state determines the rendered value or behavior.                                                                            |
| Separate Flow product styling  | Assessment, reporting, team-map, and research tool interfaces                          | Kept within the intentionally separate Flow architecture; no public RampRate CMS or marketing style is reintroduced there.                 |

## Completed Fixed-Style Refactors

1. The protected AI ownership-brief gate now uses scoped CSS for fixed layers, typography, inputs, actions, and error feedback.
2. The shared public Hero now uses semantic CSS classes for its fallback glow and gradient overlays.
3. The public Process, Payments Advisory, BioChain, Values, ImpactSol, and shared marketing CTA work moved common styling into the unified global system and removed retired competing visual treatments.
4. The root global-error boundary now uses a self-contained semantic stylesheet because it cannot rely on the root global CSS after a layout-level failure; its recovery control retains visible keyboard focus and an assertive accessible error announcement.
5. Flow Assessment phase textures and Flow Alignment Results text wrapping now use scoped CSS or semantic Tailwind utilities. The remaining Flow inline styles are dynamic progress, geometry, visual-model colors, or calculated entry delays.
6. The Open Graph image generator retains renderer-required inline layout declarations because it produces an image response rather than browser DOM; these values cannot be represented safely by static page classes.
7. The public Proof route now uses shared RampRate typography utilities and static Tailwind presentation tokens for its hero, client proof, advisors, filter controls, testimonial cards, confidential CTA, and closing actions. Its single remaining JSX style object derives a confidential-testimonial badge background and foreground from the managed `division` value.
8. The Champions public route now uses Tailwind utilities for all fixed gradient, surface, typography, divider, marker, and action presentation across its hero, journey, qualification, exclusions, benefits, application, and closing sections. Its four retained JSX style objects are limited to mapped index-dependent divider and padding geometry for practice rows, benefit rows, and terms; all referral content, anchors, and the application workflow remain protected.
9. The completed Champions route was reviewed at desktop and mobile breakpoints. The qualification list, application form, anchored actions, contrast, and closing controls retained their responsive hierarchy after semantic style extraction.
10. The Values route has predominantly fixed palette, typography, texture, card, and CTA styles that are suitable for a later semantic extraction. Its three `item.color` uses are data-derived from managed service-card records and must remain inline; mapped index-driven alternation requires separate review.
11. Desktop review confirmed that the shared public display token renders legibly in the homepage footer reference heading and Values hero. The ongoing typography pass will retain Playfair Display for editorial headings, DM Sans for body and interface text, and JetBrains Mono only for compact labels, without altering separate Flow or CMS typography.
12. BioChain overview contains 163 inline-style sites, including 129 explicit typography values, alongside product-map, supplier-evaluation, and comparison visualization styling. Its data colors, calculated layout, and specialized route behavior require a separate component-level classification rather than mechanical replacement.
13. The Search route’s fixed shell, hero, result headings, labels, and empty-state typography are suitable for utility extraction. Query text, result counts, category data, and route-dependent badge color states remain dynamic. Desktop review confirmed the approved display heading and shared label treatment remain legible.
14. Payments Advisory now uses the shared public display and body typography utilities across its hero, statistics, process, integration, qualification, and intake actions. Content values and public intake destinations remain unchanged; its remaining inline values are bounded presentation or static compatibility values for a later fixed-style pass.
15. Service Provider Intelligence now uses the approved public body, mono, and display typography utilities throughout its hero, analysis panels, data pillars, platform scale, and comparison cards. Supplier metrics and intelligence content remain unchanged; no inline font-family declarations remain on the route.

## Guardrail

New reusable or static presentation must use semantic CSS or Tailwind classes. Inline styles remain appropriate only when their value is calculated from runtime content, interaction state, geometry, or a bounded content model that cannot be represented safely by static class names.
