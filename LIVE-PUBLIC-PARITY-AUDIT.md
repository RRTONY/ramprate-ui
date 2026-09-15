# Live Public Site Parity Audit

## Scope

This audit compares the current public production site at `https://ramprate.com/` with the dedicated `feat/ramprate-product-completion` implementation. It covers public marketing, practice, archive, intake, and information routes. The independent `/cms` authentication and content system remains intentionally out of scope because it is a feature-branch-specific managed CMS.

## Live homepage findings — 2026-09-15

The live homepage contains newer editorial content that is not yet reflected in the feature branch. Verified differences include the hero supporting copy and its two actions, the client proof band, selected engagement details, practice ordering and descriptions, the differentiator heading and impact row, and the current brand name **Torque** in place of the historical Private Advisory label.

### Homepage parity batch status

The verified homepage content set has now been aligned in the feature workspace. The implementation retains the approved feature-branch midnight-navy visual treatment while adopting live hero copy, live client and engagement records, the current practice taxonomy, the updated differentiator heading and impact row, and a permanent `/torque` compatibility path to the existing Private Advisory route. Desktop and 390px mobile visual reviews confirm the current content remains readable and responsive.

### Core route comparison status

The live `/about`, `/proof`, `/sourcing`, and `/growth` routes were compared directly with their feature-preview counterparts. Their visible page content and section structure matched. The comparison exposed two shared navigation differences rather than page-body drift: the feature header carried an extra Process item that does not appear on the current live site, and shared footer/practice navigation still used Private Advisory instead of Torque. Both shared-navigation differences are now corrected while preserving `/private-advisory` as the destination behind the live `/torque` compatibility path.

The live `/web3` and `/impactsoul` routes were also compared directly with the feature preview. Their primary headings, explanatory copy, service sections, insight links, calls to action, and visible route structure matched. No page-body content migration is required for those two current practice pages.

The live `/thinking` archive matched the feature preview across its introductory content, year-grouped archive entries, author context, and closing call to action. The live and feature `/blog` archive responses both currently expose shared chrome only to static extraction, so no content drift is verified from the server-rendered response; the client-rendered archive remains covered by the managed database content implementation and its existing route contracts.

Visual review of the fully rendered Blog archive confirmed that its article cards, category controls, pagination, and current post set match the live site. The feature archive still uses an earlier rust/brown page atmosphere while the current live archive uses a midnight-navy and restrained-gold treatment. This is a verified presentation-only difference and is retained as a dedicated follow-up batch so it does not disturb the homepage-specific visual system or the managed blog data path.

The live `/biochain` and `/payments-advisory` pages match their feature-preview counterparts across the visible primary content, calls to action, and section structure. Two BioChain differences were verified and resolved: the feature header exposed a Browse Catalogue control that does not appear in the live global navigation, and the Amino Asylum external comparison label was not the current live wording. The header control is removed globally and the external label now reads “Market Rate Comp.”

The live `/contact` route matches the feature implementation across the contact form, topic choices, scheduling option, office locations, guarantee, and assessment calls to action. The live `/torque` page exposed a substantive content difference: the feature had only an older Private Advisory presentation under a temporary Torque redirect. The actual advisory implementation has now been promoted to `/torque`, updated with the current live metadata, service schema, hero identity, headline, supporting copy, transaction statistic, and “A Different Kind of Leverage” framing. The legacy `/private-advisory` path now permanently redirects to `/torque`.

The live `/process` route matches the feature preview’s current content and structure. The live `/expertise` page required the same Torque taxonomy correction applied to shared navigation and the direct Torque route; its final practice card, structured-data description, keywords, route, and transacted statistic now reflect the current live terminology.

Direct browser comparison of `/howwework` confirmed that the feature route matches the current live navigation, hero content, metrics, calls to action, tab controls, seven-step process, fee-model copy, and footer. No update is required for that page.

Direct browser comparison of `/champions` confirmed parity for the Champion Program hero, four-step referral process, 7.5% first-year collection terms, qualification thresholds, non-qualification criteria, disclosure copy, application fields, and action links. No content or presentation update is required for this route.

The live `/careers` and `/values` pages match the feature preview’s primary headings, editorial content, values and methodology sections, calls to action, and current shared footer content. The live Careers page includes decorative glyphs in a benefits section; the feature preserves its earlier Lucide/project-icon implementation in line with the project’s no-emoji interface requirement. No copy or route update is required for either page.

The live `/privacy` and `/terms` pages match the feature preview’s legal copy, current April 2026 dates, contact addresses, policy sections, and shared footer. No update is required for either legal route.

The live `/biochain/catalogue` and `/biochain/buyer-intake` routes both serve the same eight-section client intake. The feature-only product-listing implementation at `/biochain/catalogue` has therefore been replaced with the existing client intake, including its database-backed submission behavior; `/biochain/buyer-intake` now permanently redirects to the canonical live catalogue path. The current live and feature `/biochain/supplier-intake` routes match. The unlinked `/biochain/become-supplier` path returns HTTP 404 on both environments and requires no compatibility route.

The first automated sitemap sweep reported transient Flow differences while the development preview was recycling. Direct browser review of `/flow` subsequently confirmed a match for its title, navigation, hero, assessment calls to action, role explanation, friction calculator, and Flow footer. The remaining reported Flow-route findings require route-level client-render verification before they can be treated as content drift.

## Complete Sitemap Sweep

The current live sitemap at `https://ramprate.com/sitemap.xml` contains 146 public paths. A route-by-route passive comparison against the feature preview classified 125 routes as direct matches across status, title, principal heading, and primary content. The remaining automated candidates were concentrated in client-rendered Flow routes plus `/search`; they are retained for direct route verification rather than being copied blindly. This batch resolved the verified content and route differences identified outside that client-rendered review: current home entities and actions, Torque taxonomy and routing, live global navigation, BioChain copy, the canonical BioChain client-intake route, and the expertise practice card.

| Area           | Current live content to align                                                                            | Feature-branch state before parity work                    |
| -------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Hero           | Founder advisory / product strategy / mission-critical sourcing; includes both contact and proof actions | Earlier technology-sourcing copy and only the proof action |
| Client proof   | eBay `$50M`, Paramount, Riot Games, NOIA                                                                 | Earlier eBay, ViacomCBS/Hearst, Blizzard, Syntropy records |
| Engagements    | Paramount, eBay `$50M`, NOIA                                                                             | ViacomCBS/Hearst, eBay `27%`, Syntropy                     |
| Practices      | Syzygy, Stratum, Sourcing, BioChain, ImpactSoul, Torque with current descriptions                        | Earlier ordering and Private Advisory naming/copy          |
| Differentiator | “Data-Driven. Objective. Impact-Oriented.” plus an impact row                                            | Earlier heading and no impact row                          |

## Live route inventory

The live sitemap enumerates the public audit set: homepage; About, Expertise, Proof, Contact; practice and advisory routes; BioChain and Payments Advisory subroutes; Thinking and Blog; legal and search pages; Aidoc; and the public Flow routes. Dynamic article and archive detail routes are validated through their index pages and representative content records unless a route-specific difference is identified.

## Parity methodology

Each route is compared for route availability, primary heading and supporting copy, current calls to action, named entities, visible section structure, and shared navigation/footer behavior. Only verified live differences are carried into the feature branch. Content that is managed by the feature branch database is updated through its managed-content boundary rather than by restoring Sanity or copying production-specific dependencies.
