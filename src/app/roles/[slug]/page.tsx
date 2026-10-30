import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PreviewBar from "@/components/roles/PreviewBar";
import PrescreenForm from "@/components/roles/PrescreenForm";
import { ROLES_PREVIEW, SCREENING_BANNER, visibleRoles } from "@/lib/roles";

export const dynamicParams = false;

export function generateStaticParams() {
  return visibleRoles().map((r) => ({ slug: r.slug }));
}

const findRole = (slug: string) => visibleRoles().find((r) => r.slug === slug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = findRole(slug);
  if (!r) return {};
  const url = `https://ramprate.com/roles/${r.slug}`;
  return {
    title: r.title,
    description: r.summary,
    alternates: { canonical: url },
    robots: ROLES_PREVIEW ? { index: false, follow: false } : undefined,
    openGraph: {
      title: `${r.title} | RampRate`,
      description: r.summary,
      type: "website",
      url,
      siteName: "RampRate",
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${r.title} | RampRate`,
      description: r.summary,
      images: ["/og.png"],
    },
  };
}

const tag = "rounded-full border px-3 py-1 text-xs font-semibold";

export default async function RolePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = findRole(slug);
  if (!r) notFound();

  return (
    <div className="section-light min-h-screen pt-28 pb-20 sm:pt-32">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <PreviewBar />
        <Link
          href="/roles"
          className="mb-6 inline-block text-sm font-semibold text-ink-mid hover:text-ink"
        >
          &larr; All open roles
        </Link>

        {r.screening_banner && (
          <aside
            role="note"
            className="mb-8 rounded-lg border-l-4 border-gold bg-warm-bg p-5 text-sm leading-relaxed text-ink sm:p-6"
          >
            <strong className="mb-3 block">{SCREENING_BANNER.heading}</strong>
            <ol className="mb-3 list-decimal space-y-2 pl-5">
              {SCREENING_BANNER.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ol>
            <p>{SCREENING_BANNER.footer}</p>
          </aside>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          <span className={`${tag} border-black/10 bg-white text-ink-mid`}>
            {r.practice_area}
          </span>
          {r.status === "Draft" && (
            <span
              className={`${tag} border-gold bg-[oklch(0.95_0.06_85)] text-ink`}
            >
              Draft. Pending approval
            </span>
          )}
        </div>
        <h1 className="mb-4 font-display text-[clamp(2rem,5vw,3rem)] font-bold leading-tight text-ink">
          {r.title}
        </h1>
        <p className="mb-4 text-base leading-relaxed text-ink">{r.summary}</p>
        <ul className="mb-10 space-y-1 text-sm text-ink-mid">
          <li>{r.engagement_type}</li>
          <li>{r.pay_text}</li>
        </ul>

        {r.sections.map((s) => (
          <section key={s.heading} className="mb-8">
            <h2 className="mb-3 font-display text-xl font-bold text-ink">
              {s.heading}
            </h2>
            {s.text && (
              <p className="text-sm leading-relaxed text-ink">{s.text}</p>
            )}
            {s.items && (
              <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink">
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {(r.application_uploads.length > 0 ||
          r.application_questions.length > 0) && (
          <section className="mb-8 rounded-xl border border-black/5 bg-warm-bg/60 p-6 sm:p-7">
            <h2 className="mb-2 font-display text-xl font-bold text-ink">
              What the application asks
            </h2>
            <p className="mb-4 text-sm text-ink-mid">
              The application form includes the items below. It takes about 10
              minutes.
            </p>
            {r.application_uploads.length > 0 && (
              <>
                <h3 className="mb-2 text-sm font-bold text-ink">
                  Please have ready
                </h3>
                <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-ink">
                  {r.application_uploads.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </>
            )}
            {r.application_questions.length > 0 && (
              <>
                <h3 className="mb-2 text-sm font-bold text-ink">Questions</h3>
                <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink">
                  {r.application_questions.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ol>
              </>
            )}
          </section>
        )}

        <section
          id="apply"
          className="rounded-xl border border-black/10 p-6 sm:p-7"
        >
          <h2 className="mb-2 font-display text-xl font-bold text-ink">
            Apply
          </h2>
          <p className="mb-5 text-sm text-ink-mid">
            Answer both questions first. You can only continue if you meet both
            minimums.
          </p>
          <PrescreenForm roleId={r.role_id} applyUrl={r.apply_url} />
        </section>
      </div>
    </div>
  );
}
