import { advisoryPractices } from "@/lib/advisory-practices";
import Link from "next/link";
import type { Metadata } from "next";
import JsonLd, {
  serviceJsonLd,
  breadcrumbJsonLd,
} from "@/components/shared/JsonLd";
import { getPageSeo, withSeoOverrides } from "@/lib/sanity/seo";

const FALLBACK_METADATA: Metadata = {
  title: "Expertise",
  description:
    "Six practices. One mission: transparency, skin in the game, and principals who execute.",
  keywords: [
    "RampRate practices",
    "enterprise IT sourcing",
    "growth strategy advisory",
    "Web3 blockchain advisory",
    "impact consulting",
    "torque",
    "litigation counsel sourcing",
  ],
  alternates: { canonical: "/expertise" },
  openGraph: {
    title: "Expertise",
    description:
      "Six practices. One mission: transparency, skin in the game, and principals who execute.",
    url: "https://ramprate.com/expertise",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Expertise",
    description:
      "Six practices. One mission: transparency, skin in the game, and principals who execute.",
    images: ["/og.png"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageSeo("/expertise");
  return withSeoOverrides(FALLBACK_METADATA, data?.seo);
}

export default function ExpertisePage() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: "RampRate Advisory Practices",
          description:
            "Enterprise IT sourcing, growth strategy, Web3 advisory, health supplier qualification, impact consulting, and litigation counsel sourcing (Torque) - independent advisory with transparency, skin in the game, and principals who execute.",
          url: "https://ramprate.com/expertise",
          serviceType: "IT and business advisory",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Expertise", url: "https://ramprate.com/expertise" },
        ])}
      />
      {/* Hero */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden bg-[linear-gradient(135deg,oklch(0.14_0.01_250)_0%,oklch(0.18_0.02_260)_50%,oklch(0.14_0.01_250)_100%)]">
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          {/* Label */}
          <div className="mb-6">
            <span className="font-body inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.6_0.2_280)]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
                Our Practices
              </span>
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white max-w-4xl">
            Six ways to move a decision forward
          </h1>

          <p className="font-body mt-6 text-base sm:text-lg leading-relaxed max-w-2xl text-white/50">
            Choose the decision closest to yours. A RampRate principal will help
            you find the right practice or bring several together.
          </p>
        </div>
      </section>

      {/* Practice Cards */}
      <section className="py-24 bg-dark">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
          {advisoryPractices.map((p) => (
            <div
              key={p.name}
              className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/2"
            >
              {/* Colored left border accent */}
              <div
                className="absolute top-0 left-0 w-1 h-full"
                style={{ backgroundColor: p.darkSectionAccent }}
              />

              <div className="p-8 sm:p-10">
                {/* Tagline */}
                <p
                  className="font-mono text-xs uppercase mb-2 tracking-[0.2em]"
                  style={{ color: p.darkSectionAccent }}
                >
                  {p.name}
                </p>

                {/* Name */}
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
                  {p.decision}
                </h2>

                {/* Description */}
                <p className="font-body leading-relaxed max-w-2xl mb-6 text-white/60">
                  {p.description}
                </p>

                {/* Stats pills */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {p.topics.map((s) => (
                    <span
                      key={s}
                      className="font-mono px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        border: `1px solid color-mix(in oklch, ${p.darkSectionAccent} 30%, transparent)`,
                        color: p.darkSectionAccent,
                        backgroundColor: `color-mix(in oklch, ${p.darkSectionAccent} 8%, transparent)`,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={p.href}
                  className="font-body inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-all hover:brightness-110 text-[oklch(0.15_0.02_75)]"
                  style={{ backgroundColor: p.darkSectionAccent }}
                >
                  Explore {p.name}
                  <svg
                    width="14"
                    height="14"
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
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-dark">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
            Not Sure Which Practice Fits?
          </h2>
          <p className="font-body mb-10 max-w-xl mx-auto text-white/60">
            Tell us what&apos;s broken. We&apos;ll figure out which team - or
            combination - gets it done.
          </p>
          <Link
            href="/contact"
            className="font-body inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-bold transition-all hover:brightness-110 bg-amber text-[oklch(0.15_0.02_75)]"
            style={{
              boxShadow:
                "0 8px 32px color-mix(in oklch, oklch(0.82 0.15 75) 20%, transparent)",
            }}
          >
            Tell Us What&apos;s Broken
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
    </>
  );
}
