import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { client } from "@/lib/content/client";
import {
  teamMembersQuery,
  boardAdvisorsQuery,
  siteSettingsQuery,
} from "@/lib/content/queries";
import { urlFor } from "@/lib/content/image";
import { getPageSeo, withSeoOverrides } from "@/lib/content/seo";
import JsonLd, {
  breadcrumbJsonLd,
  personJsonLd,
} from "@/components/shared/JsonLd";

const FALLBACK_METADATA: Metadata = {
  title: "About",
  description:
    "RampRate is a global advisory firm founded in 2000. Impact and technology-focused advisor for enterprise and startups.",
  keywords: [
    "RampRate team",
    "board of advisors",
    "B Lab certified advisory",
    "enterprise advisory firm history",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About",
    description:
      "RampRate is a global advisory firm founded in 2000. Impact and technology-focused advisor for enterprise and startups.",
    url: "https://ramprate.com/about",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About",
    description:
      "RampRate is a global advisory firm founded in 2000. Impact and technology-focused advisor for enterprise and startups.",
    images: ["/og.png"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageSeo("/about");
  return withSeoOverrides(FALLBACK_METADATA, data?.seo);
}

const LinkedInIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default async function AboutPage() {
  const [sanityTeam, sanityAdvisors, siteSettings] = await Promise.all([
    client.fetch(teamMembersQuery),
    client.fetch(boardAdvisorsQuery),
    client.fetch(siteSettingsQuery),
  ]);

  const displayTeam = (sanityTeam ?? []).map(
    (m: {
      name: string;
      slug?: { current: string } | null;
      role: string;
      bio: string;
      photo: { asset: { _ref: string } } | null;
      linkedin: string | null;
      twitter: string | null;
    }) => ({
      name: m.name,
      slug: m.slug?.current ?? null,
      role: m.role,
      bio: m.bio,
      img: m.photo
        ? urlFor(m.photo).width(600).height(450).fit("crop").crop("top").url()
        : null,
      linkedin: m.linkedin,
      twitter: m.twitter ?? null,
    }),
  );

  const displayAdvisors: {
    name: string;
    role: string;
    img: string | null;
    bio: string;
    whyAdvise: string | null;
    linkedin: string | null;
    twitter: string | null;
  }[] = (sanityAdvisors ?? []).map(
    (m: {
      name: string;
      role: string;
      bio: string;
      whyAdvise: string | null;
      photo: { asset: { _ref: string } } | null;
      linkedin: string | null;
      twitter: string | null;
    }) => ({
      name: m.name,
      role: m.role,
      bio: m.bio,
      img: m.photo
        ? urlFor(m.photo).width(500).height(500).fit("crop").url()
        : null,
      whyAdvise: m.whyAdvise ?? null,
      linkedin: m.linkedin ?? null,
      twitter: m.twitter ?? null,
    }),
  );

  const values: string[] = siteSettings?.companyValues ?? [];
  const timeline: { year: string; event: string }[] =
    siteSettings?.timeline ?? [];
  const corporateFacts: { label: string; value: string }[] =
    siteSettings?.corporateFacts ?? [];

  return (
    <main className="rr-about">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "About", url: "https://ramprate.com/about" },
        ])}
      />
      {displayTeam.map(
        (m: {
          name: string;
          slug: string | null;
          role: string;
          bio: string;
          img: string | null;
        }) =>
          m.slug ? (
            <JsonLd
              key={m.slug}
              data={personJsonLd({
                name: m.name,
                jobTitle: m.role,
                description: m.bio,
                image: m.img ?? undefined,
                url: `https://ramprate.com/about#${m.slug}`,
              })}
            />
          ) : null,
      )}
      {/* ═══ HERO ═══ */}
      <section className="rr-public-surface relative overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-36">
        <div className="rr-about-orb rr-about-orb-primary absolute right-0 top-0 h-125 w-125 rounded-full pointer-events-none" />
        <div className="rr-about-orb rr-about-orb-gold absolute bottom-0 left-0 h-75 w-75 rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/55">
              About RampRate
            </span>
          </div>

          <h1 className="max-w-4xl font-display text-4xl font-bold leading-[0.98] tracking-[-0.025em] text-white sm:text-5xl md:text-6xl">
            Impact and Technology-Focused Advisor for{" "}
            <span className="text-gold">Enterprise & Startups</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/72 sm:text-lg">
            RampRate is a global advisory firm focused on the most impactful,
            positive opportunities in tech and wellness. Founded in 2000.
            Private &amp; self-funded. Profitable since birth.
          </p>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
            {[
              { value: "2000", label: "Founded" },
              { value: "$10B+", label: "Decisions Transacted" },
              { value: "50+", label: "Countries" },
              {
                value: "B Lab",
                label: "Certified",
                href: "https://www.bcorporation.net/en-us/find-a-b-corp/company/ramp-rate-a-team-inc/",
              },
            ].map((s) => {
              const content = (
                <>
                  <div className="font-mono text-2xl font-bold text-gold sm:text-3xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-white/48">
                    {s.label}
                  </div>
                </>
              );
              return s.href ? (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block hover:opacity-80 transition-opacity"
                >
                  {content}
                </a>
              ) : (
                <div key={s.label}>{content}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FOUNDER'S STORY ═══ */}
      <section className="rr-about-founder relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="rr-about-orb rr-about-orb--deep absolute -bottom-32 -right-32 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none" />
        <div className="rr-about-orb rr-about-orb--gold absolute top-10 -left-20 w-[180px] h-[180px] rounded-full opacity-15 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8">
          <span className="rr-about-kicker text-xs font-semibold tracking-[0.2em] uppercase">
            Founder&apos;s Story
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
            Elevating the Way Business Does Business
          </h2>
          <div className="rr-about-body mt-8 space-y-5 text-base leading-relaxed">
            <p>
              Hi, We&apos;re Tony and Alex, we founded RampRate in 2000 on the
              premise of elevating the way business does business. We could take
              the same connections that allowed us to cut 24% of each IT budget
              we touched and use them to kick down the barriers for tech
              innovators. We could take the same business planning rigor that we
              used to guide Sony, McKinsey, Microsoft or Intel on entering new
              markets and use it to help impact-driven startups reach their
              potential.
            </p>
            <p>
              So that&apos;s what we&apos;re doing today - we find the next
              unicorns and gatekeepers to impact that will not just earn
              millions yet better millions of lives. We grok their vision while
              putting them through bootcamp to be ready for life-changing
              opportunities. And then we kick down the barriers to their success
              by connecting them with our ecosystem and leveraging the trust
              we&apos;ve built in the Fortune 1000 over 20 plus years to create
              opportunities few others can access.
            </p>
            <p>
              The purpose driven economy is here. And its leaders, in one way or
              another, will be powered by RampRate.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ PRINCIPALS, NOT PYRAMIDS ═══ */}
      <section className="rr-about-principals py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <span className="rr-about-kicker rr-about-kicker--light text-xs font-semibold tracking-[0.2em] uppercase">
            Our Structure
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Principals, Not Pyramids.
          </h2>
          <p className="rr-about-body rr-about-body--light mt-6 max-w-3xl text-base leading-relaxed sm:text-lg">
            Every engagement is led by the same senior team that has been
            serving Fortune 500 companies for 25 years. No junior associates. No
            handoff to unknown delivery teams. The people whose names are on the
            testimonials are the people who serve you.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {[
              { value: "25", label: "Years, same team" },
              { value: "0", label: "Junior layers" },
              { value: "100%", label: "Principal-led" },
            ].map((s) => (
              <div
                key={s.label}
                className="rr-about-stat rounded-lg border px-6 py-4"
              >
                <div className="rr-about-stat-value text-2xl font-bold">
                  {s.value}
                </div>
                <div className="rr-about-stat-label mt-1 text-xs">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CORPORATE FACTS ═══ */}
      <section className="relative section-light overflow-hidden py-16 sm:py-20">
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
            Corporate <span className="rr-about-highlight">Facts</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {corporateFacts.map((f) => (
              <div
                key={f.label}
                className="bg-white rounded-lg p-5 border border-black/5"
              >
                <div className="rr-about-label mb-1 text-xs font-semibold tracking-[0.15em] uppercase">
                  {f.label}
                </div>
                <div className="rr-about-body text-sm">{f.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-5 bg-white rounded-lg border border-black/5">
            <div className="rr-about-label mb-2 text-xs font-semibold tracking-[0.15em] uppercase">
              Areas of Expertise
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Social Impact (measurement, supply chain, finance)",
                "IT Infrastructure (hosting, networks, cloud, telecom, support)",
                "Strategic Research (primary research, data models, product planning)",
                "Digital Media (live events, CDN, licensing)",
                "Blockchain (mining, proof of stake, tokenomics)",
                "Health & Wellness Innovation",
              ].map((a) => (
                <span
                  key={a}
                  className="rr-about-chip rounded-full px-3 py-1 text-xs"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/process"
              className="rr-about-primary-link inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-xs font-bold text-white transition-all hover:opacity-90"
            >
              Flow Circuit Assessment
            </Link>
            <Link
              href="/process"
              className="rr-about-secondary-link inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-xs font-bold transition-all hover:opacity-90"
            >
              Find Your Me / Way / Our
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <section
        id="journey"
        className="rr-public-surface relative overflow-hidden py-20 sm:py-28"
      >
        <div className="rr-about-orb rr-about-orb--deep absolute -top-40 -right-40 w-[350px] h-[350px] rounded-full opacity-20 pointer-events-none" />
        <div className="rr-about-orb rr-about-orb--gold absolute bottom-20 -left-20 w-[200px] h-[200px] rounded-full opacity-15 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8">
          <h2 className="mb-12 text-3xl font-bold text-white sm:text-4xl">
            Our <span className="rr-about-highlight">Journey</span>
          </h2>
          <div className="space-y-0">
            {timeline.map((t) => (
              <div
                key={t.year}
                className="flex gap-3 sm:gap-6 py-5 border-b border-white/10 last:border-0"
              >
                <div className="rr-about-stat-value w-14 shrink-0 text-xl font-bold sm:w-16 sm:text-2xl">
                  {t.year}
                </div>
                <p className="rr-about-body rr-about-body--light pt-1 text-sm leading-relaxed">
                  {t.event}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CORE TEAM ═══ */}
      <section className="relative section-light overflow-hidden py-20 sm:py-28">
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Core <span className="rr-about-highlight">Team</span>
          </h2>
          <p className="rr-about-body mb-12 max-w-2xl text-base">
            We deploy time-dependent configurations. Principals stay. Advisors
            guide. Specialists rotate.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(
              displayTeam as {
                name: string;
                slug: string | null;
                role: string;
                bio: string;
                img: string | null;
                linkedin: string | null;
                twitter: string | null;
              }[]
            ).map((m) => (
              <div
                key={m.name}
                id={m.slug ?? undefined}
                className="bg-white rounded-xl overflow-hidden border border-black/5 shadow-sm flex flex-col scroll-mt-24"
              >
                {m.img ? (
                  <div className="rr-about-profile-image relative w-full overflow-hidden">
                    <Image
                      src={m.img}
                      alt={m.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="rr-about-profile-image flex w-full items-center justify-center overflow-hidden">
                    <span className="rr-about-profile-initial text-5xl font-bold">
                      {m.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-bold">
                        {m.name}
                      </h3>
                      <p className="rr-about-label mt-1 text-xs font-semibold tracking-wide uppercase">
                        {m.role}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0 mt-1">
                      {m.linkedin && (
                        <a
                          href={m.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rr-about-social flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                        >
                          <LinkedInIcon />
                        </a>
                      )}
                      {m.twitter && (
                        <a
                          href={m.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rr-about-social flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                        >
                          <TwitterIcon />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="rr-about-body mt-3 flex-1 text-sm leading-relaxed">
                    {m.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOARD OF ADVISORS ═══ */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div
          className="absolute -bottom-32 -right-32 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "oklch(0.55 0.15 30)", filter: "blur(80px)" }}
        />
        <div
          className="absolute top-10 -left-20 w-[180px] h-[180px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "oklch(0.82 0.15 75)", filter: "blur(80px)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className="mb-12 text-3xl font-bold tracking-tight sm:text-4xl">
            Board of <span className="rr-about-highlight">Advisors</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayAdvisors.map((m) => (
              <div
                key={m.name}
                className="bg-white rounded-xl overflow-hidden border border-black/5"
              >
                {m.img ? (
                  <div className="rr-about-advisor-image relative w-full overflow-hidden">
                    <Image
                      src={m.img}
                      alt={m.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="rr-about-advisor-image flex w-full items-center justify-center overflow-hidden">
                    <span className="rr-about-profile-initial text-4xl font-bold">
                      {m.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3
                        className="text-base font-bold"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {m.name}
                      </h3>
                      <p className="rr-about-label mt-0.5 text-xs font-semibold">
                        {m.role}
                      </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0 mt-0.5">
                      {m.linkedin && (
                        <a
                          href={m.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rr-about-social flex h-7 w-7 items-center justify-center rounded-full transition-colors"
                        >
                          <LinkedInIcon />
                        </a>
                      )}
                      {m.twitter && (
                        <a
                          href={m.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rr-about-social flex h-7 w-7 items-center justify-center rounded-full transition-colors"
                        >
                          <TwitterIcon />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="rr-about-body mt-2 line-clamp-4 text-xs leading-relaxed">
                    {m.bio}
                  </p>
                  {m.whyAdvise && (
                    <div className="rr-about-advisor-note mt-3 rounded-lg border p-3">
                      <p className="rr-about-label mb-1 text-[10px] font-semibold uppercase tracking-wider">
                        Why I Advise RampRate
                      </p>
                      <p className="rr-about-body text-[11px] italic leading-relaxed">
                        &ldquo;{m.whyAdvise}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/impactsoul"
              className="rr-about-link inline-flex items-center gap-2 text-sm font-semibold hover:underline"
            >
              See our ImpactSoul advisor network
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CONCENTRIC MODEL ═══ */}
      <section className="relative section-dark overflow-hidden py-20 sm:py-28">
        <div
          className="absolute -top-40 -right-40 w-[350px] h-[350px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "oklch(0.55 0.22 260)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-20 -left-20 w-[200px] h-[200px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "oklch(0.82 0.15 75)", filter: "blur(80px)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-12"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The <span style={{ color: "oklch(0.55 0.15 30)" }}>Concentric</span>{" "}
            Model
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                ring: "Core",
                count: "4 Principals",
                desc: "Tony Greenberg, Alex Veytsel, Josh Bykowski and Rob Holmes. 24 years of shared history, complementary expertise, and a combined network spanning every major technology supplier and enterprise buyer.",
              },
              {
                ring: "Board",
                count: "10 Advisors",
                desc: "Stuart Newton (Deloitte), Gulliver Smithers (Sony), Purvee Kondal (Sephora), Curt Hessler (US Treasury), Barry Patmore (Accenture), Peter Gross (Bloom Energy), Peter Hirshberg (Apple), Joe Weinman (Cloudonomics), Sandy Climan (CAA/Universal), Tyler Kolodney.",
              },
              {
                ring: "Bench",
                count: "35+ Specialists",
                desc: "Deep technical experts in specific domains - from cloud architecture to telecom pricing to blockchain security to ESG measurement. Activated on-demand for specific engagements. Fortune 500 alumni. Davos, YPO, Summit, Hatch, XPRIZE, Aspen.",
              },
            ].map((r) => (
              <div
                key={r.ring}
                className="rounded-xl p-7 border text-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="text-3xl font-bold mb-2"
                  style={{
                    color: "oklch(0.55 0.15 30)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {r.ring}
                </div>
                <div
                  className="text-sm mb-4"
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {r.count}
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VALUES ═══ */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div
          className="absolute -bottom-32 -right-32 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "oklch(0.55 0.15 30)", filter: "blur(80px)" }}
        />
        <div
          className="absolute top-10 -left-20 w-[180px] h-[180px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "oklch(0.82 0.15 75)", filter: "blur(80px)" }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Our <span style={{ color: "oklch(0.55 0.15 30)" }}>Values</span>{" "}
            &amp; Principles
          </h2>
          <p
            className="text-base mb-10 max-w-2xl"
            style={{
              color: "oklch(0.45 0.02 50)",
              fontFamily: "var(--font-body)",
            }}
          >
            We build an ecosystem of impact-preneurs and trailblazers powered by
            opportunities, resources, innovation and human spirit.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 border border-black/5 shadow-sm"
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: "oklch(0.4 0.02 50)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="rr-public-surface py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            The hard decision does not have to stay hard.
          </h2>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Tell us where you are stuck. We will help you define the next move
            with clarity.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-[#071221] transition-all hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold active:scale-[0.97]"
          >
            Book a Call
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
