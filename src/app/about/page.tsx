import Link from 'next/link'
import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'About | RampRate',
  description:
    'RampRate is a global advisory firm founded in 2000. Impact and technology-focused advisor for enterprise and startups.',
}

const coreTeam = [
  {
    name: 'Tony Greenberg',
    role: 'Founder & CEO',
    img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/EtSyoZsiJamreUAA.png',
    bio: '25+ years. Helped take Exodus Communications public (revenue $5M to $600M). Founded RampRate in 2000. 250+ enterprise clients including Microsoft, eBay, Nike, Sony, CBS, Intel, Hearst. 75+ strategy/sourcing projects for Microsoft alone. Investor/advisor to 25+ impact startups across blockchain, psychedelic medicine, healthcare. Emissary to Bhutan\'s Gross National Happiness Centre. Speaker at Harvard, USC. Published in Forbes, Business Insider, HuffPost.',
    linkedin: 'https://www.linkedin.com/in/tonygreenberg',
    twitter: 'https://x.com/thinktony',
  },
  {
    name: 'Alex Veytsel',
    role: 'Co-Founder & CSO',
    img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/YWxJJXOzOBUuHshp.png',
    bio: 'Expert in digital media business models, revenue streams, and technical infrastructure. Business planning and strategy advisor to Microsoft, Sony, Intel on value chain mapping, partner strategies, and pioneering business models. Joined RampRate 2004. Helped both major TV networks (NBC, Fox) and industry pioneers (iFilm, Audible) reduce costs, improve performance, and reinvest negotiated savings.',
    linkedin: 'https://www.linkedin.com/in/aveytsel',
    twitter: null,
  },
  {
    name: 'Josh Bykowski',
    role: 'Corporate Development & Legal',
    img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/aZCBGfwJAwMiioqX.png',
    bio: 'Licensed US attorney. M&A advisory, data privacy, IP, emerging technologies. Expertise in blockchain technology and role as a Voting Associate for a decentralized organization with over $250 million AUM. Recognized by Columbia Law School\'s Blog on Corporations and Capital Markets.',
    linkedin: 'https://www.linkedin.com/in/josh-bykowski-b445211b5',
    twitter: null,
  },
  {
    name: 'Rob Holmes',
    role: 'Web3 & Grants Manager, ImpactSoul',
    img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/olBFuRMEniuQAaTo.png',
    bio: 'Web3 strategist and business development advisor. Over seven years in the space helping founders, protocols, and ecosystems bridge crypto and the physical world — focusing on tokenized infrastructure, DePIN, clean energy, and real-world asset (RWA) integration.',
    linkedin: 'https://www.linkedin.com/in/rob-holmes-7a479016',
    twitter: null,
  },
  {
    name: 'Jeff Alinsangan',
    role: 'Operations',
    img: null,
    bio: 'Leads operations at RampRate, ensuring the firm\'s advisory engagements run with precision and efficiency across all four practice areas.',
    linkedin: 'https://www.linkedin.com/in/jeff-alinsangan-b3bb78',
    twitter: null,
  },
]

const boardAdvisors = [
  {
    name: 'Stuart Newton',
    role: 'Strategic Advisor',
    img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/iyZuFkUvbFZRaLIv.png',
    bio: 'Recently retired from Deloitte where he led business development nationally for the Blockchain and Digital Asset Practice. Portfolio Success Leader for select private equity firms. Co-founder of Abundant Village.',
    whyAdvise: 'RampRate operates at the intersection of blockchain and enterprise trust — exactly where the next decade of value creation lives. I advise because they don\'t just talk about transformation, they broker it.',
    linkedin: 'https://pr.linkedin.com/in/stuartnewton',
    twitter: null,
  },
  {
    name: 'Gulliver Smithers',
    role: 'ex-CTO Sony D2C',
    img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/kKJJUsyZjjyWxRiZ.png',
    bio: 'Product-oriented CTO with over 20 years across media. Previously CTO at Sony D2C, VP of Product at the BBC, CTO at Base79 (successful exit), and Director of On-Demand at ITV.',
    whyAdvise: 'Having built streaming platforms at Sony and the BBC, I know how rare it is to find advisors who understand both the technology and the business model. RampRate does both.',
    linkedin: 'https://uk.linkedin.com/in/gulliversmithers',
    twitter: 'https://x.com/GulliverSmither',
  },
  {
    name: 'Purvee Kondal',
    role: 'VP Sephora, Global Procurement',
    img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/YSxTQFUJHlUuFtlE.png',
    bio: 'Vice President at SEPHORA, Global Procurement Officer. Over 15 years at J&J, GE, Capgemini, Ross Stores, Globality, and Albertsons. MBA from Kellogg at Northwestern University.',
    whyAdvise: 'Procurement at the enterprise level is a battlefield of information asymmetry. RampRate levels that field with data nobody else has. That\'s why I\'m here — they make procurement honest.',
    linkedin: 'https://www.linkedin.com/in/purveek',
    twitter: null,
  },
  {
    name: 'Curt Hessler',
    role: 'ex-Asst. Secretary of Treasury',
    img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/CLTxUwdWDeYNuRdP.png',
    bio: 'Served as Assistant Secretary of the Treasury for Economic Policy. Senior positions at Unisys and Times-Mirror Group. Rhodes Scholar. Harvard BA, Yale Law JD, UC Berkeley MA in Economics.',
    whyAdvise: 'RampRate brings the same rigor I demanded at Treasury — data-driven, conflict-free, and accountable to outcomes, not hours billed.',
    linkedin: 'https://www.linkedin.com/in/curt-hessler-a3682b3a',
    twitter: null,
  },
  {
    name: 'Barry Patmore',
    role: '34yr Accenture Partner',
    img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/gyKtcYcxpmXoEpQB.png',
    bio: 'Distinguished 34-year career at Accenture. Clients included Microsoft, Disney, Visa, JPL. Managing partner of Pacific Northwest and Southern California offices.',
    whyAdvise: 'After 34 years at Accenture, I know what consulting should be. RampRate is what it should be — principals who execute, not associates who present.',
    linkedin: 'https://www.linkedin.com/in/barry-patmore-8188b526',
    twitter: null,
  },
  {
    name: 'Peter Gross',
    role: 'VP Bloom Energy',
    img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/KnqUilgCDpoTOQMX.png',
    bio: 'Former CEO EYP Mission Critical Facilities. Data center strategic planning, design, operations. VP at Bloom Energy with deep expertise in sustainable energy infrastructure.',
    whyAdvise: 'Infrastructure decisions are permanent and expensive. RampRate\'s SPY Index gives enterprises the data to make those decisions right the first time.',
    linkedin: 'https://www.linkedin.com/in/petrgross',
    twitter: null,
  },
  {
    name: 'Peter Hirshberg',
    role: 'ex-Apple, $1B Enterprise Revenue',
    img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/wCigzGydvwbnZpVw.png',
    bio: '9 years at Apple, grew enterprise revenue to $1B annually. Chairman of Technorati. Co-founder and chairman of The Conversation Group. Clients included AOL, Microsoft, NBC, Estee Lauder.',
    whyAdvise: 'RampRate has 25 years of compounded trust with the world\'s most important buyers. That\'s irreplaceable.',
    linkedin: 'https://www.linkedin.com/in/hirshberg',
    twitter: 'https://x.com/hirshberg',
  },
  {
    name: 'Joe Weinman',
    role: 'Author, Cloudonomics',
    img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/uuVlUAhjtxyNCxXB.png',
    bio: 'Author of "Cloudonomics: The Business Value of Cloud Computing" (Wiley). Awarded 20 U.S. and international patents. Senior executive at Telx, AT&T, Bell Labs, and Hewlett Packard.',
    whyAdvise: 'I wrote the book on cloud economics. RampRate lives it — they have the only dataset that can tell you what cloud infrastructure actually costs versus what vendors claim.',
    linkedin: 'https://www.linkedin.com/in/joeweinman',
    twitter: 'https://x.com/joeweinman',
  },
  {
    name: 'Sandy Climan',
    role: 'ex-CAA / Universal Studios',
    img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/XzkRpmGIMlRHdLfQ.png',
    bio: 'CEO of Entertainment Media Ventures. Senior management at Creative Artists Agency. EVP and President of Worldwide Business Development for Universal Studios. Producer of "The Aviator."',
    whyAdvise: 'RampRate understands deal architecture the way CAA understands talent — they structure outcomes where everyone wins, and that\'s why the relationships last decades.',
    linkedin: 'https://www.linkedin.com/in/sandycliman',
    twitter: 'https://x.com/ClimanSandy',
  },
  {
    name: 'Tyler Kolodney',
    role: 'ex-Baltimore Orioles',
    img: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/neoMXOKFotRSwfyT.png',
    bio: 'Former executive with the Baltimore Orioles organization, bringing sports industry expertise and business development acumen to RampRate\'s advisory board.',
    whyAdvise: 'Sports teaches you that winning is about preparation, not luck. RampRate prepares their clients with intelligence that turns negotiations from coin flips into calculated advantages.',
    linkedin: 'https://www.linkedin.com/in/tyler-kolodny-451522192',
    twitter: 'https://x.com/kolodnytyler',
  },
]

const values = [
  'We serve others — we provide the tools they need, and together we build their future and dreams.',
  'We choose who we work with — we forge a bond through shared values with those who are innovative, inspiring, impact-focused change agents.',
  'We deal in rationality and pragmatism — hope is not a strategy; anecdotes are not data; inputs are not impacts.',
  'We dream big — rationality and audacity are not mutually exclusive. We partner with inspirational leaders and unravel the world\'s greatest challenges together.',
  'We support execution — we not only recommend the course of action, but back our recommendations with the work required to implement them successfully.',
  'We earn trust — we follow through on our commitments, and require our partners and anyone we vouch for to do likewise.',
  'We overdeliver on our promises — we are resourceful and our effort is only bound by what benefits our client.',
  'We support diversity, equity, and inclusion — for powerful change to happen, people with a variety of lived experiences come together to form creative and productive teams.',
  'We are engines of transparency — we raise the bar on each ecosystem we touch by shining the light on greenwashing, corruption, and self-dealing.',
  'We believe in the transformational power of technology and innovation — that new impact-focused approaches in tech, health, and crypto should be embraced even through creative destruction.',
  'Not all that is new is better — rigorous evaluation and audit of every technology, tokenomics, therapy.',
  'We build an ecosystem of impact-preneurs and trailblazers powered by opportunities, resources, innovation, and human spirit.',
]

const timeline = [
  {year: '2000', event: 'RampRate founded. IT sourcing advisory begins.'},
  {year: '2004', event: 'Alex Veytsel joins as CSO. Enterprise client roster grows to include Sony, Microsoft, Intel.'},
  {year: '2010', event: '$10B+ in IT decisions brokered. Offices in Santa Monica and East Coast.'},
  {year: '2015', event: 'Stratum launched — bridging Web3 and enterprise.'},
  {year: '2018', event: 'Syzygy launched — growth advisory for founders and impactpreneurs.'},
  {year: '2022', event: 'RampRate at Davos / World Economic Forum. DevXDAO + XPRIZE €4M grant.'},
  {year: '2023', event: 'B Corp certified. $24B+ in cumulative decisions brokered.'},
  {year: '2024', event: 'ImpactSoul launched — tokenizing cultural treasures for impact movements.'},
  {year: '2026', event: 'Four brands. One coalition. 50+ countries. The purpose-driven economy is here.'},
]

const corporateFacts = [
  {label: 'Founded', value: '2000'},
  {label: 'Structure', value: 'Private & self-funded, profitable since birth'},
  {label: 'HQ', value: 'Santa Monica, CA'},
  {label: 'EU HQ', value: 'Ibiza, Spain'},
  {label: 'Additional Offices', value: 'Massachusetts, North Carolina, Florida'},
  {label: 'IT Deals', value: '200+ locations, 50+ countries'},
  {label: 'Certification', value: 'B Corp Certified'},
]

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

export default function AboutPage() {
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
            {coreTeam.map((m) => (
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
            {boardAdvisors.map((m) => (
              <div key={m.name} className="bg-white rounded-xl overflow-hidden border border-black/5">
                {m.img ? (
                  <div className="h-44 overflow-hidden" style={{background: 'oklch(0.92 0.01 80)'}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.img} alt={m.name} className="w-full h-full object-cover" style={{objectPosition: 'center 20%'}} loading="lazy" />
                  </div>
                ) : (
                  <div className="h-44 flex items-center justify-center" style={{background: 'oklch(0.92 0.01 80)'}}>
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
