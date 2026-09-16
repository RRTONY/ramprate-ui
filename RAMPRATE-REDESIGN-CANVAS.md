# RampRate Redesign Canvas

## Purpose

This canvas converts the approved direction into an implementation-ready public experience. The site should feel like a **senior-led decision partner for consequential technology, commercial, and infrastructure work**—not a catalogue of internal brand names. It preserves RampRate’s managed content, independent CMS, existing proof records, and the distinct ImpactSol brand.

> **Experience promise:** Make complex technology, partnership, and growth decisions easier to understand—and easier to act on—in the first 15–30 seconds.

## Recommended Public Navigation

| Navigation label | Destination | Visitor purpose                                               | Implementation note                                                                                                                                      |
| ---------------- | ----------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Services**     | `/services` | Understand the work RampRate can do.                          | Use a simple desktop dropdown and a direct mobile disclosure. Show four core RampRate services in plain language; present ImpactSol independently below. |
| **Case Studies** | `/proof`    | See evidence before starting a conversation.                  | Retain existing proof and client-result records.                                                                                                         |
| **About**        | `/about`    | Understand the people, values, and long view behind RampRate. | Add the existing Thinking timeline or journey as an About chapter. The primary navigation no longer needs a Thinking item.                               |
| **Blog**         | `/blog`     | Explore current insights and archive content.                 | Preserve the database-backed archive, category filters, and SEO.                                                                                         |
| **Contact Us**   | `/contact`  | Start a direct conversation.                                  | Use this exact plain-language label consistently in shared navigation and calls to action.                                                               |

Legacy public URLs should remain valid through permanent redirects where a route is consolidated. This protects current links and indexed URLs while moving visitors toward the clear public architecture.

## Plain-Language Service Model

| Public service                                             | Suggested canonical route                                  | What a visitor should understand immediately                                                          | Continuity with existing work                                                           |
| ---------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Relationship & Specialist Sourcing**                     | `/services/relationship-specialist-sourcing`               | Find the right technology, specialist, or partner and structure a high-confidence selection.          | Reframes Sourcing and relevant technology infrastructure work.                          |
| **Deal & Partnership Structuring**                         | `/services/deal-partnership-structuring`                   | Turn complex supplier, commercial, and strategic relationships into durable agreements.               | Reframes Torque, telecom, and deal-structure work.                                      |
| **Blockchain, Tokenization & Payment Infrastructure**      | `/services/blockchain-tokenization-payment-infrastructure` | Design the commercial and operational foundations for tokenized, blockchain, and payment initiatives. | Reframes Stratum, Web3, and Payments Advisory work.                                     |
| **Growth Strategy & Fractional Execution**                 | `/services/growth-strategy-fractional-execution`           | Move from growth decision to accountable delivery with senior, embedded support.                      | Reframes Growth and selected executive advisory work.                                   |
| **ImpactSol: Impact, ESG & Non-Dilutive Capital Advisory** | `/impactsoul`                                              | A distinct RampRate-affiliated brand for measurable impact, ESG, and non-dilutive capital work.       | Remains its own brand, visual section, and dedicated route—not a generic Services card. |

Every service page should use the same scannable sequence: one-sentence outcome, the decision it solves, three concrete engagement moments, a relevant **approved** testimonial or named case-proof record, related insights, and a direct **Book a Call** action. No testimonial quote, company attribution, result, or rating should be invented.

## Homepage Storyboard

| Chapter                   | Visitor question                                | Recommended content and action                                                                                                                                                                                                                                         |
| ------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hero**                  | “What does RampRate do, and why should I care?” | Eyebrow: **Enterprise technology, partnerships & growth.** Headline: **Make complex technology decisions pay off.** Supporting copy explains senior-led sourcing, deal structuring, infrastructure, and execution. Actions: **Book a Call** and **View Case Studies**. |
| **Decision map**          | “Is this relevant to my situation?”             | Five concise outcome cards using plain service names. ImpactSol is visually separated and labelled as its own brand.                                                                                                                                                   |
| **Proof field**           | “Have you done this before?”                    | Existing named client-result records, case-study links, and approved evidence rather than generalized promises.                                                                                                                                                        |
| **How RampRate works**    | “What happens after we talk?”                   | A three-step process: Clarify the decision, structure the work, execute with accountability.                                                                                                                                                                           |
| **Long-view credibility** | “Why trust RampRate?”                           | Existing About story, people, B Lab context, and the current Thinking journey/timeline folded into About.                                                                                                                                                              |
| **Final decision**        | “What should I do next?”                        | Repeat one clear Book a Call action with a short expectation-setting line.                                                                                                                                                                                             |

## Visual and Interaction System

| Layer             | Direction                                                                                                                                                                                                                                                                                                                                             |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Brand palette** | Keep RampRate midnight navy as the primary authority field, warm gold as a precise emphasis color, parchment/white for breathing room, and a restrained cool-blue signal. Avoid indiscriminate gradients, violet veils, and decorative effects that obscure copy.                                                                                     |
| **Typography**    | Use **Playfair Display** only for editorial headlines, **DM Sans** for all body, navigation, form, call-to-action, and supporting text, and **JetBrains Mono** only for compact labels or data markers where a utility signal is essential. Homepage copy should remain visually calm: one display role and one functional text role per chapter. [1] |
| **Layout**        | Use Apple-like section focus: one clear purpose per chapter, larger visual breathing room, shorter copy blocks, and a consistent content grid. Use the editorial service narrative and numbered decision structure observed in Inside Startups—without copying its copy or identity. [2] [3]                                                          |
| **Proof**         | Treat proof as an evidence system: named client contexts, case outcomes, and approved testimonials only. Do not use empty logo walls or invented social proof.                                                                                                                                                                                        |
| **Motion**        | Use CSS-only opacity and transform transitions under 300ms for nonessential reveals. Respect `prefers-reduced-motion`; keyboard interactions remain instant. [4]                                                                                                                                                                                      |
| **Video**         | Add a muted, poster-backed, pause-capable 10–20 second ambient proof film only if a suitable existing or specifically approved brand-safe asset is available. Otherwise the design should use a strong still image and purposeful motion rather than decorative video.                                                                                |

## Content and Trust Guardrails

The redesign must retain the independent `/cms` authentication system, managed database content, public SEO metadata, and current user flows. It must not reintroduce Flow authentication into the CMS, Sanity dependencies, generic template claims, unverified performance figures, or fabricated testimonials. Existing approved case-proof records may be shown as **Case proof** until a verified testimonial quote and attribution are selected.

## Site-wide Modernization Plan

> **Mode:** Redesign · Preserve. The public presentation will be modernized across the site, while public routes, useful content, conversion paths, independent CMS behavior, and working intake forms remain protected.

| Decision                  | Direction                                                                                                                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Preserve**              | The RampRate logo, current navigation, canonical URLs, CMS and Flow separation, SEO/JSON-LD, validated form fields and submission behavior, case-proof records, legal content, and the distinct ImpactSol role.     |
| **Improve**               | Consistent visual hierarchy, shared responsive spacing, public-page surface treatment, accessible interaction states, targeted scroll-led reveals, and a more coherent page-to-page rhythm.                         |
| **Remove or consolidate** | Redundant branded-practice presentations and competing purple, rust, or unrelated campaign treatments where canonical public destinations exist. Retain compatibility URLs through permanent redirects.             |
| **Highest-risk change**   | Shared styling could reduce clarity in specialist intake and campaign flows. Keep their route-specific form contracts and only extend the unified visual system around, not through, user inputs and process logic. |
| **Fallback**              | Each modernization increment remains separately tested, committed, and checkpointed, allowing the project to return to a verified release without changing data or authentication state.                            |

### Design Read

| Dial                    | Chosen direction                                                                                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Audience**            | Enterprise leaders and specialist decision-makers evaluating consequential technology, commercial, and impact work.                                                         |
| **Visual language**     | Editorial decision-partner: midnight-navy authority fields, paper intervals, narrow controlled-gold emphasis, Playfair Display moments, and precise monospace labels.       |
| **Visual variance**     | 5/10. Shared structure is more important than page-by-page novelty; individual campaign and ImpactSol contexts retain deliberately narrow distinctions.                     |
| **Motion intensity**    | 4/10. Scroll-led reveals and media depth create progression without turning business content into a demo reel. All nonessential motion respects reduced-motion preferences. |
| **Information density** | 6/10. Long-form specialist content remains scannable through short chapters, consistent grids, labeled evidence, and direct calls to action.                                |
| **Asset dependence**    | 6/10. Existing RampRate identity assets, managed hero media, and approved proof records are used before introducing any new assets.                                         |
| **Brand fidelity**      | 10/10. The purpose is a unified RampRate experience, not a visual clone of any reference site.                                                                              |

### Route Modernization Groups

| Group                                          | Routes and examples                                                                                                           | Planned approach                                                                                                                             |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core decision experience**                   | `/`, `/services`, service detail routes, `/proof`, `/about`, `/blog`, `/contact`                                              | Maintain the completed shared shell, high-contrast hierarchy, page storytelling rhythm, case-proof guardrails, and responsive navigation.    |
| **Brand, people, and values**                  | `/values`, `/impactsoul`, `/careers`, `/champions`, team profiles                                                             | Keep the unified shell while preserving each page’s specific subject matter and the deliberate ImpactSol distinction.                        |
| **Specialist programs and process pages**      | `/process`, `/sourcing/process`, `/payments-advisory`, `/payments-advisory/intake`, `/payments-advisory/intel`, `/biochain/*` | Normalize outer composition and interaction states while protecting specialized intake questions, process steps, and public program content. |
| **Search, proof, and specialist entry points** | `/search`, `/service-provider-intelligence-index`, `/attorney`, `/attorney-rfi`, `/aidoc-ownership-brief`                     | Improve hierarchy and shell consistency without changing result semantics, access gates, or request workflows.                               |
| **Legal and compatibility routes**             | `/privacy`, `/terms`, `/legal-master`, legacy branded-practice routes                                                         | Use readable paper-based long-form layouts and maintain valid compatibility redirects to canonical content.                                  |

## Implementation Sequence

1. Confirm the service wording and decide whether each service page may use an existing named **case-proof** record when no approved testimonial quote is available.
2. Create the Services hub, individual service routes, plain-language navigation, legacy redirects, and About journey chapter.
3. Rebuild the homepage hero and decision map around the confirmed structure and high-contrast Book a Call action.
4. Apply the shared visual system to the priority public pages, then introduce only approved image or video treatment.
5. Validate desktop and mobile readability, keyboard navigation, route redirects, CMS independence, SEO, test suite, lint, and production build.

## Restarted Live Homepage Parity Finding

The current live homepage was reviewed afresh on 2026-09-16 alongside the feature-branch homepage. The live page continues to present the legacy Practices navigation, six branded-practice cards, Thinking and Engage navigation, and the retired "Tell Us What’s Broken" action. Those labels, information architecture, and conversion language are intentionally superseded by the approved feature-branch Services, Case Studies, About, Blog, and Contact Us architecture.

The retained reference value is behavioral rather than literal: a high-contrast enterprise hero, clear supporting proof, and decisive action hierarchy. The feature homepage preserves those valid signals through its existing cinematic imagery, explicit technology-decision proposition, Book a Call and Case Studies actions, plain-language Services navigation, and accessible responsive presentation. No live content change is required from this comparison because the observed differences are deliberately approved redesign decisions.

The current live About page was also reviewed afresh. Its enterprise-advisor positioning, company longevity, global operating context, and B Lab credibility remain valid content themes. Its legacy Practices, Thinking, and Engage navigation plus the obsolete "Start a Conversation" conversion language are intentionally superseded. The feature About page already retains the approved long-view credibility and the durable Thinking journey destination, so no live-content import is required from this comparison.

The current live Case Studies page was reviewed afresh. Its named result themes and evidence-oriented case-study framing are compatible with the feature experience, but its legacy navigation, rust-dominant treatment, and generalized client-testimonial language are superseded. The feature Proof surface already presents the retained case material using the approved navy-paper-gold system and the explicit **Case proof** guardrail; no unverified quote, rating, or attribution is imported from the live page.

The current live Blog archive was reviewed afresh. Its category-led archive, article titles, public article URLs, and technology, sourcing, impact, and blockchain themes remain the relevant parity baseline. The feature archive intentionally retains those database-backed content and taxonomy behaviors while replacing the legacy header, practice taxonomy, and uneven archive presentation with the shared public system. No public content migration is required from this comparison.

The current live Contact page was reviewed afresh. Its direct contact form, scheduling path, email, phone, and location-oriented information remain valid user-facing functions. The feature Contact experience already preserves the real form and direct contact paths in the shared visual system. Legacy topic labels tied to branded practices and its older navigation remain intentionally superseded by the approved plain-language services taxonomy, so no live content import is required.

## References

[1] [RampRate feature font configuration](src/app/layout.tsx)

[2] [Inside Startups](https://www.inside-startups.com/)

[3] [Apple MacBook Neo](https://www.apple.com/in/macbook-neo/)

[4] [Apple iPhone Duo](https://www.apple.com/in/iphone-duo/)
