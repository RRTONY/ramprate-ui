import Link from "next/link";

// Tony's two-part America, Unbundled series lives on tonygreenberg.com, not in
// this site's Sanity, so it is featured above the blog's first page instead of
// as posts. Card copy matches the same banner on tonygreenberg.com/blog
// (src/components/blog/america-unbundled-series.tsx in tonyg-site).
const PARTS = [
  {
    href: "https://tonygreenberg.com/america-unbundled",
    label: "Politics and AI · Part One",
    title: "AI Does Not Have a Candidate: Politics for the AI Age",
    summary:
      "An independent civic grid for accountability over AI, energy and political power.",
  },
  {
    href: "https://tonygreenberg.com/america-unbundled-field-guide",
    label: "Civic Governance · Part Two",
    title: "America, Unbundled: The Field Guide",
    summary:
      "A practical guide to independent political infrastructure, accountability and civic action.",
  },
];

export default function AmericaUnbundledBanner() {
  return (
    <section
      aria-labelledby="america-unbundled-heading"
      className="mb-12 rounded-xl p-6 sm:p-8 bg-white/3 border border-gold/20"
    >
      <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase mb-3 block text-gold">
        By Tony Greenberg
      </span>
      <h2
        id="america-unbundled-heading"
        className="font-display text-2xl sm:text-3xl font-bold text-white"
      >
        <Link
          href="/blog/america-unbundled-introduction"
          className="hover:text-gold transition-colors"
        >
          America, Unbundled: An Introduction
        </Link>
      </h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {PARTS.map((p) => (
          <a
            key={p.href}
            href={p.href}
            className="group block rounded-xl p-5 bg-white/3 border border-white/6 transition-colors hover:border-gold/40"
          >
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-amber">
              {p.label}
            </span>
            <h3 className="font-display mt-2 text-xl font-bold text-white group-hover:text-gold transition-colors">
              {p.title}
            </h3>
            <p className="font-body mt-3 text-sm sm:text-base leading-relaxed text-white/60">
              {p.summary}
            </p>
            <span className="font-body mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
              Read on tonygreenberg.com
              <svg
                aria-hidden="true"
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
          </a>
        ))}
      </div>
    </section>
  );
}
