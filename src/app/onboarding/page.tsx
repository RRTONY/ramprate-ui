import type { Metadata } from "next";
import RelationshipProfileForm from "@/components/onboarding/RelationshipProfileForm";

// Shared by link with people RampRate works with, not a page to be found in
// search, so it stays out of the menu, site search and sitemap and is noindex.
export const metadata: Metadata = {
  title: "Relationship Profile",
  description:
    "Tell RampRate how you prefer to work: your city, channels, scheduling and priorities.",
  alternates: { canonical: "/onboarding" },
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  return (
    <div className="bg-ed-ivory text-ed-ink">
      <section className="pt-32 pb-8 sm:pt-40 sm:pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <span className="font-body text-sm font-semibold tracking-[0.18em] uppercase text-ed-forest">
            Working with you
          </span>
          <h1 className="font-display mt-4 text-[clamp(2rem,6vw,3.75rem)] font-bold leading-[1.08] tracking-tight max-w-3xl text-balance">
            Tell us how you work, and we will{" "}
            <span className="relative isolate whitespace-nowrap">
              work that way.
              <span
                aria-hidden="true"
                className="absolute left-0 right-0 -bottom-1 h-2 rounded-full bg-ed-coral/60 -z-10"
              />
            </span>
          </h1>
          <p className="font-body mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl text-ed-muted text-pretty">
            A few details so every conversation, meeting and follow-up fits your
            schedule and your preferences. The first four steps take about three
            minutes. Everything after that is optional.
          </p>

          <ul className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-body text-[15px] text-ed-ink">
            <li className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-ed-forest"
              />
              About 3 minutes
            </li>
            <li className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-ed-forest"
              />
              Skip anything you like
            </li>
            <li className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-ed-forest"
              />
              Personal details are always optional
            </li>
          </ul>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <RelationshipProfileForm />
        </div>
      </section>
    </div>
  );
}
