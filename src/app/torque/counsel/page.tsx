import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono } from "next/font/google";
import { isPortalUnlocked } from "@/lib/portal-auth";
import PortalGate from "@/components/portal/PortalGate";
import styles from "./page.module.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-counsel-display",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-counsel-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { absolute: "Torque Counsel Partner Portal | RampRate" },
  description: "A private working guide for attorneys partnering with Torque.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

const values = [
  {
    title: "Impact with integrity",
    copy: "Serve people and mission-driven work. Be honest about what we know, what we do not, and where counsel must lead.",
  },
  {
    title: "Transparency first",
    copy: "Put scope, roles, fees, status and problems in writing early enough for people to make real choices.",
  },
  {
    title: "Aligned incentives",
    copy: "Make the work and its economics easy to understand. Never reward delay, hide a cost, or let a payment question silence a client update.",
  },
  {
    title: "Senior follow-through",
    copy: "Stay close to the work and carry the handoff all the way through. We do not disappear after an introduction.",
  },
];

const steps = [
  {
    title: "Fit and conflicts",
    copy: "We share only the minimum non-sensitive facts needed to check fit. You run conflicts before receiving anything confidential.",
  },
  {
    title: "The client chooses",
    copy: "The client meets you, compares approaches and decides whether to engage. An introduction creates no obligation to retain.",
  },
  {
    title: "Terms in writing",
    copy: "You and the client agree directly on scope, fees, staffing, deadlines and communication before substantive work begins.",
  },
  {
    title: "Work stays visible",
    copy: "The client gets updates and decisions in a usable form. Torque receives only what the client authorizes for coordination.",
  },
];

const disclosures = [
  {
    title: "Torque relationship",
    copy: "Paid client, non-paid client or pro bono support. We name the status for this person and this matter.",
  },
  {
    title: "What Torque is paid for",
    copy: "Whether a Torque fee applies to this matter, another engagement or none, and which services it covers.",
  },
  {
    title: "What the client pays counsel",
    copy: "Retainer, rates, billing terms, expenses, budget or estimate, and any agreed reduced-fee or pro bono scope.",
  },
  {
    title: "Referral or other compensation",
    copy: "If Torque or RampRate would receive any referral, finder's or coordination fee connected to an introduction, we say so in writing before you meet the client. Every such arrangement is reviewed by counsel first.",
  },
];

const standards = [
  {
    title: "Client choice and fit",
    copy: "The client decides whom to meet and retain. We want an honest conversation about experience, conflicts, capacity and approach.",
  },
  {
    title: "Written scope and staffing",
    copy: "The work, exclusions, responsible attorney, team, approvals, and what triggers a scope change.",
  },
  {
    title: "Reasonable retainers and bills",
    copy: "Retainer and billing explained in advance, itemized bills on a predictable cadence, budget changes raised before they surprise anyone.",
  },
  {
    title: "Milestones with owners",
    copy: "Immediate deadlines, deliverables and decision points, who owns each next step, and when the client should expect it.",
  },
  {
    title: "Updates even when payment is unresolved",
    copy: "The client's status stays current. A fee dispute or late payment is raised directly and handled separately, consistent with the engagement and your professional duties.",
  },
  {
    title: "Problems reported early",
    copy: "If timing, staffing, budget or performance is at risk, tell the client promptly and bring a proposed fix, never a surprise after the deadline.",
  },
  {
    title: "Respectful, direct communication",
    copy: "Agreed channels, response windows, escalation contacts and a regular status rhythm. Candor with the client and, when authorized, with Torque on operational issues.",
  },
  {
    title: "Confidentiality and privilege",
    copy: "Client-approved secure channels. If you believe a Kovel letter or another privilege protocol is appropriate, we work within the written arrangement you approve. You decide its scope. No label alone guarantees privilege.",
  },
  {
    title: "Independent counsel, informed client",
    copy: "You control the legal work. The client controls the decisions reserved to the client. Torque coordinates only within the client's authorization.",
  },
  {
    title: "Clean transition when needed",
    copy: "If the client changes counsel or the fit is not working, raise it early and arrange an orderly transfer of the file, deadlines and status, subject to your duties.",
  },
];

const cases = [
  {
    number: "01",
    category: "Family law",
    title: "Urgent case, no counsel yet",
    copy: "Someone in an active family-law matter is unsure about filings, deadlines and sensitive financial records. Torque helps organize the papers, timeline and open questions, then makes a prompt introduction. Counsel verifies the record, advises the client and decides what legal action fits.",
  },
  {
    number: "02",
    category: "Founder or executive",
    title: "Ownership or role under pressure",
    copy: "A founder or executive faces a dispute over equity, control, compensation or separation. Torque brings the business context into focus and connects the client with counsel whose experience may fit.",
  },
  {
    number: "03",
    category: "Commercial or digital assets",
    title: "A contract, payment or asset problem has stalled",
    copy: "A company or individual faces nonperformance, withheld payment, frozen or moved digital assets, or a critical relationship falling apart. Torque assembles the agreement, chronology, asset trail and commercial priorities so counsel can assess options and next steps.",
  },
  {
    number: "04",
    category: "Active litigation",
    title: "A clear view, or a transition",
    copy: "A client needs a reliable status, a better-defined scope or a change of counsel. Torque helps the client organize questions and coordinates a handoff with consent. Incoming counsel independently checks conflicts, capacity and deadlines.",
  },
];

const faqs = [
  {
    q: "Who is the lawyer's client?",
    a: "The person or organization named in the attorney-client engagement agreement. Torque is not a party to that engagement.",
  },
  {
    q: "Can we expect several introductions over time?",
    a: "We hope a strong relationship leads to future introductions when a client's needs match your experience and capacity. We do not guarantee volume, and you remain free to decline any matter.",
  },
  {
    q: 'What does "take one for the team" mean?',
    a: "We may suggest one bounded first matter so both sides learn how they work together. It never means free legal work is assumed. Any paid, reduced-fee or pro bono scope is voluntary, agreed with the client and documented before work begins.",
  },
  {
    q: "Will you tell us whether a client is paid, unpaid or pro bono?",
    a: "Yes. Every introduction states the client's relationship category, whether a Torque fee applies to this matter or another engagement, and the fee structure and services covered. We always disclose our own fees, including any referral or finder's arrangement.",
  },
  {
    q: "Does Torque keep supporting a client it is not paid by?",
    a: "Yes. Our support rests on the relationship and the work we have taken on, not on whether we are paid on the legal matter. We report problems and meaningful changes regardless.",
  },
  {
    q: "What if we want a Kovel letter or another privilege arrangement?",
    a: "Tell us what you believe is needed and when. We are comfortable working within a counsel-directed written protocol and will sign documents you approve. You decide whether the arrangement is appropriate and what it covers. We never assume a communication is privileged because of a label.",
  },
  {
    q: "Who sets legal fees and decides strategy?",
    a: "You and the client agree directly, in writing, on scope and legal fees. You control the legal work and advice. The client chooses counsel and makes the decisions reserved to the client.",
  },
  {
    q: "What if the relationship is not working?",
    a: "Raise it early. The client may decide to change counsel, and everyone should support a prompt, orderly transition that protects deadlines and follows applicable duties.",
  },
];

const reading = [
  {
    title: "Torque overview",
    href: "https://ramprate.com/torque",
    copy: "Our public explanation of the practice and where we draw the line.",
  },
  {
    title: "Five brands, one mission",
    href: "https://ramprate.com/expertise",
    copy: "How Torque fits with RampRate's other practices and shared values.",
  },
  {
    title: "How we work",
    href: "https://ramprate.com/howwework",
    copy: "Single-party mandates, disclosed fee flows and accountability.",
  },
  {
    title: "About RampRate",
    href: "https://ramprate.com/about",
    copy: "The team and the relationship-centered way we operate.",
  },
  {
    title: "Proof",
    href: "https://ramprate.com/proof",
    copy: "Selected work, with the limits of what we claim made explicit.",
  },
  {
    title: "ImpactSoul",
    href: "https://ramprate.com/impactsoul",
    copy: "The impact practice and the mission-driven work around us.",
  },
];

export default async function TorqueCounselPage() {
  const unlocked = await isPortalUnlocked("josh-bykowski");

  if (!unlocked) {
    return (
      <div
        className={`${styles.page} ${fraunces.variable} ${ibmPlexMono.variable}`}
      >
        <PortalGate
          portalId="josh-bykowski"
          title="Torque Counsel Portal"
          subtitle="Private working draft for review by Torque's General Counsel."
          placeholder="Enter access code"
        />
      </div>
    );
  }

  return (
    <div
      className={`${styles.page} ${fraunces.variable} ${ibmPlexMono.variable}`}
    >
      <div className={styles.frame}>
        <div className={styles.topline}>
          <a className={styles.brand} href="https://ramprate.com/torque">
            TORQUE <span>·</span> RAMPRATE
          </a>
          <span className={styles.privateLabel}>
            PRIVATE WORKING DRAFT · INVITATION ONLY
          </span>
        </div>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>
            A working relationship for consequential matters
          </p>
          <h1>
            Your counsel is the center.
            <br />
            <span>Torque is the force that turns the matter.</span>
          </h1>
          <p className={styles.lead}>
            We bring independent attorneys and specialists into high-stakes
            matters, then help the client keep the work organized, visible and
            moving.
          </p>
          <p className={styles.lead}>
            The client chooses counsel. Counsel controls the legal work. We stay
            in the client&apos;s corner.
          </p>
          <div className={styles.promise}>
            <strong>Our support does not depend on our fee.</strong> We keep
            supporting the people we work with whether Torque is paid on this
            matter, paid on another matter, or not paid at all.
          </div>
          <a className={styles.cta} href="#working-standard">
            See our working standard <span aria-hidden="true">↓</span>
          </a>
        </header>

        <div>
          <section className={styles.section} id="why-torque">
            <p className={styles.eyebrow}>Why Torque exists</p>
            <h2>A crisis is a terrible time to manage the handoff.</h2>
            <p className={styles.intro}>
              Someone in a serious dispute can end up chasing counsel,
              rebuilding the facts, guessing at costs and working out the next
              step, all at once.
            </p>
            <div className={styles.prose}>
              <p>
                Torque grew out of RampRate&apos;s work on hard business
                problems where the right people, facts and decisions sat
                scattered across organizations. In a high-stakes dispute, a
                capable lawyer is essential. The client may also need help
                getting the matter organized, understanding the work plan,
                coordinating specialists and staying informed as things change.
              </p>
              <p>
                We bring practical discipline to that gap. We help the client
                find counsel whose experience may fit, prepare for a useful
                first conversation, set clear scope and communication, and keep
                the moving pieces visible. The attorney-client relationship
                stays directly between the client and the lawyer.
              </p>
              <p>
                For attorneys who do excellent work and treat people well,
                Torque is a source of opportunity. A strong first matter can
                become a lasting relationship and may lead to future
                introductions where the fit is right. We do not promise case
                volume, and we never ask counsel to bend independent judgment.
              </p>
            </div>
            <div className={styles.boundaries}>
              <article>
                <h3>Our role: find and coordinate.</h3>
                <p>
                  The right independent professionals around a difficult matter,
                  while the client stays prepared, informed and supported.
                </p>
              </article>
              <article>
                <h3>The boundary: not a law firm.</h3>
                <p>
                  We do not give legal advice, choose legal strategy or replace
                  the lawyer. The client chooses and instructs counsel.
                </p>
              </article>
              <article>
                <h3>The human point: a steady team.</h3>
                <p>
                  People deserve a steady team in their corner when a legal
                  problem is eating their attention and their options.
                </p>
              </article>
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.eyebrow}>Mission, vision and values</p>
            <h2>
              Connect people, ideas and organizations with what they need to
              create outcomes that matter.
            </h2>
            <p className={styles.intro}>
              Torque is one of RampRate&apos;s practices, all built to connect
              people, ideas and organizations with what they need to create
              outcomes that matter.
            </p>
            <div className={styles.mission}>
              <article>
                <h3>Mission</h3>
                <p>
                  Bring trusted people and practical force together to solve
                  hard problems, move a stuck status quo, and create outcomes
                  that change what is possible.
                </p>
              </article>
              <article>
                <h3>Vision</h3>
                <p>
                  No one facing a consequential legal problem should be left
                  alone to chase clarity, capable counsel or a way forward. And
                  the value created should reach people and communities beyond
                  the matter itself.
                </p>
              </article>
            </div>
            <div className={styles.values}>
              {values.map((item, i) => (
                <article key={item.title}>
                  <span className={styles.number}>0{i + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.eyebrow}>A relationship, not a one-off</p>
            <h2>
              Let&apos;s learn how we work together before the hardest day.
            </h2>
            <div className={styles.twoColumn}>
              <article className={styles.panel}>
                <h3>A first matter can be a pilot.</h3>
                <p>
                  We may invite you onto one bounded matter so we can both see
                  how communication, staffing, timelines and client care work in
                  practice. If it goes well, we build a fuller onboarding
                  together and bring future matters to you when your experience
                  fits.
                </p>
                <ul>
                  <li>
                    Participation is voluntary. Nobody assumes counsel will work
                    for free.
                  </li>
                  <li>The client decides whether to meet and retain you.</li>
                  <li>
                    Scope, staffing, timing, retainer and billing are agreed
                    directly with the client, in writing.
                  </li>
                  <li>
                    Any reduced-fee or pro bono legal work is explicit,
                    voluntary, approved by the client and documented before work
                    begins.
                  </li>
                </ul>
              </article>
              <article className={styles.panel}>
                <h3>Think relationship. Keep independence.</h3>
                <p>
                  Think of Torque as a possible repeat source of well-matched
                  client introductions. We ask for the care and candor you would
                  bring to any trusted long-term relationship: treat the client
                  with respect, keep us informed of operational problems when
                  the client authorizes it, and tell us early when something is
                  off track.
                </p>
                <p>
                  The client stays your client. You take legal instructions from
                  the client, use independent professional judgment, and may
                  decline any matter. We will never ask you to put Torque&apos;s
                  commercial interests ahead of the client&apos;s legal
                  interests.
                </p>
              </article>
            </div>
            <aside className={styles.callout}>
              <strong>Onboarding before pressure.</strong> Before anything is
              urgent, we agree on a conflict-check process, secure channels,
              named contacts, response expectations, billing format, status
              cadence, file-transfer steps and the approved limits of any
              information-sharing arrangement.
            </aside>
          </section>

          <section className={styles.section}>
            <p className={styles.eyebrow}>How an introduction works</p>
            <h2>
              Who is involved, who is paid, and what the next decision needs.
            </h2>
            <div className={styles.steps}>
              {steps.map((step, i) => (
                <article key={step.title}>
                  <span className={styles.number}>0{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.eyebrow}>No hidden relationship economics</p>
            <h2>
              Every introduction tells you exactly how Torque is involved.
            </h2>
            <p className={styles.intro}>
              We disclose our relationship with the client and our fee structure
              up front, in writing. Your fee agreement stays directly between
              you and the client.
            </p>
            <div className={styles.feeTable}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">What we disclose</th>
                    <th scope="col">What it means</th>
                  </tr>
                </thead>
                <tbody>
                  {disclosures.map((item) => (
                    <tr key={item.title}>
                      <th scope="row">{item.title}</th>
                      <td>{item.copy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.feeCards}>
                {disclosures.map((item) => (
                  <article key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </article>
                ))}
              </div>
            </div>
            <aside className={styles.callout}>
              <strong>Support never hinges on payment.</strong> A client&apos;s
              Torque status does not change the support we have committed to. We
              surface problems and material changes even when Torque is not paid
              on the legal matter. Billing questions are handled directly and
              kept separate from status reporting.
            </aside>
          </section>

          <section className={styles.section} id="working-standard">
            <p className={styles.eyebrow}>The working standard</p>
            <h2>Ten things to agree before the clock starts.</h2>
            <p className={styles.intro}>
              Practical expectations for a strong relationship, tailored to each
              matter and to the client&apos;s written engagement with you.
            </p>
            <ol className={styles.standards}>
              {standards.map((item, i) => (
                <li key={item.title}>
                  <span className={styles.number}>0{i + 1}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
            <aside className={styles.callout}>
              <strong>We do this for people and for impact.</strong> Sometimes
              the person or organization we support is mission-driven, short on
              money, or facing an unusually consequential moment. We will always
              be clear whether our work is paid, unpaid or pro bono, and we ask
              you to help make the best responsible path visible without
              confusing our role with the client&apos;s legal representation.
            </aside>
          </section>

          <section className={styles.section}>
            <p className={styles.eyebrow}>Four use cases</p>
            <h2>Illustrations only. One standard of care.</h2>
            <p className={styles.intro}>
              None implies a promised result, an existing engagement or a view
              on legal strategy.
            </p>
            <div className={styles.cases}>
              {cases.map((item) => (
                <article key={item.number}>
                  <span className={styles.caseLabel}>
                    {item.number} · {item.category}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section} id="faq">
            <p className={styles.eyebrow}>Short FAQ</p>
            <h2>Good questions are part of a good handoff.</h2>
            <div className={styles.faq}>
              {faqs.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.eyebrow}>Connected reading</p>
            <h2>Follow the thread.</h2>
            <div className={styles.reading}>
              {reading.map((item) => (
                <a
                  href={item.href}
                  key={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <strong>{item.title}</strong>
                  <span>{item.copy}</span>
                </a>
              ))}
            </div>
          </section>
        </div>

        <footer className={styles.footer}>
          <h2>
            Good counsel. Clear terms. A client who knows they are not alone.
          </h2>
          <a
            className={styles.cta}
            href="mailto:t@ramprate.com?subject=Torque%20counsel%20partnership"
          >
            Start a conversation
          </a>
          <p>
            Torque is a RampRate practice. We are not a law firm and do not
            provide legal advice. RampRate is B Lab certified.
          </p>
          <div className={styles.footerLinks}>
            <a href="https://ramprate.com/privacy">Privacy</a>
            <a href="https://ramprate.com/terms">Terms</a>
            <a href="https://ramprate.com/torque">Torque</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
