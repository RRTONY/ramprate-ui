import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { ServiceOffering } from "@/lib/service-catalog";
import JsonLd from "@/components/shared/JsonLd";

export default function ServicePage({ service }: { service: ServiceOffering }) {
  return (
    <main className="service-page min-h-screen overflow-hidden bg-[#050b14] pb-24 pt-28 text-white sm:pt-36">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `RampRate ${service.title}`,
          description: service.summary,
          provider: {
            "@type": "Organization",
            name: "RampRate",
            url: "https://ramprate.com",
          },
          url: `https://ramprate.com/services/${service.slug}`,
        }}
      />

      <section className="relative isolate border-b border-white/10 pb-20 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_86%_14%,rgba(39,99,160,0.34),transparent_26%),radial-gradient(circle_at_8%_66%,rgba(214,173,66,0.13),transparent_30%)]" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-gold">
            {service.eyebrow}
          </p>
          <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.72fr)] lg:items-end">
            <div>
              <h1 className="max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
                {service.title}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/76 sm:text-xl">
                {service.summary}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-[#071221] transition duration-200 hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold active:scale-[0.97]"
                >
                  Book a Call{" "}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/proof"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:border-gold/70 hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold active:scale-[0.97]"
                >
                  View Case Studies
                </Link>
              </div>
            </div>

            <aside
              className="border-l border-gold/60 pl-5 sm:pl-7"
              aria-label="The decision this service helps solve"
            >
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-gold">
                The decision
              </p>
              <p className="mt-4 text-lg leading-relaxed text-white/82">
                {service.decision}
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-gold">
            How we help
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            From a hard decision to practical next steps.
          </h2>
          <ol className="mt-10 grid gap-4">
            {service.engagementMoments.map((moment, index) => (
              <li
                key={moment}
                className="group grid gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition-colors hover:border-gold/40 sm:grid-cols-[2.5rem_1fr] sm:p-6"
              >
                <span className="font-mono text-sm text-gold">
                  0{index + 1}
                </span>
                <span className="text-base leading-relaxed text-white/82">
                  {moment}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <aside
          className="self-start rounded-2xl border border-gold/25 bg-[#0f1725] p-6 sm:p-7"
          aria-labelledby="case-proof-title"
        >
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-gold">
            Case proof
          </p>
          <h2
            id="case-proof-title"
            className="mt-4 font-display text-3xl font-bold leading-tight text-white"
          >
            {service.caseProof.client}
          </h2>
          <p className="mt-3 leading-relaxed text-white/68">
            {service.caseProof.context}
          </p>
          <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5 text-sm text-white/64">
            <Check className="h-4 w-4 text-gold" aria-hidden="true" />
            Existing RampRate case record
          </div>
        </aside>
      </section>
    </main>
  );
}
