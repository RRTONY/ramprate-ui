"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

/* ── TESTIMONIALS ── */
const testimonials = [
  {
    quote:
      "I engaged RampRate to work as sourcing advisors to Sony Music. Since engaging them they have helped me significantly reduce my cost structure through several major outsourcing deals worth deep 8 figures. They made me look like a hero to my executive management. They are a secret weapon.",
    name: "Peter Borner",
    title: "Former Head of IT, Sony",
  },
  {
    quote:
      "For over 16 years, RampRate helped my companies understand the differences between suppliers. They saved us millions, created agility and new budget out of thin air with each engagement.",
    name: "Phil Wiser",
    title: "EVP & CTO, ViacomCBS",
  },
  {
    quote:
      "RampRate was a risk-free proposition money-wise. They hit 27% savings and the relationships are stronger than ever.",
    name: "Paul Santana",
    title: "Manager of Data Center Operations, eBay",
  },
  {
    quote:
      "RampRate has been my most reliable global resource and is ready to perform for us at a moment's notice. Their inside knowledge and ability to handle high-level complex negotiations helped us move fast! They made scaling easier.",
    name: "Paul Sams",
    title: "COO, Blizzard Entertainment",
  },
  {
    quote:
      "Intel engaged RampRate as we launched our Digital Home content strategy & alliances group. RampRate defines professionalism and they run a world-class team devoted to the same ideals.",
    name: "Ron Vaisbort",
    title: "Executive at Intel, Blackberry, Ivalua",
  },
  {
    quote:
      "The deal that RampRate got for the Walt Disney Internet Group was one of the best deals in IT services I saw during my tenure at Disney. I would use RampRate again.",
    name: "Robert Gonsalves",
    title: "Former Director, Warner Bros. Online / Disney",
  },
  {
    quote:
      "Each time they have saved significant time in negotiating and closing contracts, which provided at least 20 if not 40% savings and certainly cut processes in half.",
    name: "Michael Montalto",
    title: "Accenture",
  },
  {
    quote:
      "Under-promised and over-delivered for more than 4 years. They paid for themselves by accelerating our growth by years.",
    name: "Kipras Kazlauskas",
    title: "Co-Founder, Syntropy",
  },
];

export default function TestimonialsCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setActive((p) => (p + 1) % testimonials.length),
      6000,
    );
    return () => clearInterval(timer);
  }, []);

  const next = () => setActive((p) => (p + 1) % testimonials.length);
  const prev = () =>
    setActive((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="section-warm py-24 sm:py-32 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-rust">
            What Executives Say
          </span>
          <h2 className="font-display mt-4 text-4xl sm:text-5xl font-bold text-ink">
            In their words.
          </h2>
        </div>

        {/* Desktop: 3 at a time */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-6">
            {[0, 1, 2].map((offset) => {
              const idx = (active + offset) % testimonials.length;
              const t = testimonials[idx];
              return (
                <div
                  key={`${idx}-${active}`}
                  className="glass-card-warm p-8 flex flex-col"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mb-4 shrink-0 text-rust/50"
                  >
                    <path
                      d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"
                      fill="currentColor"
                    />
                    <path
                      d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"
                      fill="currentColor"
                    />
                  </svg>
                  <p className="font-body text-sm leading-relaxed italic flex-1 text-ink-mid">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-6 pt-4 border-t border-black/10">
                    <p className="font-display text-sm font-bold text-ink">
                      {t.name}
                    </p>
                    <p className="font-body text-xs mt-0.5 text-ink-mid">
                      {t.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:border-black/30 hover:text-ink text-ink-mid border border-black/15"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="w-7 h-7 shrink-0 flex items-center justify-center"
                >
                  <span
                    className={`block h-2 rounded-full transition-all ${
                      i === active ? "w-6 bg-rust" : "w-2 bg-black/15"
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:border-black/30 hover:text-ink text-ink-mid border border-black/15"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Mobile: single card */}
        <div className="lg:hidden">
          <div key={active} className="glass-card-warm p-7">
            <p className="font-body text-sm leading-relaxed italic text-ink-mid">
              &ldquo;{testimonials[active].quote}&rdquo;
            </p>
            <div className="mt-5 pt-4 border-t border-black/10">
              <p className="font-display text-sm font-bold text-ink">
                {testimonials[active].name}
              </p>
              <p className="font-body text-xs mt-0.5 text-ink-mid">
                {testimonials[active].title}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-11 h-11 rounded-full flex items-center justify-center text-ink-mid hover:text-ink transition-all border border-black/15"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="w-7 h-7 shrink-0 flex items-center justify-center"
                >
                  <span
                    className={`block h-2 rounded-full transition-all ${
                      i === active ? "w-5 bg-rust" : "w-2 bg-black/15"
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-11 h-11 rounded-full flex items-center justify-center text-ink-mid hover:text-ink transition-all border border-black/15"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
