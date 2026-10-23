import type { Metadata } from "next";
import Link from "next/link";
import PreviewBar from "@/components/roles/PreviewBar";
import RoleLink from "@/components/roles/RoleLink";
import { ROLES_PREVIEW, visibleRoles } from "@/lib/roles";

const description =
  "Open roles at RampRate and ImpactSoul. Senior, project-based contractor roles.";

export const metadata: Metadata = {
  title: "Open Roles",
  description,
  alternates: { canonical: "https://ramprate.com/roles" },
  robots: ROLES_PREVIEW ? { index: false, follow: false } : undefined,
  openGraph: {
    title: "Open Roles | RampRate",
    description,
    type: "website",
    url: "https://ramprate.com/roles",
    siteName: "RampRate",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Roles | RampRate",
    description,
    images: ["/og.png"],
  },
};

export default function RolesPage() {
  const roles = visibleRoles();
  return (
    <div className="section-light min-h-screen pt-28 pb-20 sm:pt-32">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <PreviewBar />
        <h1 className="mb-4 font-display text-[clamp(2.2rem,6vw,3.5rem)] font-bold leading-tight text-ink">
          Open Roles
        </h1>
        <p className="mb-10 text-base leading-relaxed text-ink-mid">
          Senior, project-based contractor roles. We hire slowly and look for
          people with deep, current relationships in their field.
        </p>

        {roles.length ? (
          <div className="space-y-6">
            {roles.map((r) => (
              <article
                key={r.role_id}
                className="rounded-xl border border-black/5 bg-warm-bg/60 p-6 sm:p-7"
              >
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-ink-mid">
                    {r.practice_area}
                  </span>
                  {r.status === "Draft" && (
                    <span className="rounded-full border border-gold bg-[oklch(0.95_0.06_85)] px-3 py-1 text-xs font-semibold text-ink">
                      Draft
                    </span>
                  )}
                </div>
                <h2 className="mb-3 font-display text-2xl font-bold leading-snug text-ink">
                  {r.title}
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-ink">
                  {r.summary}
                </p>
                <ul className="mb-6 space-y-1 text-sm text-ink-mid">
                  <li>{r.engagement_type}</li>
                  <li>{r.pay_text}</li>
                </ul>
                <RoleLink
                  slug={r.slug}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-gold px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold/10"
                >
                  View role
                </RoleLink>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-black/5 bg-warm-bg/60 p-7">
            <h2 className="mb-2 font-display text-2xl font-bold text-ink">
              No open roles right now
            </h2>
            <p className="text-sm leading-relaxed text-ink-mid">
              We hire slowly and post roles as they open. To start a
              conversation,{" "}
              <Link
                href="/contact"
                className="font-semibold text-ink underline"
              >
                get in touch
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
