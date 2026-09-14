import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const revalidate = 60;

const TITLE = "Artifacts | RampRate";
const DESCRIPTION =
  "RampRate's proprietary tools, calculators, assessments, and frameworks - built from 25 years of enterprise advisory intelligence.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/artifacts" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://ramprate.com/artifacts",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

interface ArtifactSummary {
  title: string;
  slug: string;
  description?: string;
  publishedAt?: string;
}

async function getPublishedArtifacts(): Promise<ArtifactSummary[]> {
  return client.fetch(
    `*[_type == "artifact" && status == "published"] | order(publishedAt desc) {
      title, "slug": slug.current, description, publishedAt
    }`,
    {},
    { next: { revalidate: 60, tags: ["artifacts"] } },
  );
}

export default async function ArtifactsPage() {
  const artifacts = await getPublishedArtifacts();

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Artifacts", url: "https://ramprate.com/artifacts" },
        ])}
      />

      {/* Hero */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: "var(--dark)" }}
      >
        <div className="glass-orb glass-orb-amber w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-rust w-[240px] h-[240px] bottom-0 -left-28" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
            style={{
              color: "var(--gold-light)",
              fontFamily: "var(--font-body)",
            }}
          >
            RampRate Artifacts
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tools Built From 25 Years of Advisory Intelligence.
          </h1>
          <p
            className="text-white/70 text-lg leading-relaxed max-w-2xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Proprietary calculators, assessments, and frameworks built by the
            RampRate team - practical tools drawn from real engagements, not
            generic templates.
          </p>
        </div>
      </section>

      {/* Grid / Empty state */}
      <section className="section-light py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {artifacts.length === 0 ? (
            <div className="rounded-2xl border border-black/5 bg-[oklch(0.97_0.01_80)] p-12 sm:p-16 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "oklch(0.52 0.12 70 / 0.1)" }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="oklch(0.52 0.12 70)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
              </div>
              <h2
                className="text-xl font-bold mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Artifacts are on their way.
              </h2>
              <p
                className="text-sm max-w-md mx-auto"
                style={{
                  color: "oklch(0.45 0.02 50)",
                  fontFamily: "var(--font-body)",
                }}
              >
                RampRate&apos;s tools, calculators, and frameworks will appear
                here as they&apos;re published.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artifacts.map((a) => (
                <Link
                  key={a.slug}
                  href={`/artifacts/${a.slug}`}
                  className="group rounded-xl border p-7 transition-all duration-300 hover:-translate-y-1 bg-white"
                  style={{ borderColor: "oklch(0.9 0.01 80)" }}
                >
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {a.title}
                  </h3>
                  {a.description && (
                    <p
                      className="text-sm leading-relaxed mb-4"
                      style={{
                        color: "oklch(0.45 0.02 50)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {a.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    {a.publishedAt && (
                      <span
                        className="text-xs uppercase tracking-wider"
                        style={{
                          color: "oklch(0.55 0.02 50)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {new Date(a.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                    <span
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5"
                      style={{
                        color: "oklch(0.52 0.12 70)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      Open
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
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
