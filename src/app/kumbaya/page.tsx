import type { Metadata } from "next";
import { ArrowUpRight, HeartHandshake, Network, Sparkles } from "lucide-react";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";
import KumbayaIntakeForm from "@/components/kumbaya/KumbayaIntakeForm";

export const metadata: Metadata = {
  title: "Kumbaya | The Shared Upside Protocol",
  description:
    "Share an event, company, cause, or story with RampRate and ImpactSol to explore useful relationships, distribution, and shared upside.",
  alternates: { canonical: "/kumbaya" },
};

const doors = [
  {
    icon: Network,
    eyebrow: "Bring leverage",
    title: "The right sponsor.",
    copy: "We look at audience, inventory, investment level, and sponsor fit.",
  },
  {
    icon: HeartHandshake,
    eyebrow: "Bring people",
    title: "The right room.",
    copy: "We look at who is attending, why they matter, and which introductions are appropriate.",
  },
  {
    icon: ArrowUpRight,
    eyebrow: "Bring a voice",
    title: "A speaker or story.",
    copy: "We look at the invitation, preparation, audience, and whether the opportunity fits a portfolio theme.",
  },
  {
    icon: Sparkles,
    eyebrow: "Bring purpose",
    title: "Community support.",
    copy: "We consider ImpactSol, philanthropy, charitable support, and mission-aligned partners.",
  },
];

const intentions = [
  {
    label: "RampRate mission",
    title: "Turn trust into useful leverage.",
    copy: "Help founders, enterprises, and partners make better decisions, find the right relationships, reduce waste, and turn hard-to-navigate systems into workable progress.",
  },
  {
    label: "ImpactSol mission",
    title: "Make purpose economically durable.",
    copy: "Help missions, cultural assets, environmental stewardship, and communities become more visible, fundable, and capable of sustaining their work.",
  },
  {
    label: "Vision",
    title: "A more connected form of abundance.",
    copy: "Capital, technology, health, culture, and human possibility should reinforce one another instead of extracting value from the people and places they claim to serve.",
  },
  {
    label: "Values",
    title: "Evidence. Alignment. Access. Care.",
    copy: "We look for real fit, honest terms, inclusive access, measurable usefulness, responsible stewardship, and relationships that become stronger because we were involved.",
  },
];

export default function KumbayaPage() {
  return (
    <main className="kumbaya-page min-h-screen overflow-hidden pb-24 pt-28 sm:pt-36">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Kumbaya", url: "https://ramprate.com/kumbaya" },
        ])}
      />

      <section className="kumbaya-hero border-b border-[#07111f]/10 pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="kumbaya-kicker">
            The Shared Upside Protocol · RampRate × ImpactSol
          </p>
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.75fr)] lg:items-end">
            <div>
              <h1 className="max-w-5xl font-display text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-[#07111f] sm:text-6xl lg:text-7xl">
                Make the room worth more than its agenda.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-relaxed text-[#415169] sm:text-xl">
                Kumbaya is a shared-upside intake for an event, company, cause,
                or story. One precise brief helps RampRate and ImpactSol assess
                where people, capital, distribution, and a useful introduction
                could change the outcome for everyone involved.
              </p>
            </div>
            <aside className="kumbaya-hero-note">
              <p className="font-display text-2xl font-bold leading-tight text-[#07111f]">
                A better kind of yes.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#526278]">
                Shared upside. Real participation. No logo confetti. We will be
                direct about fit, timing, and whether our involvement can create
                meaningful progress.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <p className="kumbaya-kicker">Choose the kind of door</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.03em] text-[#07111f] sm:text-5xl">
            This is not a logo request.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#526278]">
            It is a practical way to design the most useful relationship around
            an opportunity.
          </p>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {doors.map((door) => {
            const Icon = door.icon;
            return (
              <article key={door.eyebrow} className="kumbaya-door-card">
                <Icon className="h-5 w-5 text-[#9a7112]" aria-hidden="true" />
                <p className="kumbaya-door-kicker">{door.eyebrow}</p>
                <h3 className="mt-4 font-display text-2xl font-bold text-[#07111f]">
                  {door.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#526278]">
                  {door.copy}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="kumbaya-purpose-section py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(20rem,0.8fr)] lg:items-start">
          <div>
            <p className="kumbaya-kicker text-gold">Why we enter a room</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Purpose before presence.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/72 sm:text-lg">
              RampRate and ImpactSol use an evidence-led view of fit: useful
              access, honest terms, responsible stewardship, and relationships
              that become stronger because we were involved.
            </p>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/68">
              RampRate A Team, Inc. is B Lab Certified for social and
              environmental performance, accountability, and transparency.
            </p>
            <a
              href="https://www.bcorporation.net/en-us/find-a-b-corp/company/ramp-rate-a-team-inc/"
              target="_blank"
              rel="noreferrer"
              className="kumbaya-reference-link"
            >
              View RampRate in B Lab&apos;s public directory
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="kumbaya-purpose-card">
            <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] text-gold">
              What comes back
            </p>
            <h3 className="mt-3 font-display text-3xl font-bold text-white">
              A usable awareness brief.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/68">
              We turn the useful details into an internal fit card and an event
              overview that can clarify sponsor, speaker, community, and
              distribution decisions—whether or not we participate.
            </p>
            <a
              href="https://sproutsocial.com/"
              target="_blank"
              rel="noreferrer"
              className="kumbaya-reference-link"
            >
              Learn about distribution tracking with Sprout Social
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="kumbaya-intentions-section py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="kumbaya-kicker">What guides the fit</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.03em] text-[#07111f] sm:text-5xl">
              A shared definition of useful.
            </h2>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[#07111f]/10 bg-[#07111f]/10 md:grid-cols-2">
            {intentions.map((intention) => (
              <article
                key={intention.label}
                className="bg-[#f8f5ec] p-6 sm:p-8"
              >
                <p className="kumbaya-kicker">{intention.label}</p>
                <h3 className="mt-4 font-display text-2xl font-bold text-[#07111f] sm:text-3xl">
                  {intention.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#526278]">
                  {intention.copy}
                </p>
              </article>
            ))}
          </div>
          <div className="kumbaya-event-fit">
            <p className="kumbaya-kicker">What this means for an event</p>
            <p>
              We may participate when the room can create meaningful progress
              for a company, cause, community, or relationship. We may decline
              when there is no real fit, permission, or responsible way for our
              time, relationships, and reputation to help.
            </p>
          </div>
        </div>
      </section>

      <section className="kumbaya-signal-section py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(20rem,1.18fr)]">
          <div>
            <p className="kumbaya-kicker text-gold">From idea to signal</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">
              A living impact network.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-white/70">
              Where appropriate, a clear story can move through the relevant
              channels, partners, and distribution network. The goal is useful
              follow-through—not a database graveyard.
            </p>
          </div>
          <aside className="kumbaya-example-card">
            <p className="kumbaya-kicker text-gold">Example output</p>
            <h3 className="mt-4 font-display text-3xl font-bold leading-tight text-white">
              A room where regenerative health becomes investable.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/68">
              A focused gathering can connect clinicians, founders, investors,
              and community leaders with mission-aligned sponsors, a clear
              pre-event story, and a post-event trail that keeps the useful
              conversations moving.
            </p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <p className="kumbaya-kicker">One portfolio-wide form</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.03em] text-[#07111f] sm:text-5xl">
            Tell us what could move further.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#526278]">
            Give us the useful version. This takes about six to eight minutes,
            and every submission is stored for RampRate&apos;s review.
          </p>
        </div>
        <div className="kumbaya-form-shell mt-10">
          <KumbayaIntakeForm />
        </div>
      </section>
    </main>
  );
}
