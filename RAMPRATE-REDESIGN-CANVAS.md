# RampRate Redesign Canvas

## Purpose

This canvas converts the approved direction into an implementation-ready public experience. The site should feel like a **senior-led decision partner for consequential technology, commercial, and infrastructure work**—not a catalogue of internal brand names. It preserves RampRate’s managed content, independent CMS, existing proof records, and the distinct ImpactSol brand.

> **Experience promise:** Make complex technology, partnership, and growth decisions easier to understand—and easier to act on—in the first 15–30 seconds.

## Recommended Public Navigation

| Navigation label | Destination | Visitor purpose | Implementation note |
| --- | --- | --- | --- |
| **Services** | `/services` | Understand the work RampRate can do. | Use a simple desktop dropdown and a direct mobile disclosure. Show four core RampRate services in plain language; present ImpactSol independently below. |
| **Case Studies** | `/proof` | See evidence before starting a conversation. | Retain existing proof and client-result records. |
| **About** | `/about` | Understand the people, values, and long view behind RampRate. | Add the existing Thinking timeline or journey as an About chapter. The primary navigation no longer needs a Thinking item. |
| **Blog** | `/blog` | Explore current insights and archive content. | Preserve the database-backed archive, category filters, and SEO. |
| **Contact Us** | `/contact` | Start a direct conversation. | Use this exact plain-language label consistently in shared navigation and calls to action. |

Legacy public URLs should remain valid through permanent redirects where a route is consolidated. This protects current links and indexed URLs while moving visitors toward the clear public architecture.

## Plain-Language Service Model

| Public service | Suggested canonical route | What a visitor should understand immediately | Continuity with existing work |
| --- | --- | --- | --- |
| **Relationship & Specialist Sourcing** | `/services/relationship-specialist-sourcing` | Find the right technology, specialist, or partner and structure a high-confidence selection. | Reframes Sourcing and relevant technology infrastructure work. |
| **Deal & Partnership Structuring** | `/services/deal-partnership-structuring` | Turn complex supplier, commercial, and strategic relationships into durable agreements. | Reframes Torque, telecom, and deal-structure work. |
| **Blockchain, Tokenization & Payment Infrastructure** | `/services/blockchain-tokenization-payment-infrastructure` | Design the commercial and operational foundations for tokenized, blockchain, and payment initiatives. | Reframes Stratum, Web3, and Payments Advisory work. |
| **Growth Strategy & Fractional Execution** | `/services/growth-strategy-fractional-execution` | Move from growth decision to accountable delivery with senior, embedded support. | Reframes Growth and selected executive advisory work. |
| **ImpactSol: Impact, ESG & Non-Dilutive Capital Advisory** | `/impactsoul` | A distinct RampRate-affiliated brand for measurable impact, ESG, and non-dilutive capital work. | Remains its own brand, visual section, and dedicated route—not a generic Services card. |

Every service page should use the same scannable sequence: one-sentence outcome, the decision it solves, three concrete engagement moments, a relevant **approved** testimonial or named case-proof record, related insights, and a direct **Book a Call** action. No testimonial quote, company attribution, result, or rating should be invented.

## Homepage Storyboard

| Chapter | Visitor question | Recommended content and action |
| --- | --- | --- |
| **Hero** | “What does RampRate do, and why should I care?” | Eyebrow: **Enterprise technology, partnerships & growth.** Headline: **Make complex technology decisions pay off.** Supporting copy explains senior-led sourcing, deal structuring, infrastructure, and execution. Actions: **Book a Call** and **View Case Studies**. |
| **Decision map** | “Is this relevant to my situation?” | Five concise outcome cards using plain service names. ImpactSol is visually separated and labelled as its own brand. |
| **Proof field** | “Have you done this before?” | Existing named client-result records, case-study links, and approved evidence rather than generalized promises. |
| **How RampRate works** | “What happens after we talk?” | A three-step process: Clarify the decision, structure the work, execute with accountability. |
| **Long-view credibility** | “Why trust RampRate?” | Existing About story, people, B Lab context, and the current Thinking journey/timeline folded into About. |
| **Final decision** | “What should I do next?” | Repeat one clear Book a Call action with a short expectation-setting line. |

## Visual and Interaction System

| Layer | Direction |
| --- | --- |
| **Brand palette** | Keep RampRate midnight navy as the primary authority field, warm gold as a precise emphasis color, parchment/white for breathing room, and a restrained cool-blue signal. Avoid indiscriminate gradients, violet veils, and decorative effects that obscure copy. |
| **Typography** | Preserve **Playfair Display** for authoritative editorial headlines, **DM Sans** for readable functional text, and **JetBrains Mono** only for compact labels, data, and navigation details. [1] |
| **Layout** | Use Apple-like section focus: one clear purpose per chapter, larger visual breathing room, shorter copy blocks, and a consistent content grid. Use the editorial service narrative and numbered decision structure observed in Inside Startups—without copying its copy or identity. [2] [3] |
| **Proof** | Treat proof as an evidence system: named client contexts, case outcomes, and approved testimonials only. Do not use empty logo walls or invented social proof. |
| **Motion** | Use CSS-only opacity and transform transitions under 300ms for nonessential reveals. Respect `prefers-reduced-motion`; keyboard interactions remain instant. [4] |
| **Video** | Add a muted, poster-backed, pause-capable 10–20 second ambient proof film only if a suitable existing or specifically approved brand-safe asset is available. Otherwise the design should use a strong still image and purposeful motion rather than decorative video. |

## Content and Trust Guardrails

The redesign must retain the independent `/cms` authentication system, managed database content, public SEO metadata, and current user flows. It must not reintroduce Flow authentication into the CMS, Sanity dependencies, generic template claims, unverified performance figures, or fabricated testimonials. Existing approved case-proof records may be shown as **Case proof** until a verified testimonial quote and attribution are selected.

## Implementation Sequence

1. Confirm the service wording and decide whether each service page may use an existing named **case-proof** record when no approved testimonial quote is available.
2. Create the Services hub, individual service routes, plain-language navigation, legacy redirects, and About journey chapter.
3. Rebuild the homepage hero and decision map around the confirmed structure and high-contrast Book a Call action.
4. Apply the shared visual system to the priority public pages, then introduce only approved image or video treatment.
5. Validate desktop and mobile readability, keyboard navigation, route redirects, CMS independence, SEO, test suite, lint, and production build.

## References

[1] [RampRate feature font configuration](src/app/layout.tsx)

[2] [Inside Startups](https://www.inside-startups.com/)

[3] [Apple MacBook Neo](https://www.apple.com/in/macbook-neo/)

[4] [Apple iPhone Duo](https://www.apple.com/in/iphone-duo/)
