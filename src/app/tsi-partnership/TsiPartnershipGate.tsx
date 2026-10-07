"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";

// Self-contained client-side gate, same pattern as /aidoc-ownership-brief:
// no dependency on src/lib/portal-auth.ts's fixed PORTAL_IDS registry, so
// this page can ship on its own. Not meant for anything more sensitive than
// keeping this discussion off the open web - it's one link, shared directly.
const ACCESS_CODE = "TSI-2026";

// This page's palette, typography (Fraunces + Public Sans) and generative
// motifs are deliberately ported from the bespoke HTML design artifact built
// for this discussion, not the site's own gold/dark system - every rule
// below is scoped under .tsi-page so it never leaks into the rest of the
// site. The artifact's dark-mode variant is intentionally left out: nothing
// in this page offers a toggle, and the project favors fixed per-section
// backgrounds over light/dark switching.
const TSI_STYLES = `
.tsi-page{
  --bg:#FAF5EE;
  --surface:#F1E8D9;
  --ink:#231C2A;
  --ink-soft:#5E5668;
  --accent:#6B3F78;
  --accent-soft:#8C5C98;
  --sage:#69795A;
  --line:#DED0BB;
  --error:#B3473F;
  --section-heading-gap:18px;
  color-scheme:light;
  background:var(--bg);
  color:var(--ink);
  font-family:var(--font-public-sans),system-ui,-apple-system,"Segoe UI",sans-serif;
  max-width:1120px;
  margin-inline:auto;
  padding-inline:20px;
}
.tsi-page *{box-sizing:border-box}
.tsi-page [id]{scroll-margin-top:56px}
.tsi-page h1,.tsi-page h2{font-family:var(--font-fraunces),"Iowan Old Style",Georgia,serif;font-weight:560;text-wrap:balance;margin:0}
.tsi-page p,.tsi-page td,.tsi-page dd,.tsi-page h3{text-wrap:pretty}
.tsi-page .eyebrow{font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:600;margin:0 0 .6rem}
.tsi-page .note{font-size:.8rem;color:var(--ink-soft)}
.tsi-page .brand-bar{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;padding-block:16px;border-bottom:1px solid var(--line)}
.tsi-page .brand-chip{display:inline-flex;align-items:center;line-height:0}
.tsi-page .brand-chip img{display:block;height:28px;width:auto}
.tsi-page .footer .brand-chip img{height:32px}
.tsi-page .brand-bar .note{max-width:38ch;line-height:1.5}

.tsi-page nav.toc{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--bg);border-bottom:1px solid var(--line)}
.tsi-page .toc-inner{display:flex;gap:20px;overflow-x:auto;padding-block:12px;scrollbar-width:none}
.tsi-page .toc-inner::-webkit-scrollbar{display:none}
.tsi-page .toc a{color:var(--ink-soft);text-decoration:none;font-size:.78rem;white-space:nowrap;letter-spacing:.02em;font-weight:500}
.tsi-page .toc a:hover{color:var(--accent)}

.tsi-page .hero{display:grid;grid-template-columns:1.1fr 1fr;gap:40px;column-gap:42px;align-items:center;padding-block:44px 52px}
@media (max-width:760px){.tsi-page .hero{grid-template-columns:1fr;row-gap:18px}}
.tsi-page .hero h1{font-size:clamp(2.1rem,4.4vw,3rem);line-height:1.08;max-width:18ch}
.tsi-page .hero .tagline{font-family:var(--font-fraunces),Georgia,serif;font-style:italic;color:var(--accent-soft);font-size:1.25rem;line-height:1.35;margin-top:16px;max-width:30ch}
.tsi-page .hero p{color:var(--ink-soft);font-size:.98rem;line-height:1.6;max-width:48ch;margin-top:14px}
@media (max-width:760px){.tsi-page .hero h1{font-size:2.35rem}.tsi-page .hero .tagline{font-size:1.16rem}}

.tsi-page .scene.tailored-weave{background:none;border-radius:0;overflow:visible;aspect-ratio:1.06;isolation:isolate;display:flex;align-items:center;justify-content:center;min-width:0;position:relative}
.tsi-page .weave-art{display:block;width:100%;max-width:none;height:auto;flex:none;object-fit:contain;pointer-events:none}
@media (max-width:760px){.tsi-page .scene.tailored-weave{width:100%;max-width:470px;justify-self:center;aspect-ratio:1.18}.tsi-page .weave-art{width:105%;max-width:100%}}
@media (prefers-reduced-motion:no-preference){.tsi-page .weave-art{animation:tsiWeaveReveal .8s ease-out both}}
@keyframes tsiWeaveReveal{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
@media print{.tsi-page .weave-art{animation:none}}

.tsi-page .section{padding-block:48px 52px;border-top:1px solid var(--line)}
.tsi-page .section>h2,.tsi-page .principles>h2{font-size:clamp(1.4rem,3vw,1.9rem);margin:0 0 var(--section-heading-gap)}
.tsi-page .section>h2+.prose,.tsi-page .principles>h2+.prose{margin-top:0}
.tsi-page .section>h2+.prose>p:first-child,.tsi-page .principles>h2+.prose>p:first-child{margin-top:0}
.tsi-page .section p{line-height:1.7}
.tsi-page .prose{max-width:64ch}
.tsi-page .prose p{color:var(--ink-soft);line-height:1.65;margin:0 0 14px;font-size:.98rem}
.tsi-page .pair-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:30px 36px}
.tsi-page .pair-grid>.pair:last-child:nth-child(odd){grid-column:1/-1}
@media (max-width:760px){.tsi-page .pair-grid{grid-template-columns:1fr}}
.tsi-page .pair h3{font-family:var(--font-fraunces),Georgia,serif;color:var(--accent);font-weight:560;font-size:1.05rem;margin:0 0 8px}
.tsi-page .pair p{color:var(--ink-soft);line-height:1.6;font-size:.95rem;margin:0}

.tsi-page .principals-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:26px;margin-top:28px}
@media (max-width:600px){.tsi-page .principals-grid{grid-template-columns:1fr}}
.tsi-page .principal{display:flex;gap:16px;align-items:flex-start}
.tsi-page .avatar{width:54px;height:54px;border-radius:50%;flex:none;object-fit:cover;display:block}
.tsi-page .principal h3{margin:0 0 2px;font-family:var(--font-fraunces),Georgia,serif;font-size:1.04rem}
.tsi-page .principal .role{color:var(--accent-soft);font-size:.78rem;margin:0 0 8px;text-transform:uppercase;letter-spacing:.06em;font-weight:600}
.tsi-page .principal p{color:var(--ink-soft);font-size:.9rem;line-height:1.55;margin:0}

.tsi-page .table-wrap{overflow-x:auto;margin-top:18px;border:1px solid var(--line);border-radius:12px}
.tsi-page table{border-collapse:collapse;width:100%;min-width:480px;font-size:.9rem}
.tsi-page #roadmap table,.tsi-page #market table{min-width:560px}
.tsi-page th{background:var(--accent);color:var(--bg);text-align:left;padding:12px 16px;font-family:var(--font-fraunces),Georgia,serif;font-weight:560;font-size:.85rem}
.tsi-page td{padding:12px 16px;border-top:1px solid var(--line);color:var(--ink-soft);vertical-align:top}
.tsi-page tbody tr:first-child td{border-top:none}

.tsi-page .principles{position:relative;padding-block:52px 60px;border-top:1px solid var(--line);overflow:hidden;isolation:isolate}
.tsi-page .principles-composition{position:absolute;right:0;top:50%;transform:translateY(-50%);width:330px;height:330px;pointer-events:none;z-index:0;opacity:.19}
.tsi-page .principles-composition .tessera{fill:var(--accent-soft)}
.tsi-page .principles-composition .sage{fill:var(--sage)}
@media (max-width:950px){.tsi-page .principles-composition{right:-65px;opacity:.12;width:300px;height:300px}}
@media (max-width:760px){.tsi-page .principles-composition{top:auto;bottom:-42px;right:-48px;transform:none;width:230px;height:230px;opacity:.075}}
.tsi-page #principles>.prose{position:relative;z-index:1;max-width:60ch}
.tsi-page #principles>h2,.tsi-page #principles>.eyebrow{position:relative;z-index:1}
.tsi-page #principles>h2{max-width:24ch;font-size:clamp(1.4rem,3vw,1.9rem)}

.tsi-page #why-us .pair-grid{grid-template-columns:repeat(3,1fr);gap:28px}
.tsi-page #why-us .pair h3{line-height:1.35}
.tsi-page #why-us>.prose{margin-bottom:26px}
@media (max-width:760px){.tsi-page #why-us .pair-grid{grid-template-columns:1fr}}

.tsi-page .has-composition{position:relative}
.tsi-page .has-composition>h2{padding-right:270px;min-height:90px;display:flex;align-items:center}
.tsi-page .section-composition{position:absolute;top:78px;right:0;width:230px;height:86px;pointer-events:none;opacity:.27}
.tsi-page .section-composition .motif-piece{fill:var(--accent-soft)}
.tsi-page .section-composition .sage{fill:var(--sage)}
@media (max-width:950px){.tsi-page .has-composition>h2{padding-right:220px}.tsi-page .section-composition{width:190px;height:72px;top:80px}}
@media (max-width:760px){.tsi-page .has-composition>h2{padding-right:0;min-height:0;display:block}.tsi-page .section-composition{position:static;display:block;width:172px;height:65px;margin:-2px 0 23px auto;opacity:.23}}
@media print{.tsi-page .section-composition{position:static;display:block;width:150px;height:56px;margin:0 0 15px auto}.tsi-page .has-composition>h2{padding-right:0;min-height:0}}

.tsi-page .partnership{background:var(--surface);border-top:none;border-radius:22px;padding:44px clamp(20px,4vw,44px) 40px;margin-block:14px;position:relative}
.tsi-page .partnership-weave{display:block;width:132px;height:132px;object-fit:contain;margin:0 0 20px}
@media (max-width:600px){.tsi-page .partnership-weave{width:108px;height:108px;margin-bottom:18px}}

.tsi-page dl.glossary{display:grid;grid-template-columns:max-content 1fr;gap:10px 20px;margin-top:8px}
.tsi-page dl.glossary dt{font-family:var(--font-fraunces),Georgia,serif;color:var(--accent-soft);font-weight:560;font-size:.95rem}
.tsi-page dl.glossary dd{margin:0;color:var(--ink-soft);font-size:.92rem;line-height:1.55}
.tsi-page .reference-terms summary{cursor:pointer;font-family:var(--font-fraunces),Georgia,serif;font-size:1.2rem;color:var(--accent);padding:8px 0 14px}
.tsi-page .reference-terms dl{margin-top:16px}

.tsi-page .footer{border-top:1px solid var(--line);padding-block:30px 48px;text-align:center}
.tsi-page .footer p{color:var(--ink-soft);font-size:.8rem;margin:14px 0 0}

@media print{
  .tsi-page .reference-terms{display:block}
  .tsi-page nav.toc{display:none}
  .tsi-page .section,.tsi-page .principles{padding-block:25px}
  .tsi-page h2,.tsi-page h3{break-after:avoid}
  .tsi-page tr,.tsi-page .principal{break-inside:avoid}
  .tsi-page p{widows:3;orphans:3}
}
`;

const navLinks = [
  { href: "#market", label: "Opportunity" },
  { href: "#model", label: "Questions" },
  { href: "#about", label: "About" },
  { href: "#principles", label: "Principles" },
  { href: "#why-us", label: "Experience" },
  { href: "#team", label: "Model" },
  { href: "#pilot", label: "Pilot" },
  { href: "#operations", label: "Operations" },
  { href: "#roadmap", label: "Eight weeks" },
  { href: "#partnership", label: "Partnership" },
  { href: "#commercial", label: "Commercial" },
  { href: "#options", label: "Options" },
  { href: "#next", label: "Call" },
];

const heardItems = [
  {
    title: "A few strong partners",
    body: "You want a few strong partners, not many small ones — focused channels, not five directions at once.",
  },
  {
    title: "Proven cost savings",
    body: "You want to start with a pilot that proves real volume and reduction in sales / marketing costs, before scaling wide.",
  },
  {
    title: "Employer and government health",
    body: "The employer and government health channel, EAPs and capitated health, is where you want to learn more first.",
  },
  {
    title: "Patent review",
    body: "TSI’s patent position is worth a careful look together, as the US business takes shape.",
  },
  {
    title: "Machine cost",
    body: "The cost of scaling the granule dispensing machines is a real, open question.",
  },
  {
    title: "Packaging and peptides",
    body: "Interest in exploring lower-waste packaging and peptide formulations.",
  },
];

const marketRows = [
  [
    "EAPs",
    "A nutrition offering through an employer-support partner",
    "Does it fit the service, and who funds it?",
  ],
  [
    "Self-insured employers",
    "A targeted employee-wellness pilot",
    "Who buys, which population participates, and what would justify expansion?",
  ],
  [
    "Capitated-care programs",
    "Nutrition support within a defined care pathway",
    "What evidence and funding model would the buyer require?",
  ],
  [
    "Government, military and telecom",
    "Later institutional or distribution partnerships",
    "Which relationships offer a credible entry point after the first test?",
  ],
  [
    "Clinics and white-label brands",
    "Practitioner or brand-led delivery",
    "Who owns engagement, claims and the customer relationship?",
  ],
];

const modelItems = [
  {
    title: "What would a useful first pilot prove?",
    body: "Agree the population, product, payer and baseline. Define how to test adoption, commercial economics and any proposed savings with suitable evidence.",
  },
  {
    title: "What is the route to new US capacity?",
    body: "Your team reported that the two Phoenix machines were fully booked. We should confirm the current position and whether an alternative supply route could support a pilot.",
  },
  {
    title:
      "What would it take, financially, to scale the dispensing machines if the pilot works?",
    body: "We should understand additional-machine costs and financing responsibilities before committing to a wider rollout.",
  },
  {
    title: "Who carries each responsibility?",
    body: "Identify the partner brand and confirm who owns engagement, labeling, product claims, regulatory compliance and delivery. Agree one decision contact on each side.",
  },
  {
    title: "What should the relationship become?",
    body: "Review the patent position with qualified counsel and agree what evidence would support a larger operating role. TSI decides the scope, pace and direction.",
  },
];

const whyUsItems = [
  {
    title: "Mapping a complex partner ecosystem",
    body: "For a major global technology company, RampRate mapped channel and partnership relationships across telecom, cybersecurity, gaming and online child safety. The relevant method is to identify buyers, partner incentives and routes to market.",
  },
  {
    title: "Building workable channel terms",
    body: "RampRate has developed channel-agreement templates and partner compensation structures for growing companies. This helps turn buyer interest into agreements with clear economics and responsibilities.",
  },
  {
    title: "Health and supplement relationships",
    body: "We have signed more than 500 channel agreements across our work, including relationships with peptide manufacturers and distributors. This supports commercial execution; clinical evidence and regulatory suitability require separate specialists.",
  },
];

const pilotItems = [
  {
    title: "Test the commercial model",
    body: "Agree one population, a defined product scope and a payment model. Track participation, adherence, replenishment, retention, delivery, service costs and retained contribution.",
  },
  {
    title: "Build credible proof",
    body: "Clinical advisers help choose appropriate baseline and outcome measures. Any claim about health improvement or healthcare-cost savings needs a suitable study design and supporting evidence.",
  },
];

const operationsItems = [
  {
    title: "Operate successful channels",
    body: "Coordinate onboarding, approved materials, account handoffs, partner support, renewals and issue resolution.",
  },
  {
    title: "Make progress visible",
    body: "Maintain a buyer pipeline, economics review and action log. Review revenue, contribution, cash collection and delivery performance, with owners for corrective actions.",
  },
];

const roadmapRows = [
  [
    "Weeks 1–2 / Align",
    "Confirm the first channel, decision contacts, product scope and what counts as proof.",
    "An agreed pilot brief and a focused set of questions.",
  ],
  [
    "Weeks 3–4 / Map",
    "Evaluate EAP and employer routes, buyer roles, relationships and indicative economics.",
    "A ranked shortlist of realistic partners and initial buyer feedback.",
  ],
  [
    "Weeks 5–6 / Design",
    "Shape the population, payment model, supply route, responsibilities and evidence plan.",
    "A proposed pilot design and commercial model for TSI to review.",
  ],
  [
    "Weeks 7–8 / Decide together",
    "Review findings, interested counterparties and the proposed operating approach.",
    "A joint decision on the next step and the scope required to pursue it.",
  ],
];

const optionsItems = [
  {
    title: "Lower-waste packaging",
    body: "Explore the zero-waste and compostable-packaging direction you raised, where materials and delivery requirements make it practical.",
  },
  {
    title: "Oral peptide formulations",
    body: "TSI has described the technical ability to granulate peptides. Any oral-supplement opportunity needs its own review of formulation, evidence and regulatory suitability.",
  },
];

const glossary = [
  ["Channel", "A route through which products reach buyers."],
  [
    "EAP",
    "Employee assistance program: an employer service for employee support.",
  ],
  [
    "Capitated care",
    "Care funded through a fixed payment per person for a defined period.",
  ],
  [
    "SOW",
    "Statement of work: tasks, owners, outputs, timing and commercial terms.",
  ],
  [
    "Contribution",
    "Revenue remaining after the costs included in the agreed model.",
  ],
];

// Generative motif data, carried over verbatim from the design artifact.
// Each tessera/piece is one Bezier path repeated at a different
// translate/rotate/scale - the same shared shape, assembled into three
// different compositions (the #principles root motif, and the #team /
// #operations section strips).
const TESSERA_D =
  "M -9 -5 C -8 -12 0 -12 7 -7 C 13 -3 10 5 4 9 C -2 13 -11 8 -9 -5 Z";
const MOTIF_D =
  "M -8 -4 C -8 -10 -1 -12 6 -7 C 12 -3 10 4 4 8 C -2 12 -11 7 -8 -4 Z";

const principlesPieces: { t: string; sage: boolean }[] = [
  { t: "translate(129.2 43.3) rotate(34.5) scale(0.79 0.93)", sage: false },
  { t: "translate(81.8 69.9) rotate(43.9) scale(1.01 0.76)", sage: false },
  { t: "translate(105.3 69.5) rotate(-20.4) scale(1.03 0.88)", sage: false },
  { t: "translate(83.1 91.8) rotate(-31.8) scale(0.92 1.01)", sage: false },
  { t: "translate(105.5 94.9) rotate(57.4) scale(0.71 0.95)", sage: false },
  { t: "translate(60.9 115.4) rotate(-59.5) scale(0.73 0.97)", sage: false },
  { t: "translate(84.2 114.6) rotate(-47.1) scale(0.80 1.00)", sage: false },
  { t: "translate(63.0 141.5) rotate(-27.5) scale(0.82 0.96)", sage: false },
  { t: "translate(84.1 138.2) rotate(10.6) scale(0.94 1.02)", sage: false },
  { t: "translate(38.5 166.0) rotate(-66.3) scale(0.88 1.02)", sage: true },
  { t: "translate(60.9 166.1) rotate(41.2) scale(0.85 0.77)", sage: false },
  { t: "translate(82.1 164.2) rotate(-32.3) scale(0.82 0.94)", sage: false },
  { t: "translate(58.3 190.9) rotate(40.2) scale(0.75 0.85)", sage: false },
  { t: "translate(84.2 187.3) rotate(3.3) scale(0.96 0.80)", sage: false },
  { t: "translate(106.0 188.2) rotate(-25.6) scale(0.97 1.06)", sage: false },
  { t: "translate(38.3 211.3) rotate(-46.2) scale(1.02 0.78)", sage: false },
  { t: "translate(61.6 210.9) rotate(65.0) scale(0.95 0.86)", sage: false },
  { t: "translate(86.5 212.1) rotate(-49.9) scale(0.74 1.04)", sage: false },
  { t: "translate(108.9 213.6) rotate(41.1) scale(0.78 0.82)", sage: false },
  { t: "translate(134.0 211.6) rotate(-32.2) scale(0.73 0.89)", sage: false },
  { t: "translate(301.5 210.3) rotate(-40.9) scale(0.82 1.06)", sage: false },
  { t: "translate(58.2 237.3) rotate(39.5) scale(1.02 0.92)", sage: false },
  { t: "translate(84.9 233.8) rotate(53.0) scale(0.96 0.83)", sage: false },
  { t: "translate(107.9 238.1) rotate(27.0) scale(0.78 1.08)", sage: false },
  { t: "translate(134.1 236.0) rotate(-3.8) scale(0.84 1.09)", sage: false },
  { t: "translate(158.8 234.1) rotate(-65.8) scale(0.86 0.82)", sage: false },
  { t: "translate(275.3 234.6) rotate(8.9) scale(0.96 0.76)", sage: false },
  { t: "translate(62.7 261.6) rotate(-54.9) scale(0.83 0.92)", sage: false },
  { t: "translate(85.6 260.0) rotate(67.0) scale(0.70 1.03)", sage: true },
  { t: "translate(108.1 257.9) rotate(-16.5) scale(0.91 1.09)", sage: true },
  { t: "translate(131.4 257.7) rotate(34.0) scale(0.75 0.82)", sage: false },
  { t: "translate(153.3 262.3) rotate(-32.5) scale(1.04 0.79)", sage: true },
  { t: "translate(179.9 258.9) rotate(20.2) scale(0.80 0.87)", sage: true },
  { t: "translate(201.5 257.0) rotate(-5.4) scale(1.00 0.94)", sage: false },
  { t: "translate(227.8 261.6) rotate(51.9) scale(0.73 0.98)", sage: false },
  { t: "translate(254.6 261.3) rotate(12.6) scale(0.93 1.02)", sage: true },
  { t: "translate(274.9 257.2) rotate(-48.4) scale(1.02 0.95)", sage: true },
  { t: "translate(85.6 282.6) rotate(-36.6) scale(0.87 0.89)", sage: true },
  { t: "translate(109.4 286.2) rotate(46.4) scale(0.92 0.91)", sage: false },
  { t: "translate(130.3 281.6) rotate(-41.3) scale(0.88 0.82)", sage: false },
  { t: "translate(157.9 284.7) rotate(-42.1) scale(0.74 0.75)", sage: true },
  { t: "translate(178.6 285.3) rotate(46.1) scale(0.83 0.77)", sage: false },
  { t: "translate(206.7 281.1) rotate(18.0) scale(1.04 0.86)", sage: false },
  { t: "translate(229.9 285.0) rotate(-45.8) scale(0.97 0.96)", sage: false },
  { t: "translate(252.6 286.0) rotate(10.0) scale(1.01 0.79)", sage: true },
  { t: "translate(131.0 307.9) rotate(64.7) scale(0.94 0.84)", sage: false },
  { t: "translate(155.7 305.5) rotate(-55.3) scale(0.87 0.86)", sage: false },
  { t: "translate(181.3 306.5) rotate(-6.9) scale(0.87 0.75)", sage: false },
  { t: "translate(202.6 306.0) rotate(2.0) scale(0.77 0.76)", sage: true },
  { t: "translate(225.2 307.1) rotate(-24.3) scale(0.77 0.81)", sage: false },
  { t: "translate(302 226) rotate(-18) scale(0.8)", sage: false },
  { t: "translate(324 258) rotate(6) scale(0.65)", sage: false },
  { t: "translate(290 287) rotate(9) scale(0.9)", sage: false },
  { t: "translate(329 304) rotate(-1) scale(0.6)", sage: false },
  { t: "translate(285 330) rotate(14) scale(0.5)", sage: false },
];

const teamPieces: { t: string; sage: boolean }[] = [
  { t: "translate(45.0 14.4) rotate(22.1) scale(0.70)", sage: true },
  { t: "translate(64.6 14.4) rotate(30.9) scale(0.67)", sage: true },
  { t: "translate(83.6 17.0) rotate(-43.6) scale(0.75)", sage: true },
  { t: "translate(104.1 15.8) rotate(59.6) scale(0.70)", sage: true },
  { t: "translate(121.4 14.1) rotate(-11.6) scale(0.81)", sage: false },
  { t: "translate(140.8 15.3) rotate(54.6) scale(0.69)", sage: false },
  { t: "translate(159.8 14.9) rotate(5.7) scale(0.74)", sage: false },
  { t: "translate(181.8 17.4) rotate(-35.5) scale(0.69)", sage: false },
  { t: "translate(48.3 36.0) rotate(28.2) scale(0.63)", sage: true },
  { t: "translate(67.5 34.6) rotate(35.6) scale(0.66)", sage: true },
  { t: "translate(85.9 32.8) rotate(-33.7) scale(0.75)", sage: true },
  { t: "translate(102.2 33.3) rotate(-12.5) scale(0.69)", sage: true },
  { t: "translate(123.6 35.3) rotate(57.2) scale(0.81)", sage: false },
  { t: "translate(144.0 35.2) rotate(-38.8) scale(0.68)", sage: false },
  { t: "translate(161.5 34.2) rotate(-48.8) scale(0.75)", sage: false },
  { t: "translate(178.8 35.7) rotate(23.4) scale(0.74)", sage: false },
  { t: "translate(197.4 33.6) rotate(17.9) scale(0.80)", sage: false },
  { t: "translate(30.0 50.8) rotate(36.1) scale(0.71)", sage: true },
  { t: "translate(46.8 53.2) rotate(-45.8) scale(0.73)", sage: true },
  { t: "translate(64.4 53.9) rotate(-36.7) scale(0.64)", sage: true },
  { t: "translate(84.3 52.9) rotate(-2.9) scale(0.79)", sage: true },
  { t: "translate(104.0 53.2) rotate(-15.3) scale(0.68)", sage: true },
  { t: "translate(123.5 52.5) rotate(-46.6) scale(0.63)", sage: false },
  { t: "translate(140.6 52.9) rotate(56.8) scale(0.76)", sage: false },
  { t: "translate(162.1 51.0) rotate(58.2) scale(0.77)", sage: false },
  { t: "translate(179.4 50.0) rotate(-26.1) scale(0.70)", sage: false },
  { t: "translate(197.7 50.2) rotate(43.8) scale(0.64)", sage: false },
  { t: "translate(45.2 70.5) rotate(-36.8) scale(0.66)", sage: true },
  { t: "translate(67.3 69.2) rotate(-5.4) scale(0.66)", sage: true },
  { t: "translate(85.8 70.1) rotate(-11.8) scale(0.79)", sage: true },
  { t: "translate(104.1 70.9) rotate(26.0) scale(0.71)", sage: true },
  { t: "translate(122.9 68.5) rotate(34.0) scale(0.64)", sage: false },
  { t: "translate(143.0 71.8) rotate(9.6) scale(0.76)", sage: false },
  { t: "translate(159.7 71.4) rotate(-9.0) scale(0.64)", sage: false },
  { t: "translate(178.6 69.5) rotate(-8.9) scale(0.68)", sage: false },
];

const operationsPieces: { t: string; sage: boolean; op: number }[] = [
  { t: "translate(16.0 24.0) rotate(10.2) scale(0.64)", sage: false, op: 0.6 },
  { t: "translate(39.0 65.0) rotate(1.3) scale(0.64)", sage: false, op: 0.6 },
  { t: "translate(54.0 22.0) rotate(2.0) scale(0.59)", sage: false, op: 0.6 },
  { t: "translate(74.0 50.0) rotate(-69.0) scale(0.71)", sage: false, op: 0.6 },
  { t: "translate(97.0 17.0) rotate(52.6) scale(0.57)", sage: false, op: 0.6 },
  { t: "translate(112.0 71.0) rotate(82.0) scale(0.56)", sage: false, op: 0.6 },
  { t: "translate(123.0 41.0) rotate(19.6) scale(0.68)", sage: true, op: 0.6 },
  { t: "translate(162.0 18.0) rotate(-21.3) scale(0.72)", sage: false, op: 1 },
  { t: "translate(179.0 18.0) rotate(-19.4) scale(0.72)", sage: true, op: 1 },
  { t: "translate(196.0 18.0) rotate(-11.4) scale(0.72)", sage: true, op: 1 },
  { t: "translate(213.0 18.0) rotate(-1.6) scale(0.72)", sage: false, op: 1 },
  { t: "translate(145.0 35.0) rotate(15.1) scale(0.72)", sage: false, op: 1 },
  { t: "translate(162.0 35.0) rotate(6.2) scale(0.72)", sage: false, op: 1 },
  { t: "translate(179.0 35.0) rotate(7.1) scale(0.72)", sage: false, op: 1 },
  { t: "translate(196.0 35.0) rotate(-9.8) scale(0.72)", sage: false, op: 1 },
  { t: "translate(213.0 35.0) rotate(21.8) scale(0.72)", sage: false, op: 1 },
  { t: "translate(145.0 52.0) rotate(9.1) scale(0.72)", sage: false, op: 1 },
  { t: "translate(162.0 52.0) rotate(-11.9) scale(0.72)", sage: false, op: 1 },
  { t: "translate(179.0 52.0) rotate(-18.9) scale(0.72)", sage: false, op: 1 },
  { t: "translate(196.0 52.0) rotate(-4.4) scale(0.72)", sage: false, op: 1 },
  { t: "translate(213.0 52.0) rotate(-5.0) scale(0.72)", sage: false, op: 1 },
  { t: "translate(145.0 69.0) rotate(15.3) scale(0.72)", sage: true, op: 1 },
  { t: "translate(162.0 69.0) rotate(-12.8) scale(0.72)", sage: false, op: 1 },
  { t: "translate(179.0 69.0) rotate(-1.3) scale(0.72)", sage: false, op: 1 },
  { t: "translate(196.0 69.0) rotate(-4.5) scale(0.72)", sage: true, op: 1 },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function PairGrid({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="pair-grid">
      {items.map((item) => (
        <div key={item.title} className="pair">
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </div>
      ))}
    </div>
  );
}

function PrinciplesComposition() {
  return (
    <svg
      aria-hidden="true"
      className="principles-composition"
      focusable="false"
      viewBox="0 0 360 360"
    >
      {principlesPieces.map((p, i) => (
        <path
          key={i}
          className={p.sage ? "tessera sage" : "tessera"}
          d={TESSERA_D}
          transform={p.t}
        />
      ))}
    </svg>
  );
}

function SectionComposition({
  pieces,
}: {
  pieces: { t: string; sage: boolean; op?: number }[];
}) {
  return (
    <svg
      aria-hidden="true"
      className="section-composition"
      focusable="false"
      viewBox="0 0 240 90"
    >
      {pieces.map((p, i) => (
        <path
          key={i}
          className={p.sage ? "motif-piece sage" : "motif-piece"}
          d={MOTIF_D}
          opacity={p.op ?? 1}
          transform={p.t}
        />
      ))}
    </svg>
  );
}

function GateScreen({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function attempt() {
    if (code.trim().toLowerCase() === ACCESS_CODE.toLowerCase()) {
      onUnlock();
    } else {
      setError(true);
      setCode("");
      inputRef.current?.focus();
    }
  }

  return (
    <main
      className="tsi-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{TSI_STYLES}</style>
      <div style={{ width: "100%", maxWidth: 360, padding: "48px 0" }}>
        <Image
          src="/ramprate-logo.png"
          alt="RampRate"
          width={140}
          height={34}
          style={{
            width: 120,
            height: "auto",
            display: "block",
            margin: "0 auto 24px",
          }}
        />
        <p className="eyebrow" style={{ textAlign: "center" }}>
          RampRate + TSI
        </p>
        <h1
          style={{
            fontSize: "1.7rem",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          A partnership discussion
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "var(--ink-soft)",
            fontSize: ".92rem",
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          This discussion is confidential. Enter the access code to continue.
        </p>
        <input
          ref={inputRef}
          type="password"
          value={code}
          autoFocus
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && attempt()}
          placeholder="Access code"
          autoComplete="off"
          style={{
            width: "100%",
            padding: "12px 16px",
            border: `1px solid ${error ? "var(--error)" : "var(--line)"}`,
            borderRadius: 10,
            fontSize: ".95rem",
            color: "var(--ink)",
            background: "var(--bg)",
            marginBottom: 12,
          }}
        />
        {error && (
          <p
            style={{
              fontSize: ".85rem",
              color: "var(--error)",
              marginBottom: 12,
            }}
          >
            Incorrect code. Please try again.
          </p>
        )}
        <button
          onClick={attempt}
          style={{
            width: "100%",
            padding: "13px 16px",
            background: "var(--accent)",
            color: "var(--bg)",
            border: "none",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: ".95rem",
            cursor: "pointer",
          }}
        >
          Enter
        </button>
      </div>
    </main>
  );
}

function TsiPartnershipContent() {
  return (
    <div className="tsi-page">
      <style>{TSI_STYLES}</style>

      <header className="brand-bar">
        <span className="brand-chip">
          <Image
            src="/tsi-partnership/bcorp-badge.webp"
            alt="RampRate — Certified B Corporation"
            width={1140}
            height={246}
          />
        </span>
        <p className="note">
          Confidential discussion materials prepared for TSI.
        </p>
      </header>

      <nav className="toc" aria-label="Section navigation">
        <div className="toc-inner">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
      </nav>

      <section className="hero">
        <div>
          <p className="eyebrow">RampRate + TSI / A partnership discussion</p>
          <h1>TSI has built the manufacturing strength.</h1>
          <p className="tagline">
            Let&rsquo;s explore the next chapter of US institutional growth.
          </p>
          <p>
            Tailored Script brings personalized nutrition within reach of
            partner brands. Together, we can build buyer relationships and a
            practical route to sustained institutional growth, starting with a
            focused employer-health pilot.
          </p>
          <p>
            TSI has built real momentum here: nearly 30 years operating in the
            US ingredients business, a 2025 listing on the Shanghai Stock
            Exchange, and an expanding US manufacturing footprint anchored by
            the Arizona facility. Our role is to help write the next chapter,
            not to redo what you&rsquo;ve already built.
          </p>
        </div>
        <div className="scene tailored-weave">
          <Image
            src="/tsi-partnership/weave-art.png"
            alt="Distinct ceramic elements assembled into one individual organic form: a metaphor for personalized nutrition."
            className="weave-art"
            width={440}
            height={440}
            priority
          />
        </div>
      </section>

      <section className="section" id="heard">
        <Eyebrow>Listening first</Eyebrow>
        <h2>What we heard from you</h2>
        <PairGrid items={heardItems} />
      </section>

      <section className="section" id="market">
        <Eyebrow>The opportunity</Eyebrow>
        <h2>Start with a focused route to institutional buyers</h2>
        <div className="prose">
          <p>
            You have asked for a few strong partners and a pilot that proves
            volume and economics before wider expansion. We suggest starting
            with EAP and self-insured-employer pathways. A consumer-facing brand
            partner leads engagement, supported by TSI&rsquo;s manufacturing and
            dispensing platform.
          </p>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Potential channel</th>
                <th>Possible route</th>
                <th>Question to answer</th>
              </tr>
            </thead>
            <tbody>
              {marketRows.map((row) => (
                <tr key={row[0]}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="prose">
          <p>
            These are routes to evaluate together. The first engagement focuses
            on one or two closely related fronts, rather than opening every
            channel at once.
          </p>
        </div>
      </section>

      <section className="section" id="model">
        <Eyebrow>Joint decisions</Eyebrow>
        <h2>The questions we should answer together</h2>
        <PairGrid items={modelItems} />
      </section>

      <section className="section" id="about">
        <Eyebrow>About RampRate</Eyebrow>
        <h2>Senior leadership, with specialists matched to the work</h2>
        <div className="prose">
          <p>
            RampRate is a global advisory firm founded in 2000 — 25 years
            connecting market research, partner relationships and commercial
            execution across enterprise technology, digital media, sourcing and
            health and wellness. RampRate reports billions of dollars in
            cumulative commercial transactions across that work; this is
            RampRate&rsquo;s own account, not independently audited.
          </p>
          <p>
            Tony Greenberg and Alex Veytsel bring complementary relationship and
            commercial experience. Healthcare channel operators, clinical
            advisers and qualified counsel join where the work requires them.
          </p>
        </div>
        <div className="principals-grid">
          <div className="principal">
            <Image
              src="/tsi-partnership/avatar-tony.jpg"
              alt="Tony Greenberg"
              className="avatar"
              width={220}
              height={220}
            />
            <div>
              <h3>Tony Greenberg</h3>
              <p className="role">Founder &amp; CEO</p>
              <p>
                Founded RampRate in 2000. Brings enterprise relationships,
                senior commercial leadership and a focus on opportunities that
                improve lives.
              </p>
            </div>
          </div>
          <div className="principal">
            <Image
              src="/tsi-partnership/avatar-alex.jpg"
              alt="Alex Veytsel"
              className="avatar"
              width={220}
              height={220}
            />
            <div>
              <h3>Alex Veytsel</h3>
              <p className="role">Chief Strategy Officer</p>
              <p>
                Joined RampRate in 2004. Brings value-chain analysis, partner
                strategy and experience structuring new business models.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="principles" id="principles">
        <PrinciplesComposition />
        <Eyebrow>Principles</Eyebrow>
        <h2>
          Less friction. Clearer decisions. Stronger partnerships. A better
          tomorrow we can help build.
        </h2>
        <div className="prose">
          <p>
            We research before making commitments, keep responsibilities and
            incentives clear, and match claims to evidence. Senior leaders stay
            involved and specialists have defined outputs.
          </p>
          <p>
            The purpose is practical: help partners bring useful nutrition
            services to more people while building a business that can sustain
            them.
          </p>
        </div>
      </section>

      <section className="section" id="why-us">
        <Eyebrow>Relevant experience</Eyebrow>
        <h2>Three examples of the work we bring</h2>
        <div className="prose">
          <p>
            The following examples are drawn from RampRate&rsquo;s internal
            account of its work. They describe commercial experience, rather
            than verified health outcomes. Specific references can be agreed for
            follow-up.
          </p>
        </div>
        <PairGrid items={whyUsItems} />
      </section>

      <section className="section has-composition" id="team">
        <Eyebrow>Operating model</Eyebrow>
        <h2>One coordinated team around TSI&rsquo;s capabilities</h2>
        <SectionComposition pieces={teamPieces} />
        <PairGrid
          items={[
            {
              title: "TSI supplies the product capability",
              body: "TSI leads formulation, manufacturing, dispensing and quality. The partner brand carries consumer engagement and the agreed labeling, claims and regulatory responsibilities.",
            },
            {
              title: "RampRate develops the buyer relationships",
              body: "We map priority segments, qualify buyer interest, assemble specialists and coordinate negotiations and pilot delivery. TSI retains final commercial approval.",
            },
          ]}
        />
        <div className="prose">
          <p>
            RampRate runs the channel work day to day, and the agreed scope will
            name the people, outputs, budgets and approval responsibilities.
          </p>
        </div>
      </section>

      <section className="section" id="agreements">
        <Eyebrow>Commercial discipline</Eyebrow>
        <h2>Build relationships that work for both sides</h2>
        <div className="prose">
          <p>
            Buyer agreements protect contribution and make service duties clear.
            We compare pricing, partner compensation, volumes, payment terms,
            fulfillment and support costs before recommending a route.
          </p>
          <p>
            The aim is repeatable business with clear customer and data
            responsibilities, rather than volume that creates delivery problems.
          </p>
        </div>
      </section>

      <section className="section" id="pilot">
        <Eyebrow>Pilot and evidence</Eyebrow>
        <h2>A focused pilot with a clear expansion decision</h2>
        <PairGrid items={pilotItems} />
        <div className="prose">
          <p>
            Buyer reporting uses only the information needed for the pilot, with
            clear permissions and consent for identifiable health data. The
            pilot ends with a decision to expand, revise or stop.
          </p>
        </div>
      </section>

      <section className="section has-composition" id="operations">
        <Eyebrow>Beyond the pilot</Eyebrow>
        <h2>Keep buyer promises connected to delivery</h2>
        <SectionComposition pieces={operationsPieces} />
        <PairGrid items={operationsItems} />
        <div className="prose">
          <p>
            This is how a successful first engagement becomes an ongoing
            operating relationship.
          </p>
        </div>
      </section>

      <section className="section" id="roadmap">
        <Eyebrow>Discussion framework</Eyebrow>
        <h2>An eight-week path to a joint decision</h2>
        <div className="prose">
          <p>
            This is a framework for discussion, not a fixed delivery commitment.
            Research and buyer conversations run together, and the detailed
            scope sets the calendar and dependencies.
          </p>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Discussion stage</th>
                <th>Work to explore</th>
                <th>Potential outcome</th>
              </tr>
            </thead>
            <tbody>
              {roadmapRows.map((row) => (
                <tr key={row[0]}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="prose">
          <p>
            The outcome we seek is a clear route to a viable first pilot. A
            signed buyer agreement or launched pilot depends on the decisions
            and readiness established during the work.
          </p>
        </div>
      </section>

      <section className="section partnership" id="partnership">
        <Image
          src="/tsi-partnership/weave-art.png"
          alt=""
          aria-hidden="true"
          className="partnership-weave"
          width={132}
          height={132}
        />
        <Eyebrow>The long-term partnership</Eyebrow>
        <h2>The role we want to earn</h2>
        <div className="prose">
          <p>
            We want to earn a larger role through results — in the United States
            first, and where it makes sense, in other countries where you have
            not yet established channel operations. Together, we can remove
            barriers to market entry, build strong buyer relationships and turn
            your manufacturing capabilities into sustained growth.
          </p>
          <p>
            Begin with a focused market and pilot engagement. Earn a broader
            role through buyer demand, sound economics and reliable delivery.
            TSI decides how the relationship grows.
          </p>
        </div>
      </section>

      <section className="section" id="commercial">
        <Eyebrow>Commercial relationship</Eyebrow>
        <div className="prose">
          <p>A standard agreement goes in place before work starts.</p>
        </div>
      </section>

      <section className="section" id="options">
        <Eyebrow>Adjacent opportunities</Eyebrow>
        <h2>Keep the next opportunities in view</h2>
        <PairGrid items={optionsItems} />
        <div className="prose">
          <p>
            These ideas can support later product development. Their inclusion
            in the first engagement is a joint decision.
          </p>
        </div>
      </section>

      <section className="section" id="next">
        <Eyebrow>Next step</Eyebrow>
        <h2>Let&rsquo;s start with a phone call</h2>
        <div className="prose">
          <p>
            Let&rsquo;s start with a phone call to align on priorities and
            discuss a scope of work.
          </p>
          <p>
            We can use the call to choose the first channel, agree what a useful
            pilot should prove and identify the product, capacity and partner
            information needed to move forward. Tony will coordinate the
            RampRate side.
          </p>
        </div>
      </section>

      <section className="section" id="terms">
        <Eyebrow>Reference</Eyebrow>
        <details className="reference-terms">
          <summary>A few terms, defined</summary>
          <dl className="glossary">
            {glossary.map((row) => (
              <Fragment key={row[0]}>
                <dt>{row[0]}</dt>
                <dd>{row[1]}</dd>
              </Fragment>
            ))}
          </dl>
        </details>
      </section>

      <footer className="footer">
        <span className="brand-chip">
          <Image
            src="/tsi-partnership/bcorp-badge.webp"
            alt="RampRate — Certified B Corporation"
            width={1140}
            height={246}
          />
        </span>
        <p>Confidential discussion materials prepared for TSI.</p>
      </footer>
    </div>
  );
}

export default function TsiPartnershipGate() {
  const [unlocked, setUnlocked] = useState(false);

  // Smooth in-page anchor scrolling for the sticky section nav, limited to
  // this route and skipped for anyone who has asked for reduced motion.
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "smooth";
    return () => {
      root.style.scrollBehavior = previous;
    };
  }, []);

  // This page's content column is capped at 1120px and centered, but <body>
  // still carries the site's own near-black background (globals.css sets
  // `--dark` on body for every other route). On any viewport wider than the
  // column, that showed through as dark bars down both sides. Matching the
  // body to this page's own ivory background for as long as the page is
  // mounted removes the seam; restoring the previous inline value on unmount
  // hands the site's dark background straight back to every other route.
  useEffect(() => {
    const body = document.body;
    const previous = body.style.background;
    body.style.background = "#FAF5EE";
    return () => {
      body.style.background = previous;
    };
  }, []);

  return unlocked ? (
    <TsiPartnershipContent />
  ) : (
    <GateScreen onUnlock={() => setUnlocked(true)} />
  );
}
