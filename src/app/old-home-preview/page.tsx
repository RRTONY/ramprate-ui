import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Old Homepage Design Preview | RampRate",
  robots: { index: false, follow: false },
};

const stats = [
  { value: "$10B+", label: "Decisions Transacted" },
  { value: "50+", label: "Countries" },
  { value: "24", label: "Years Deep" },
];

export default function OldHomeDesignPreview() {
  return (
    <main>
      <section
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: "var(--dark)" }}
      >
        <div className="absolute inset-0">
          <Image
            src="/hero.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, var(--dark), rgba(10,15,26,0.85), transparent)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,15,26,0.9), transparent, rgba(10,15,26,0.4))",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center min-h-screen max-w-7xl mx-auto px-5 sm:px-8 w-full">
          <div className="max-w-xl lg:max-w-2xl pt-20 sm:pt-28 pb-20 sm:pb-32">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--gold)" }}
                />
                <span className="font-body text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase text-white/60">
                  Enterprise Decisions Collective
                </span>
              </span>
            </div>

            <h1 className="font-display font-bold leading-[1.08] tracking-[-0.02em] text-white text-[clamp(2.5rem,6vw,4.25rem)]">
              Where Relationships
              <br />
              Become <span style={{ color: "var(--gold)" }}>Revenue.</span>
            </h1>

            <p className="font-body mt-7 text-base sm:text-lg text-white/55 leading-relaxed max-w-lg">
              Since 2000, we&apos;ve transacted $10B+ in trajectory-changing
              connections across 50+ countries. We clean up intractable messes,
              speed up &amp; de-risk innovation, and align profit with purpose.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="font-body inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md text-sm font-semibold transition-all duration-300 hover:opacity-90"
                style={{ background: "var(--gold)", color: "var(--dark)" }}
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
              <Link
                href="/proof"
                className="font-body inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md text-sm font-semibold border border-white/20 text-white/80 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300"
              >
                See Case Results
              </Link>
            </div>

            <div className="mt-16 flex gap-8 sm:gap-12">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-white/90 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="font-body mt-0.5 text-[10px] sm:text-xs text-white/35 tracking-wide uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/30">
          <span className="font-body text-[10px] tracking-[0.3em] uppercase">
            Scroll
          </span>
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
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>
    </main>
  );
}
