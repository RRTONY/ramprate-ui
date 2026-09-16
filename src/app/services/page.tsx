import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { impactSolService, services } from "@/lib/service-catalog";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Services",
  description:
    "RampRate helps teams make complex technology, partnership, infrastructure, and growth decisions pay off.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main className="service-page min-h-screen overflow-hidden bg-[#050b14] pb-24 pt-28 text-white sm:pt-36">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Services", url: "https://ramprate.com/services" },
        ])}
      />
      <section className="relative isolate overflow-hidden border-b border-white/10 pb-20 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_12%,rgba(35,96,159,0.36),transparent_30%),radial-gradient(circle_at_14%_90%,rgba(214,173,66,0.14),transparent_28%)]" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-gold">
            RampRate services
          </p>
          <h1 className="mt-6 max-w-5xl font-display text-5xl font-bold leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl lg:text-8xl">
            Complex decisions. Clearer next moves.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/76 sm:text-xl">
            Senior-led support for the moments when technology, partnerships,
            infrastructure, and growth have to work together.
          </p>
          <Link
            href="/contact"
            className="mt-9 inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-[#071221] transition duration-200 hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold active:scale-[0.97]"
          >
            Book a Call <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-gold">
              Choose the decision
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
              How RampRate helps.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/62">
            Start with the outcome you need. We will help you decide what the
            work requires next.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {services.map((service, index) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-200 hover:-translate-y-0.5 hover:border-gold/50 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:p-8"
            >
              <span className="font-mono text-xs tracking-[0.18em] text-gold">
                0{index + 1}
              </span>
              <h3 className="mt-10 max-w-md font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                {service.title}
              </h3>
              <p className="mt-4 max-w-lg leading-relaxed text-white/68">
                {service.summary}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                Explore service{" "}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>

        <Link
          href={impactSolService.href}
          className="group mt-12 grid gap-5 rounded-2xl border border-gold/30 bg-[linear-gradient(130deg,#0f1725,#122742)] p-6 transition hover:border-gold/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-8"
        >
          <Sparkles className="h-7 w-7 text-gold" aria-hidden="true" />
          <div>
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-gold">
              {impactSolService.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white">
              {impactSolService.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
              {impactSolService.summary}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold">
            Visit ImpactSol <Compass className="h-4 w-4" aria-hidden="true" />
          </span>
        </Link>
      </section>
    </main>
  );
}
