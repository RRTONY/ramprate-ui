'use client'

import {useState, useEffect} from 'react'
import {ChevronRight, ChevronLeft} from 'lucide-react'

/* ── TESTIMONIALS ── */
const testimonials = [
  {
    quote: "I engaged RampRate to work as sourcing advisors to Sony Music. Since engaging them they have helped me significantly reduce my cost structure through several major outsourcing deals worth deep 8 figures. They made me look like a hero to my executive management. They are a secret weapon.",
    name: 'Peter Borner',
    title: 'Former Head of IT, Sony',
  },
  {
    quote: "For over 16 years, RampRate helped my companies understand the differences between suppliers. They saved us millions, created agility and new budget out of thin air with each engagement.",
    name: 'Phil Wiser',
    title: 'EVP & CTO, ViacomCBS',
  },
  {
    quote: "RampRate was a risk-free proposition money-wise. They hit 27% savings and the relationships are stronger than ever.",
    name: 'Paul Santana',
    title: 'Manager of Data Center Operations, eBay',
  },
  {
    quote: "RampRate has been my most reliable global resource and is ready to perform for us at a moment's notice. Their inside knowledge and ability to handle high-level complex negotiations helped us move fast! They made scaling easier.",
    name: 'Paul Sams',
    title: 'COO, Blizzard Entertainment',
  },
  {
    quote: "Intel engaged RampRate as we launched our Digital Home content strategy & alliances group. RampRate defines professionalism and they run a world-class team devoted to the same ideals.",
    name: 'Ron Vaisbort',
    title: 'Executive at Intel, Blackberry, Ivalua',
  },
  {
    quote: "The deal that RampRate got for the Walt Disney Internet Group was one of the best deals in IT services I saw during my tenure at Disney. I would use RampRate again.",
    name: 'Robert Gonsalves',
    title: 'Former Director, Warner Bros. Online / Disney',
  },
  {
    quote: "Each time they have saved significant time in negotiating and closing contracts, which provided at least 20 if not 40% savings and certainly cut processes in half.",
    name: 'Michael Montalto',
    title: 'Accenture',
  },
  {
    quote: "Under-promised and over-delivered for more than 4 years. They paid for themselves by accelerating our growth by years.",
    name: 'Kipras Kazlauskas',
    title: 'Co-Founder, Syntropy',
  },
]

export default function TestimonialsCarousel() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 6000)
    return () => clearInterval(timer)
  }, [])

  const next = () => setActive((p) => (p + 1) % testimonials.length)
  const prev = () => setActive((p) => (p - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="section-dark py-28 sm:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14">
          <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-gold">
            What Executives Say
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold text-white">
            In Their Words.
          </h2>
        </div>

        {/* Desktop: 3 at a time */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-6">
            {[0, 1, 2].map((offset) => {
              const idx = (active + offset) % testimonials.length
              const t = testimonials[idx]
              return (
                <div
                  key={`${idx}-${active}`}
                  className="rounded-xl p-8 flex flex-col bg-white/4 border border-white/8"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mb-4 shrink-0 text-gold/40">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="currentColor"/>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="currentColor"/>
                  </svg>
                  <p className="font-body text-sm leading-relaxed italic flex-1 text-white/70">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-6 pt-4 border-t border-white/6">
                    <p className="font-display text-sm font-bold text-white">
                      {t.name}
                    </p>
                    <p className="font-body text-xs mt-0.5 text-white/40">
                      {t.title}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:border-white/30 hover:text-white text-white/40 border border-white/10"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === active ? "w-6 bg-gold" : "w-2 bg-white/20"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:border-white/30 hover:text-white text-white/40 border border-white/10"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Mobile: single card */}
        <div className="lg:hidden">
          <div
            key={active}
            className="rounded-xl p-7 bg-white/4 border border-white/8"
          >
            <p className="font-body text-sm leading-relaxed italic text-white/70">
              &ldquo;{testimonials[active].quote}&rdquo;
            </p>
            <div className="mt-5 pt-4 border-t border-white/6">
              <p className="font-display text-sm font-bold text-white">
                {testimonials[active].name}
              </p>
              <p className="font-body text-xs mt-0.5 text-white/40">
                {testimonials[active].title}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/10"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === active ? "w-5 bg-gold" : "w-2 bg-white/20"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/10"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
