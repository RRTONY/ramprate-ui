"use client";

import { useRef, useState } from "react";
import Image from "next/image";

// Self-contained client-side gate, same pattern as /aidoc-ownership-brief:
// no dependency on src/lib/portal-auth.ts's fixed PORTAL_IDS registry, so
// this page can ship on its own. Not meant for anything more sensitive than
// keeping this discussion off the open web - it's one link, shared directly.
const ACCESS_CODE = "TSI-2026";

const navLinks = [
  { href: "#heard", label: "Heard" },
  { href: "#channels", label: "Channels" },
  { href: "#questions", label: "Questions" },
  { href: "#team", label: "Team" },
  { href: "#pilot", label: "Pilot" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#role", label: "Role" },
  { href: "#call", label: "Call" },
];

const heardFromYou = [
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

const channelRows = [
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

const questions = [
  {
    q: "What would a useful first pilot prove?",
    a: "Agree the population, product, payer and baseline, and how to test adoption, commercial economics and any proposed savings with suitable evidence.",
  },
  {
    q: "What is the route to new US capacity?",
    a: "Your team reported that the two Phoenix machines were fully booked. We should confirm the current position and whether an alternative supply route could support a pilot.",
  },
  {
    q: "What would it take, financially, to scale the dispensing machines if the pilot works?",
    a: "We should understand additional-machine costs and financing responsibilities before committing to a wider rollout.",
  },
  {
    q: "Who carries each responsibility?",
    a: "Identify the partner brand and confirm who owns engagement, labeling, product claims, regulatory compliance and delivery, with one decision contact on each side.",
  },
  {
    q: "What should the relationship become?",
    a: "Review the patent position with qualified counsel and agree what evidence would support a larger operating role. TSI decides the scope, pace and direction.",
  },
];

const examples = [
  {
    title: "Mapping a complex partner ecosystem",
    body: "For a major global technology company, RampRate mapped channel and partnership relationships across telecom, cybersecurity, gaming and online child safety. The relevant method is to identify buyers, partner incentives and routes to market.",
  },
  {
    title: "Building workable channel terms",
    body: "RampRate has developed channel-agreement templates and partner compensation structures for growing companies, turning buyer interest into agreements with clear economics and responsibilities.",
  },
  {
    title: "Health and supplement relationships",
    body: "We have signed more than 500 channel agreements across our work, including relationships with peptide manufacturers and distributors. This supports commercial execution; clinical evidence and regulatory suitability require separate specialists.",
  },
];

const roadmap = [
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

const opportunities = [
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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-xs font-semibold tracking-[0.2em] uppercase"
      style={{ color: "var(--gold)", fontFamily: "var(--font-mono)" }}
    >
      {children}
    </span>
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
    <main className="min-h-screen bg-white flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Image
          src="/ramprate-logo.png"
          alt="RampRate"
          width={140}
          height={34}
          className="w-[140px] h-auto mx-auto mb-8"
        />
        <div
          className="text-2xl font-bold mb-2 text-center"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-ink)",
          }}
        >
          TSI &amp; RampRate
        </div>
        <p
          className="text-sm text-center mb-8"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-ink-mid)",
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
          className="w-full px-4 py-3 border-2 border-black rounded text-sm text-black bg-white focus:outline-none mb-3"
          style={{ fontFamily: "var(--font-body)" }}
        />
        {error && (
          <p
            className="text-sm text-red-600 mb-3"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Incorrect code. Please try again.
          </p>
        )}
        <button
          onClick={attempt}
          className="w-full py-3 bg-black text-white font-bold rounded text-sm hover:bg-gray-800 transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Enter
        </button>
      </div>
    </main>
  );
}

function TsiPartnershipContent() {
  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <nav className="sticky top-0 z-30 bg-dark/95 backdrop-blur border-b border-white/10">
        <div className="max-w-[1180px] mx-auto px-7 h-16 flex items-center gap-5">
          <Image
            src="/ramprate-logo.png"
            alt="RampRate"
            width={110}
            height={26}
            className="w-[110px] h-auto brightness-0 invert"
          />
          <div className="ml-auto flex items-center gap-5 overflow-x-auto no-scrollbar">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[11px] font-mono uppercase tracking-wide text-white/60 hover:text-gold-light whitespace-nowrap"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <header className="relative overflow-hidden bg-dark">
        <div className="max-w-[1180px] mx-auto px-7 pt-16 pb-16">
          <div className="flex gap-3 flex-wrap mb-7">
            <span className="rounded-full border border-white/25 bg-white/5 px-3 py-2 text-[11px] font-mono text-white/80">
              CONFIDENTIAL
            </span>
            <span className="rounded-full border border-white/25 bg-white/5 px-3 py-2 text-[11px] font-mono text-white/80">
              PARTNERSHIP DISCUSSION
            </span>
          </div>
          <div className="text-xs font-mono uppercase tracking-[0.08em] text-gold-light mb-3">
            TSI has built the manufacturing strength
          </div>
          <h1 className="text-[clamp(2rem,5vw,3.6rem)] leading-[1.05] tracking-[-0.02em] font-bold text-white max-w-[780px] mb-5 font-display">
            TSI and RampRate: What We Can Build Together
          </h1>
          <p className="text-white/70 text-lg italic max-w-[640px] font-display">
            Let&rsquo;s explore the next chapter of US institutional growth.
          </p>
        </div>
      </header>

      <section className="section-warm py-20">
        <div className="max-w-[820px] mx-auto px-7">
          <p className="text-[17px] leading-relaxed mb-5">
            Tailored Script brings personalized nutrition within reach of
            partner brands. Together, we can build buyer relationships and a
            practical route to sustained institutional growth, starting with a
            focused employer-health pilot.
          </p>
          <p
            className="text-[17px] leading-relaxed"
            style={{ color: "var(--color-ink-mid)" }}
          >
            TSI has built real momentum here: nearly 30 years operating in the
            US ingredients business, a 2025 listing on the Shanghai Stock
            Exchange, and an expanding US manufacturing footprint anchored by
            the Arizona facility. Our role is to help write the next chapter,
            not to redo what you&rsquo;ve already built.
          </p>
        </div>
      </section>

      <section className="section-light py-20" id="heard">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="mb-10">
            <Eyebrow>Listening first</Eyebrow>
            <h2 className="text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold font-display mt-2">
              What we heard from you
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {heardFromYou.map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-bold mb-1 font-display">
                  {item.title}
                </h3>
                <p style={{ color: "var(--color-ink-mid)" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-warm py-20" id="channels">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="mb-8">
            <Eyebrow>A focused route</Eyebrow>
            <h2 className="text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold font-display mt-2 mb-4">
              Start with a focused route to institutional buyers
            </h2>
            <p
              className="max-w-[760px]"
              style={{ color: "var(--color-ink-mid)" }}
            >
              You have asked for a few strong partners and a pilot that proves
              volume and economics before wider expansion. We suggest starting
              with EAP and self-insured-employer pathways. A consumer-facing
              brand partner leads engagement, supported by TSI&rsquo;s
              manufacturing and dispensing platform.
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-black/10">
                  <th className="px-6 py-4 font-semibold">Potential channel</th>
                  <th className="px-6 py-4 font-semibold">Possible route</th>
                  <th className="px-6 py-4 font-semibold">
                    Question to answer
                  </th>
                </tr>
              </thead>
              <tbody>
                {channelRows.map((row, i) => (
                  <tr
                    key={row[0]}
                    className={
                      i < channelRows.length - 1
                        ? "border-b border-black/5"
                        : ""
                    }
                  >
                    <td className="px-6 py-4 font-medium align-top">
                      {row[0]}
                    </td>
                    <td
                      className="px-6 py-4 align-top"
                      style={{ color: "var(--color-ink-mid)" }}
                    >
                      {row[1]}
                    </td>
                    <td
                      className="px-6 py-4 align-top"
                      style={{ color: "var(--color-ink-mid)" }}
                    >
                      {row[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p
            className="mt-6 max-w-[760px]"
            style={{ color: "var(--color-ink-mid)" }}
          >
            These are routes to evaluate together. The first engagement focuses
            on one or two closely related fronts, rather than opening every
            channel at once.
          </p>
        </div>
      </section>

      <section className="section-light py-20" id="questions">
        <div className="max-w-[820px] mx-auto px-7">
          <Eyebrow>Open together</Eyebrow>
          <h2 className="text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold font-display mt-2 mb-3">
            The questions we should answer together
          </h2>
          <p className="mb-8" style={{ color: "var(--color-ink-mid)" }}>
            Five open questions will shape the scope:
          </p>
          <ol className="flex flex-col gap-6">
            {questions.map((item, i) => (
              <li key={item.q} className="flex gap-4">
                <span
                  className="shrink-0 text-sm font-bold font-mono w-7 h-7 rounded-full flex items-center justify-center text-black"
                  style={{ background: "var(--gold)" }}
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold font-display mb-1">{item.q}</h3>
                  <p style={{ color: "var(--color-ink-mid)" }}>{item.a}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-warm py-20" id="team">
        <div className="max-w-[820px] mx-auto px-7">
          <Eyebrow>Who&rsquo;s involved</Eyebrow>
          <h2 className="text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold font-display mt-2 mb-5">
            Senior leadership, with specialists matched to the work
          </h2>
          <p className="text-[17px] leading-relaxed mb-5">
            RampRate is a global advisory firm founded in 2000 &mdash; 25 years
            connecting market research, partner relationships and commercial
            execution across enterprise technology, digital media, sourcing and
            health and wellness. RampRate reports billions of dollars in
            cumulative commercial transactions across that work; this is
            RampRate&rsquo;s own account, not independently audited. Tony
            Greenberg and Alex Veytsel bring complementary relationship and
            commercial experience; healthcare channel operators, clinical
            advisers and qualified counsel join where the work requires them.
          </p>
          <p
            className="text-[17px] leading-relaxed"
            style={{ color: "var(--color-ink-mid)" }}
          >
            Tony Greenberg, founder and CEO, founded RampRate in 2000 and brings
            enterprise relationships, senior commercial leadership and a focus
            on opportunities that improve lives. Alex Veytsel, chief strategy
            officer, joined RampRate in 2004 and brings value-chain analysis,
            partner strategy and experience structuring new business models.
          </p>
        </div>
      </section>

      <section className="section-light py-20 text-center">
        <div className="max-w-[760px] mx-auto px-7">
          <p className="text-[clamp(1.3rem,3vw,1.8rem)] italic font-display leading-snug">
            Less friction. Clearer decisions. Stronger partnerships. A better
            tomorrow we can help build.
          </p>
          <p className="mt-6" style={{ color: "var(--color-ink-mid)" }}>
            We research before making commitments, keep responsibilities and
            incentives clear, and match claims to evidence. Senior leaders stay
            involved and specialists have defined outputs.
          </p>
          <p className="mt-3" style={{ color: "var(--color-ink-mid)" }}>
            The purpose is practical: help partners bring useful nutrition
            services to more people while building a business that can sustain
            them.
          </p>
        </div>
      </section>

      <section className="section-warm py-20">
        <div className="max-w-[1180px] mx-auto px-7">
          <Eyebrow>Track record</Eyebrow>
          <h2 className="text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold font-display mt-2 mb-3">
            Three examples of the work we bring
          </h2>
          <p
            className="mb-8 max-w-[760px]"
            style={{ color: "var(--color-ink-mid)" }}
          >
            The following examples are drawn from RampRate&rsquo;s internal
            account of its work. They describe commercial experience, rather
            than verified health outcomes. Specific references can be agreed for
            follow-up.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {examples.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-black/10 bg-white p-7"
              >
                <h3 className="text-lg font-bold mb-2 font-display">
                  {item.title}
                </h3>
                <p
                  className="text-[15px] leading-relaxed"
                  style={{ color: "var(--color-ink-mid)" }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light py-20" id="pilot">
        <div className="max-w-[820px] mx-auto px-7">
          <Eyebrow>How we work together</Eyebrow>
          <h2 className="text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold font-display mt-2 mb-6">
            One coordinated team around TSI&rsquo;s capabilities
          </h2>
          <div className="flex flex-col gap-6 mb-10">
            <div>
              <h3 className="font-bold font-display mb-1">
                TSI supplies the product capability
              </h3>
              <p style={{ color: "var(--color-ink-mid)" }}>
                TSI leads formulation, manufacturing, dispensing and quality.
                The partner brand carries consumer engagement and the agreed
                labeling, claims and regulatory responsibilities.
              </p>
            </div>
            <div>
              <h3 className="font-bold font-display mb-1">
                RampRate develops the buyer relationships
              </h3>
              <p style={{ color: "var(--color-ink-mid)" }}>
                We map priority segments, qualify buyer interest, assemble
                specialists and coordinate negotiations and pilot delivery. TSI
                retains final commercial approval. RampRate runs the channel
                work day to day, and the agreed scope will name the people,
                outputs, budgets and approval responsibilities.
              </p>
            </div>
          </div>

          <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-bold font-display mb-5">
            A focused pilot with a clear expansion decision
          </h2>
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-bold font-display mb-1">
                Testing the commercial model
              </h3>
              <p style={{ color: "var(--color-ink-mid)" }}>
                Agreeing one population, a defined product scope and a payment
                model, then tracking participation, adherence, replenishment,
                retention, delivery, service costs and retained contribution.
              </p>
            </div>
            <div>
              <h3 className="font-bold font-display mb-1">
                Building credible proof
              </h3>
              <p style={{ color: "var(--color-ink-mid)" }}>
                Clinical advisers help choose appropriate baseline and outcome
                measures, and any claim about health improvement or
                healthcare-cost savings needs a suitable study design and
                supporting evidence. Buyer reporting uses only the information
                needed for the pilot, with clear permissions and consent for
                identifiable health data. The pilot ends with a decision to
                expand, revise or stop.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-warm py-20">
        <div className="max-w-[820px] mx-auto px-7">
          <Eyebrow>Staying accountable</Eyebrow>
          <h2 className="text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold font-display mt-2 mb-5">
            Keep buyer promises connected to delivery
          </h2>
          <p className="mb-4" style={{ color: "var(--color-ink-mid)" }}>
            Operating successful channels means coordinating onboarding,
            approved materials, account handoffs, partner support, renewals and
            issue resolution. Making progress visible means maintaining a buyer
            pipeline, economics review and action log, and reviewing revenue,
            contribution, cash collection and delivery performance, with owners
            for corrective actions.
          </p>
          <p style={{ color: "var(--color-ink-mid)" }}>
            This is how a successful first engagement becomes an ongoing
            operating relationship.
          </p>
        </div>
      </section>

      <section className="section-light py-20" id="roadmap">
        <div className="max-w-[1180px] mx-auto px-7">
          <Eyebrow>Eight weeks</Eyebrow>
          <h2 className="text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold font-display mt-2 mb-3">
            An eight-week path to a joint decision
          </h2>
          <p
            className="mb-8 max-w-[760px]"
            style={{ color: "var(--color-ink-mid)" }}
          >
            This is a framework for discussion, not a fixed delivery commitment.
            Research and buyer conversations run together, and the detailed
            scope sets the calendar and dependencies.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-black/10">
                  <th className="px-6 py-4 font-semibold">Discussion stage</th>
                  <th className="px-6 py-4 font-semibold">Work to explore</th>
                  <th className="px-6 py-4 font-semibold">Potential outcome</th>
                </tr>
              </thead>
              <tbody>
                {roadmap.map((row, i) => (
                  <tr
                    key={row[0]}
                    className={
                      i < roadmap.length - 1 ? "border-b border-black/5" : ""
                    }
                  >
                    <td className="px-6 py-4 font-medium align-top whitespace-nowrap">
                      {row[0]}
                    </td>
                    <td
                      className="px-6 py-4 align-top"
                      style={{ color: "var(--color-ink-mid)" }}
                    >
                      {row[1]}
                    </td>
                    <td
                      className="px-6 py-4 align-top"
                      style={{ color: "var(--color-ink-mid)" }}
                    >
                      {row[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p
            className="mt-6 max-w-[760px]"
            style={{ color: "var(--color-ink-mid)" }}
          >
            The outcome we seek is a clear route to a viable first pilot. A
            signed buyer agreement or launched pilot depends on the decisions
            and readiness established during the work.
          </p>
        </div>
      </section>

      <section className="section-warm py-20" id="role">
        <div className="max-w-[820px] mx-auto px-7">
          <Eyebrow>Earned, not assumed</Eyebrow>
          <h2 className="text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold font-display mt-2 mb-5">
            The role we want to earn
          </h2>
          <p className="text-[17px] leading-relaxed mb-5">
            We want to earn a larger role through results &mdash; in the United
            States first, and where it makes sense, in other countries where you
            have not yet established channel operations. Together, we can remove
            barriers to market entry, build strong buyer relationships and turn
            your manufacturing capabilities into sustained growth.
          </p>
          <p className="mb-5" style={{ color: "var(--color-ink-mid)" }}>
            Begin with a focused market and pilot engagement. Earn a broader
            role through buyer demand, sound economics and reliable delivery.
            TSI decides how the relationship grows.
          </p>
          <p className="font-semibold">
            A standard agreement goes in place before work starts.
          </p>
        </div>
      </section>

      <section className="section-light py-20">
        <div className="max-w-[820px] mx-auto px-7">
          <Eyebrow>Looking ahead</Eyebrow>
          <h2 className="text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold font-display mt-2 mb-6">
            Keep the next opportunities in view
          </h2>
          <div className="flex flex-col gap-6 mb-6">
            {opportunities.map((item) => (
              <div key={item.title}>
                <h3 className="font-bold font-display mb-1">{item.title}</h3>
                <p style={{ color: "var(--color-ink-mid)" }}>{item.body}</p>
              </div>
            ))}
          </div>
          <p style={{ color: "var(--color-ink-mid)" }}>
            These ideas can support later product development. Their inclusion
            in the first engagement is a joint decision.
          </p>
        </div>
      </section>

      <section
        className="py-20 text-center"
        id="call"
        style={{ background: "var(--gold)" }}
      >
        <div className="max-w-[700px] mx-auto px-7">
          <h2 className="text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold font-display mb-4 text-black">
            Let&rsquo;s start with a phone call
          </h2>
          <p className="mb-9 text-black/80">
            We can use the call to choose the first channel, agree what a useful
            pilot should prove and identify the product, capacity and partner
            information needed to move forward. Tony will coordinate the
            RampRate side.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 rounded-xl font-bold text-sm bg-black text-white"
          >
            Schedule a call
          </a>
        </div>
      </section>

      <section className="section-warm py-20">
        <div className="max-w-[820px] mx-auto px-7">
          <Eyebrow>A few terms, defined</Eyebrow>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-black/10 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-black/10">
                  <th className="px-6 py-4 font-semibold">Term</th>
                  <th className="px-6 py-4 font-semibold">Definition</th>
                </tr>
              </thead>
              <tbody>
                {glossary.map((row, i) => (
                  <tr
                    key={row[0]}
                    className={
                      i < glossary.length - 1 ? "border-b border-black/5" : ""
                    }
                  >
                    <td className="px-6 py-4 font-medium align-top whitespace-nowrap">
                      {row[0]}
                    </td>
                    <td
                      className="px-6 py-4 align-top"
                      style={{ color: "var(--color-ink-mid)" }}
                    >
                      {row[1]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className="bg-dark py-11 border-t border-white/10">
        <div className="max-w-[1180px] mx-auto px-7 flex flex-wrap items-end justify-between gap-5">
          <Image
            src="/ramprate-logo.png"
            alt="RampRate"
            width={130}
            height={31}
            className="w-[130px] h-auto brightness-0 invert"
          />
          <div className="text-[11px] font-mono text-white/40 text-right">
            RampRate Confidential
            <br />
            TSI and RampRate: What We Can Build Together
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function TsiPartnershipGate() {
  const [unlocked, setUnlocked] = useState(false);
  return unlocked ? (
    <TsiPartnershipContent />
  ) : (
    <GateScreen onUnlock={() => setUnlocked(true)} />
  );
}
