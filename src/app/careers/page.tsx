import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Careers | RampRate - Work With Principals, Not Layers",
  description:
    "25 years. 250+ global brands. One senior team. No staffing pyramid. No middlemen. Just principals executing end-to-end. Join the coalition.",
  keywords: ["RampRate careers", "advisory firm jobs", "IT sourcing careers"],
  alternates: { canonical: "https://ramprate.com/careers" },
  openGraph: {
    title: "Careers | RampRate - Work With Principals, Not Layers",
    description:
      "No junior layers. No account managers. You work directly with 25-year veterans and Fortune 100 principals.",
    type: "website",
    url: "https://ramprate.com/careers",
    siteName: "RampRate",
  },
};

/* ─── Arrow icon shared across CTAs ─────────── */
const Arrow = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const whyCards = [
  {
    emoji: "⚡",
    title: "No Junior Layers",
    body: "You work directly with 25-year veterans and Fortune 100 principals. No staffing pyramid. No account managers between you and the outcome.",
    tag: "SAME SENIOR TEAM, ALWAYS",
  },
  {
    emoji: "🎯",
    title: "Skin in the Game",
    body: "Our compensation is aligned to the value we create. We don't advise from the sidelines - we execute end-to-end. Your win is our win.",
    tag: "300%+ ROI OR DON'T PAY",
  },
  {
    emoji: "🌐",
    title: "Real Global Impact",
    body: "B Corp Certified from the start. We operate across 50+ countries with NGOs, enterprises, startups, and impact-driven founders reshaping the world.",
    tag: "50+ COUNTRIES · B CORP",
  },
  {
    emoji: "🔧",
    title: "Five Practices, One Coalition",
    body: "Work across enterprise IT sourcing, founder growth, Web3 advisory, impact consulting, and executive advisory - or go deep in your domain. The team shares everything.",
    tag: "SOURCING · SYZYGY · STRATUM · IMPACTSOUL · PRIVATE ADVISORY",
  },
  {
    emoji: "💡",
    title: "Fix the Signal First",
    body: "Our process starts before the solution - with finding the real problem, not the symptom. You'll be trained to diagnose before prescribing.",
    tag: "FIX THE SIGNAL, CLOSE THE DEAL.",
  },
  {
    emoji: "📊",
    title: "150K+ Data Points",
    body: "Our proprietary SPY Index carries 25 years of real market intelligence. You'll make decisions others can only guess at - with data few in the world possess.",
    tag: "$10B+ IN DECISIONS BROKERED",
  },
];

const compareRows = [
  {
    dimension: "Who does the work",
    theRest:
      "Junior layers handle client work. Seniors are rarely client-facing.",
    ramprate:
      "Same senior team - 25 years - directly client-facing, every engagement.",
  },
  {
    dimension: "How success is measured",
    theRest:
      "Bills time regardless of outcome. Takes margin with no accountability.",
    ramprate:
      "Compensation aligned to value created. 300%+ ROI or you don't pay.",
  },
  {
    dimension: "Accuracy of forecasts",
    theRest: "Estimates run 30–40% over. Or no forecasts at all.",
    ramprate:
      "Forecasts within 5–10% - backed by 25 years of real market data.",
  },
  {
    dimension: "Scope of execution",
    theRest: "Strategy without execution, or execution without strategy.",
    ramprate: "End-to-end: diagnose → activate → close. Nothing handed off.",
  },
  {
    dimension: "Impact & ethics",
    theRest: "Impact treated as an afterthought or a PR exercise.",
    ramprate: "B Corp certified - impact is in our DNA",
  },
];

/* ─── Shared class tokens ───────────────────── */
const sectionLabel =
  "[font-family:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.22em]";
const h2Size = "text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight";
const h3Size = "text-xl font-bold leading-snug";
const bodyText = "text-sm leading-relaxed";

export default function CareersPage() {
  return (
    <div>
      <section className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20 bg-(--dark)">
        <div className="glass-orb glass-orb-amber absolute w-[560px] h-[560px] -top-40 -right-40 opacity-20 pointer-events-none" />
        <div className="glass-orb glass-orb-blue  absolute w-[380px] h-[380px] -bottom-20 -left-24 opacity-10 pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-7">
            <p
              className={`${sectionLabel} inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/4 text-white/60 whitespace-nowrap`}
            >
              <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-(--gold)" />
              <span className="sm:hidden">B Corp Certified · Careers</span>
              <span className="hidden sm:inline">
                B Corp Certified &nbsp;·&nbsp; Careers at RampRate
              </span>
            </p>
          </div>

          <h1 className="font-bold text-white leading-[1.04] mb-6 text-[clamp(2.8rem,7vw,6rem)] max-w-[700px]">
            Work With
            <br />
            Principals.
            <br />
            <span className="text-(--gold)">Not Layers.</span>
          </h1>

          <p className="mb-9 leading-relaxed text-white/60 text-[clamp(0.93rem,1.8vw,1.08rem)] max-w-[520px]">
            25 years. 250+ global brands. One senior team that&rsquo;s been here
            since the beginning. No staffing pyramid. No middlemen. Just
            principals - executing end-to-end.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-14">
            <a
              href="#openings"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md font-semibold text-sm bg-(--gold) text-(--dark) transition-opacity hover:opacity-90 w-full sm:w-auto"
            >
              View Openings <Arrow />
            </a>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md font-semibold text-sm bg-white/8 border border-white/20 text-white/80 transition-opacity hover:opacity-80 w-full sm:w-auto"
            >
              About RampRate
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-row sm:flex-wrap gap-y-3 gap-x-0 sm:gap-x-0 sm:items-center">
            {[
              "25 Years",
              "$10B+ in Decisions",
              "50+ Countries",
              "B Corp Certified",
            ].map((stat, i, arr) => (
              <span key={stat} className="flex items-center gap-3 sm:gap-5">
                <span className="w-1 h-1 shrink-0 rounded-full bg-(--gold) opacity-60" />
                <span className={`${sectionLabel} text-white/30`}>{stat}</span>
                {i < arr.length - 1 && (
                  <span className="hidden sm:inline text-white/10 text-[10px] ml-2">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="section-warm py-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <div>
            <p className={`${sectionLabel} text-(--rust) mb-4`}>
              About RampRate
            </p>
            <h2 className={`${h2Size} text-(--text-dark) mb-0`}>
              Impact and Technology-Focused Advisory for{" "}
              <em className="text-(--gold) not-italic">
                Enterprise &amp; Startups.
              </em>
            </h2>
          </div>

          <div className="space-y-5">
            <p className={`${bodyText} text-(--text-mid)`}>
              RampRate is a global advisory firm founded in 2000 on the premise
              of elevating the way business does business. Private, self-funded,
              and profitable since birth - we&rsquo;ve never needed to
              compromise on who we hire or how we work.
            </p>
            <p className={`${bodyText} text-(--text-mid)`}>
              We find the next unicorns and gatekeepers to impact. We understand
              their vision, put them through bootcamp, then kick down the
              barriers to success by connecting them with our ecosystem and the
              trust we&rsquo;ve built in the Fortune 1000 across 25 years.
            </p>
            <p className={`${bodyText} font-semibold text-(--text-dark)`}>
              The purpose-driven economy is here. Its leaders will be powered by
              RampRate.{" "}
              <span className="font-normal text-(--text-mid)">
                If that mission speaks to you - you belong here.
              </span>
            </p>
            <blockquote className="pl-5 border-l-[3px] border-(--rust) italic text-(--text-mid) text-sm leading-relaxed">
              &ldquo;You work with principals. The people on our client
              testimonials are the people who will work alongside you every
              single day.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>
      <section className="py-20 bg-[oklch(0.13_0.01_250)]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className={`${sectionLabel} text-(--gold) mb-4`}>Why RampRate</p>
            <h2 className={`${h2Size} text-white mb-3`}>
              Work That <span className="text-(--gold)">Actually Moves</span>{" "}
              the Needle.
            </h2>
            <p className="max-w-lg mx-auto text-sm leading-relaxed text-white/45">
              Each practice is purpose-built for a distinct audience - but they
              share the same team of superstars behind the scenes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyCards.map((card) => (
              <div
                key={card.title}
                className="glass-card p-7 flex flex-col gap-4"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-white/[0.05] border border-white/8">
                  {card.emoji}
                </div>
                <div>
                  <h3
                    className={`${h3Size} [font-family:var(--font-body)]! text-white mb-2`}
                  >
                    {card.title}
                  </h3>
                  <p className={`${bodyText} text-white/50`}>{card.body}</p>
                </div>
                <p className="[font-family:var(--font-body)]! text-[10px] font-bold uppercase tracking-[0.14em] text-(--gold) mt-auto pt-3 border-t border-white/6">
                  {card.tag}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-warm py-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className={`${sectionLabel} text-(--rust) mb-4`}>
              Why We&rsquo;re Different
            </p>
            <h2 className={`${h2Size} text-(--text-dark) mb-3`}>
              Not a Consulting Firm.
              <br />
              Not an Agency.
            </h2>
            <p className="max-w-md mx-auto text-sm leading-relaxed text-(--text-mid)">
              Working at RampRate is unlike any advisory role you&rsquo;ve held.
              Here&rsquo;s what that actually means for your day-to-day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="rounded-2xl border border-[rgba(42,31,20,0.1)] bg-white/35 overflow-hidden flex flex-col">
              <div className="px-7 py-6 border-b border-[rgba(42,31,20,0.08)] bg-[rgba(42,31,20,0.04)]">
                <p className={`${sectionLabel} text-(--text-mid) mb-2`}>
                  The Industry
                </p>
                <p className="text-base font-semibold text-(--text-dark)">
                  Typical employers &amp; agencies
                </p>
                <p className="text-xs text-(--text-mid) mt-1 leading-relaxed">
                  Consulting firms, staffing pyramids, margin-takers
                </p>
              </div>
              <ul className="px-7 py-6 space-y-5 flex-1">
                {compareRows.map((row, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                      <span className="text-red-400 text-[11px] font-bold leading-none">
                        ✕
                      </span>
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-(--text-mid) opacity-60 mb-0.5">
                        {row.dimension}
                      </p>
                      <p className="text-sm leading-relaxed text-(--text-mid)">
                        {row.theRest}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border-2 border-(--gold) bg-white/70 overflow-hidden flex flex-col shadow-[0_12px_48px_rgba(212,168,67,0.16)]">
              <div className="px-7 py-6 border-b border-(--gold)/25 bg-(--gold)/6">
                <p className={`${sectionLabel} text-(--rust) mb-2`}>RampRate</p>
                <p className="text-base font-semibold text-(--text-dark)">
                  A different operating model
                </p>
                <p className="text-xs text-(--text-mid) mt-1 leading-relaxed">
                  25 years. B Corp. No layers. Outcomes only.
                </p>
              </div>
              <ul className="px-7 py-6 space-y-5 flex-1">
                {compareRows.map((row, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                      <span className="text-green-600 text-[11px] font-bold leading-none">
                        ✓
                      </span>
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-(--rust) opacity-70 mb-0.5">
                        {row.dimension}
                      </p>
                      <p className="text-sm leading-relaxed font-semibold text-(--text-dark)">
                        {row.ramprate}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-center mt-10 max-w-xl mx-auto text-sm leading-relaxed text-(--text-mid)">
            You work with principals. No junior layering. No staffing pyramid.
            <br />
            <span className="font-semibold text-(--text-dark)">
              The people on the testimonials are the people who will mentor you.
            </span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <a
              href="#openings"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md font-semibold text-sm bg-(--gold) text-white transition-opacity hover:opacity-90 w-full sm:w-auto"
            >
              See Open Roles <Arrow />
            </a>
            <Link
              href="/process"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md font-semibold text-sm border border-[rgba(42,31,20,0.25)] text-(--text-dark) transition-opacity hover:opacity-80 w-full sm:w-auto"
            >
              Our Process <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section id="openings" className="py-20 bg-(--dark)">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className={`${sectionLabel} text-(--gold) mb-4`}>
              Join the Coalition
            </p>
            <h2 className={`${h2Size} text-white mb-2`}>Our Openings</h2>
            <p className={`${sectionLabel} text-white/30`}>0 Open Positions</p>
          </div>

          <div className="glass-card p-7 sm:p-14 text-center">
            <h3 className={`${h3Size} text-white mb-3`}>
              No open roles right now.
            </h3>
            <p className="text-sm leading-relaxed max-w-sm mx-auto mb-8 text-white/45">
              We hire slowly and deliberately. When the right role opens,
              it&rsquo;s listed here. Check back - or start a conversation
              directly.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md font-semibold text-sm bg-(--gold) text-(--dark) transition-opacity hover:opacity-90 w-full sm:w-auto"
            >
              Start a Conversation <Arrow />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            <span className="text-xs text-white/30 tracking-wide">
              Powered by
            </span>
            <a
              href="https://www.manatal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 opacity-50 hover:opacity-80 transition-opacity"
              aria-label="Manatal ATS"
            >
              <svg
                width="82"
                height="18"
                viewBox="0 0 82 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect width="16" height="16" rx="4" y="1" fill="#6C47FF" />
                <path
                  d="M4.5 12.5V5.5L8 10l3.5-4.5V12.5"
                  stroke="#fff"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <text
                  x="20"
                  y="13.5"
                  fontFamily="system-ui, sans-serif"
                  fontSize="11"
                  fontWeight="700"
                  fill="#ffffff"
                  letterSpacing="0.3"
                >
                  Manatal
                </text>
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section className="section-warm py-20">
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className={`${sectionLabel} text-(--rust) mb-4`}>
            Don&rsquo;t See Your Role?
          </p>
          <h2 className={`${h2Size} text-(--text-dark) mb-5`}>
            Tell Us What
            <br />
            <em className="text-(--gold) not-italic">You&rsquo;d Fix.</em>
          </h2>
          <p className="text-sm leading-relaxed mb-10 text-(--text-mid)">
            We&rsquo;ve built RampRate on people who see broken things and
            can&rsquo;t walk away. If that&rsquo;s you, we want to hear from you
            - open role or not.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md font-semibold text-sm bg-(--gold) text-white transition-opacity hover:opacity-90 w-full sm:w-auto"
            >
              Tell Us What&rsquo;s Broken <Arrow />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md font-semibold text-sm border border-[rgba(42,31,20,0.25)] text-(--text-dark) transition-opacity hover:opacity-80 w-full sm:w-auto"
            >
              Learn About RampRate <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
