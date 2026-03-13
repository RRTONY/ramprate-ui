import Link from 'next/link'
import type {Metadata} from 'next'
import {client} from '@/lib/sanity/client'
import {teamMembersQuery, boardAdvisorsQuery, siteSettingsQuery} from '@/lib/sanity/queries'
import {urlFor} from '@/lib/sanity/image'

export const metadata: Metadata = {
  title: 'About | RampRate',
  description:
    'RampRate is a global advisory firm founded in 2000. Impact and technology-focused advisor for enterprise and startups.',
}


const LinkedInIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

export default async function AboutPage() {
  const [sanityTeam, sanityAdvisors, siteSettings] = await Promise.all([
    client.fetch(teamMembersQuery),
    client.fetch(boardAdvisorsQuery),
    client.fetch(siteSettingsQuery),
  ])

  const displayTeam = (sanityTeam ?? []).map((m: {name: string; role: string; bio: string; photo: {asset: {_ref: string}} | null; linkedin: string | null; twitter: string | null}) => ({
    name: m.name,
    role: m.role,
    bio: m.bio,
    img: m.photo ? urlFor(m.photo).width(800).height(600).url() : null,
    linkedin: m.linkedin,
    twitter: m.twitter ?? null,
  }))

  const displayAdvisors: {name: string; role: string; img: string | null; bio: string; whyAdvise: string | null; linkedin: string | null; twitter: string | null}[] =
    (sanityAdvisors ?? []).map((m: {name: string; role: string; bio: string; whyAdvise: string | null; photoUrl: string | null; linkedin: string | null; twitter: string | null}) => ({
      name: m.name,
      role: m.role,
      bio: m.bio,
      img: m.photoUrl ?? null,
      whyAdvise: m.whyAdvise ?? null,
      linkedin: m.linkedin ?? null,
      twitter: m.twitter ?? null,
    }))

  const values: string[] = siteSettings?.companyValues ?? []
  const timeline: {year: string; event: string}[] = siteSettings?.timeline ?? []
  const corporateFacts: {label: string; value: string}[] = siteSettings?.corporateFacts ?? []

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section
        className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden"
        style={{background: 'linear-gradient(135deg, oklch(0.12 0.01 250) 0%, oklch(0.16 0.02 260) 50%, oklch(0.12 0.01 250) 100%)'}}
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none" style={{background: 'oklch(0.55 0.15 30)', filter: 'blur(80px)'}} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none" style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-4">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-[0.2em]"
              style={{border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)'}}
            >
              About RampRate
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white max-w-4xl"
            style={{fontFamily: 'var(--font-display)'}}
          >
            Impact and Technology-Focused Advisor for{' '}
            <span style={{color: 'oklch(0.82 0.15 75)'}}>Enterprise & Startups</span>
          </h1>

          <p
            className="mt-6 text-base sm:text-lg leading-relaxed max-w-2xl"
            style={{color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)'}}
          >
            RampRate is a global advisory firm focused on the most impactful, positive opportunities in tech and wellness. Founded in 2000. Private &amp; self-funded. Profitable since birth.
          </p>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
            {[
              {value: '2000', label: 'Founded'},
              {value: '$24B+', label: 'Decisions Brokered'},
              {value: '50+', label: 'Countries'},
              {value: 'B Corp', label: 'Certified'},
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-bold" style={{color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-mono)'}}>{s.value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-wider" style={{color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)'}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOUNDER'S STORY ═══ */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="absolute -bottom-32 -right-32 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none" style={{background: 'oklch(0.55 0.15 30)', filter: 'blur(80px)'}} />
        <div className="absolute top-10 -left-20 w-[180px] h-[180px] rounded-full opacity-15 pointer-events-none" style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}} />

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}>
            Founder&apos;s Story
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight" style={{fontFamily: 'var(--font-display)'}}>
            Elevating the Way Business Does Business
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>
            <p>
              Hi, We&apos;re Tony and Alex, we founded RampRate in 2000 on the premise of elevating the way business does business. We could take the same connections that allowed us to cut 24% of each IT budget we touched and use them to kick down the barriers for tech innovators. We could take the same business planning rigor that we used to guide Sony, McKinsey, Microsoft or Intel on entering new markets and use it to help impact-driven startups reach their potential.
            </p>
            <p>
              So that&apos;s what we&apos;re doing today — we find the next unicorns and gatekeepers to impact that will not just earn millions yet better millions of lives. We grok their vision while putting them through bootcamp to be ready for life-changing opportunities. And then we kick down the barriers to their success by connecting them with our ecosystem and leveraging the trust we&apos;ve built in the Fortune 1000 over 20 plus years to create opportunities few others can access.
            </p>
            <p>
              The purpose driven economy is here. And its leaders, in one way or another, will be powered by RampRate.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ PRINCIPALS, NOT PYRAMIDS ═══ */}
      <section className="py-20 sm:py-28" style={{background: '#0d1117'}}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-body)'}}>
            Our Structure
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white tracking-tight" style={{fontFamily: 'var(--font-display)'}}>
            Principals, Not Pyramids.
          </h2>
          <p className="mt-6 text-base sm:text-lg leading-relaxed max-w-3xl" style={{color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)'}}>
            Every engagement is led by the same senior team that has been serving Fortune 500 companies for 25 years. No junior associates. No handoff to unknown delivery teams. The people whose names are on the testimonials are the people who serve you.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {[
              {value: '25', label: 'Years, same team'},
              {value: '0', label: 'Junior layers'},
              {value: '100%', label: 'Principal-led'},
            ].map((s) => (
              <div key={s.label} className="rounded-lg px-6 py-4 border" style={{background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)'}}>
                <div className="text-2xl font-bold" style={{color: 'oklch(0.82 0.15 75)', fontFamily: 'var(--font-mono)'}}>{s.value}</div>
                <div className="text-xs mt-1" style={{color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)'}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CORPORATE FACTS ═══ */}
      <section className="relative section-light overflow-hidden py-16 sm:py-20">
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8" style={{fontFamily: 'var(--font-display)'}}>
            Corporate <span style={{color: 'oklch(0.55 0.15 30)'}}>Facts</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {corporateFacts.map((f) => (
              <div key={f.label} className="bg-white rounded-lg p-5 border border-black/5">
                <div className="text-xs font-semibold tracking-[0.15em] uppercase mb-1" style={{color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}>{f.label}</div>
                <div className="text-sm" style={{color: 'oklch(0.3 0.02 50)', fontFamily: 'var(--font-body)'}}>{f.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-5 bg-white rounded-lg border border-black/5">
            <div className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}>Areas of Expertise</div>
            <div className="flex flex-wrap gap-2">
              {[
                'Social Impact (measurement, supply chain, finance)',
                'IT Infrastructure (hosting, networks, cloud, telecom, support)',
                'Strategic Research (primary research, data models, product planning)',
                'Digital Media (live events, CDN, licensing)',
                'Blockchain (mining, proof of stake, tokenomics)',
                'Health & Wellness Innovation',
              ].map((a) => (
                <span key={a} className="px-3 py-1 text-xs rounded-full" style={{background: 'rgba(100,60,30,0.1)', color: 'oklch(0.45 0.1 30)', fontFamily: 'var(--font-body)'}}>{a}</span>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/process"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-bold text-white transition-all hover:opacity-90"
              style={{background: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}
            >
              Flow Circuit Assessment
            </Link>
            <Link
              href="/process"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-bold border transition-all hover:opacity-90"
              style={{borderColor: 'rgba(96,60,180,0.3)', color: 'oklch(0.6 0.2 280)', fontFamily: 'var(--font-body)'}}
            >
              Find Your Me / Way / Our
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <section className="relative section-dark overflow-hidden py-20 sm:py-28">
        <div className="absolute -top-40 -right-40 w-[350px] h-[350px] rounded-full opacity-20 pointer-events-none" style={{background: 'oklch(0.55 0.22 260)', filter: 'blur(80px)'}} />
        <div className="absolute bottom-20 -left-20 w-[200px] h-[200px] rounded-full opacity-15 pointer-events-none" style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}} />

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12" style={{fontFamily: 'var(--font-display)'}}>
            Our <span style={{color: 'oklch(0.55 0.15 30)'}}>Journey</span>
          </h2>
          <div className="space-y-0">
            {timeline.map((t) => (
              <div key={t.year} className="flex gap-6 py-5 border-b border-white/10 last:border-0">
                <div className="text-2xl font-bold shrink-0 w-16" style={{color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-mono)'}}>{t.year}</div>
                <p className="text-sm leading-relaxed pt-1" style={{color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)'}}>{t.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CORE TEAM ═══ */}
      <section className="relative section-light overflow-hidden py-20 sm:py-28">
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{fontFamily: 'var(--font-display)'}}>
            Core <span style={{color: 'oklch(0.55 0.15 30)'}}>Team</span>
          </h2>
          <p className="text-base mb-12 max-w-2xl" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>
            We deploy time-dependent configurations. Principals stay. Advisors guide. Specialists rotate.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(displayTeam as {name: string; role: string; bio: string; img: string | null; linkedin: string | null; twitter: string | null}[]).map((m) => (
              <div key={m.name} className="bg-white rounded-xl overflow-hidden border border-black/5 shadow-sm">
                {m.img ? (
                  <div className="h-56 overflow-hidden" style={{background: 'oklch(0.92 0.01 80)'}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.img} alt={m.name} className="w-full h-full object-cover" style={{objectPosition: 'center 20%'}} loading="lazy" />
                  </div>
                ) : (
                  <div className="h-56 flex items-center justify-center" style={{background: 'oklch(0.92 0.01 80)'}}>
                    <span className="text-5xl font-bold" style={{color: 'rgba(100,60,30,0.2)', fontFamily: 'var(--font-display)'}}>
                      {m.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold" style={{fontFamily: 'var(--font-display)'}}>{m.name}</h3>
                      <p className="text-xs font-semibold mt-1 tracking-wide uppercase" style={{color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}>{m.role}</p>
                    </div>
                    <div className="flex gap-2 shrink-0 mt-1">
                      {m.linkedin && (
                        <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{background: 'rgba(100,60,30,0.1)', color: 'oklch(0.55 0.15 30)'}}>
                          <LinkedInIcon />
                        </a>
                      )}
                      {m.twitter && (
                        <a href={m.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{background: 'rgba(100,60,30,0.1)', color: 'oklch(0.55 0.15 30)'}}>
                          <TwitterIcon />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed line-clamp-5" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOARD OF ADVISORS ═══ */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="absolute -bottom-32 -right-32 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none" style={{background: 'oklch(0.55 0.15 30)', filter: 'blur(80px)'}} />
        <div className="absolute top-10 -left-20 w-[180px] h-[180px] rounded-full opacity-15 pointer-events-none" style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-12" style={{fontFamily: 'var(--font-display)'}}>
            Board of <span style={{color: 'oklch(0.55 0.15 30)'}}>Advisors</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayAdvisors.map((m) => (
              <div key={m.name} className="bg-white rounded-xl overflow-hidden border border-black/5">
                {m.img ? (
                  <div className="h-56 overflow-hidden flex items-center justify-center" style={{background: 'oklch(0.92 0.01 80)'}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.img} alt={m.name} className="w-full h-full object-contain" loading="lazy" />
                  </div>
                ) : (
                  <div className="h-56 flex items-center justify-center" style={{background: 'oklch(0.92 0.01 80)'}}>
                    <span className="text-4xl font-bold" style={{color: 'rgba(100,60,30,0.2)', fontFamily: 'var(--font-display)'}}>
                      {m.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold" style={{fontFamily: 'var(--font-display)'}}>{m.name}</h3>
                      <p className="text-xs mt-0.5 font-semibold" style={{color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}>{m.role}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0 mt-0.5">
                      {m.linkedin && (
                        <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full flex items-center justify-center transition-colors" style={{background: 'rgba(100,60,30,0.1)', color: 'oklch(0.55 0.15 30)'}}>
                          <LinkedInIcon />
                        </a>
                      )}
                      {m.twitter && (
                        <a href={m.twitter} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full flex items-center justify-center transition-colors" style={{background: 'rgba(100,60,30,0.1)', color: 'oklch(0.55 0.15 30)'}}>
                          <TwitterIcon />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed line-clamp-4" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>{m.bio}</p>
                  {m.whyAdvise && (
                    <div className="mt-3 p-3 rounded-lg border" style={{background: 'linear-gradient(135deg, rgba(100,60,30,0.05), rgba(211,171,76,0.05))', borderColor: 'rgba(100,60,30,0.1)'}}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}>Why I Advise RampRate</p>
                      <p className="text-[11px] leading-relaxed italic" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>&ldquo;{m.whyAdvise}&rdquo;</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/impactsoul"
              className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
              style={{color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-body)'}}
            >
              See our ImpactSoul advisor network
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CONCENTRIC MODEL ═══ */}
      <section className="relative section-dark overflow-hidden py-20 sm:py-28">
        <div className="absolute -top-40 -right-40 w-[350px] h-[350px] rounded-full opacity-20 pointer-events-none" style={{background: 'oklch(0.55 0.22 260)', filter: 'blur(80px)'}} />
        <div className="absolute bottom-20 -left-20 w-[200px] h-[200px] rounded-full opacity-15 pointer-events-none" style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12" style={{fontFamily: 'var(--font-display)'}}>
            The <span style={{color: 'oklch(0.55 0.15 30)'}}>Concentric</span> Model
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {ring: 'Core', count: '5 Principals', desc: 'Tony Greenberg, Alex Veytsel, Josh Bykowski, Rob Holmes, and Jeff Alinsangan. 24 years of shared history, complementary expertise, and a combined network spanning every major technology vendor and enterprise buyer.'},
              {ring: 'Board', count: '10 Advisors', desc: 'Stuart Newton (Deloitte), Gulliver Smithers (Sony), Purvee Kondal (Sephora), Curt Hessler (US Treasury), Barry Patmore (Accenture), Peter Gross (Bloom Energy), Peter Hirshberg (Apple), Joe Weinman (Cloudonomics), Sandy Climan (CAA/Universal), Tyler Kolodney.'},
              {ring: 'Bench', count: '35+ Specialists', desc: 'Deep technical experts in specific domains — from cloud architecture to telecom pricing to blockchain security to ESG measurement. Activated on-demand for specific engagements. Fortune 500 alumni. Davos, YPO, Summit, Hatch, XPRIZE, Aspen.'},
            ].map((r) => (
              <div key={r.ring} className="rounded-xl p-7 border text-center" style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}>
                <div className="text-3xl font-bold mb-2" style={{color: 'oklch(0.55 0.15 30)', fontFamily: 'var(--font-display)'}}>{r.ring}</div>
                <div className="text-sm mb-4" style={{color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)'}}>{r.count}</div>
                <p className="text-sm leading-relaxed" style={{color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)'}}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VALUES ═══ */}
      <section className="relative section-warm overflow-hidden py-20 sm:py-28">
        <div className="absolute -bottom-32 -right-32 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none" style={{background: 'oklch(0.55 0.15 30)', filter: 'blur(80px)'}} />
        <div className="absolute top-10 -left-20 w-[180px] h-[180px] rounded-full opacity-15 pointer-events-none" style={{background: 'oklch(0.82 0.15 75)', filter: 'blur(80px)'}} />

        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{fontFamily: 'var(--font-display)'}}>
            Our <span style={{color: 'oklch(0.55 0.15 30)'}}>Values</span> &amp; Principles
          </h2>
          <p className="text-base mb-10 max-w-2xl" style={{color: 'oklch(0.45 0.02 50)', fontFamily: 'var(--font-body)'}}>
            We build an ecosystem of impact-preneurs and trailblazers powered by opportunities, resources, innovation and human spirit.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-black/5 shadow-sm">
                <p className="text-sm leading-relaxed" style={{color: 'oklch(0.4 0.02 50)', fontFamily: 'var(--font-body)'}}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 sm:py-20" style={{background: 'oklch(0.55 0.15 30)'}}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{fontFamily: 'var(--font-display)'}}>
            Trust Us With What You Hate to Do
          </h2>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{fontFamily: 'var(--font-body)'}}>
            And focus on the change you want to create in the world.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold bg-white transition-all hover:bg-white/90 shadow-lg"
            style={{color: 'oklch(0.35 0.1 30)', fontFamily: 'var(--font-body)'}}
          >
            Start a Conversation
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>
    </>
  )
}
