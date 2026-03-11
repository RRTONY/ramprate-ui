'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

const caseStudies = [
  { title: "Fortune 50 Financial Services", result: "$13M saved", metrics: ["26% cost reduction", "74% SLA increase", "7 data centers benchmarked"], desc: "Benchmarked 7 data centers plus cloud and managed services. Cut costs 26%, increased SLAs 74%, saved $13M through mid-contract negotiation." },
  { title: "Fortune 20 Software", result: "14 engagements / 4 years", metrics: ["All divisions benchmarked", "Chargeback model restructured", "Retention through data"], desc: "14 engagements over 4 years. Benchmarked all divisions. Restructured internal chargeback model. Recruited and retained divisions through data-driven presentations." },
  { title: "Fortune 50 Integrator", result: "7 engagements / 3 years", metrics: ["7–20+ countries benchmarked", "Gap analysis", "Cost driver projections"], desc: "7 engagements over 3 years. Global benchmarks across 7–20+ countries. Quantified market rates, gap analysis, rapid supplier identification, cost driver projections." },
  { title: "Fortune 50 Software — 358 Vendors", result: "34% cost cut, 21% SLA gain", metrics: ["358 vendors benchmarked", "Full SPY Index analysis", "Chargeback restructured"], desc: "Full SPY Index benchmark of 358 external IT providers. Analyzed costs, SLAs, contract terms, bundling, list vs. actual prices. Cut costs 34%, increased SLAs 21%." },
  { title: "Top Movie Studio", result: "$13M+/year saved", metrics: ["26% reduction potential", "64% SLA increase", "Shared services optimized"], desc: "Examined relationship with corporate parent's internal services. Found 26% reduction potential. Increased SLAs 64%. Saved $13M+/year from shared services bill." },
  { title: "Startup Radio Station", result: "Pre-launch CDN procurement", metrics: ["Months before launch", "Right-fit infrastructure", "Innovative model supported"], desc: "Pre-launch CDN procurement. RampRate procured content delivery services months before service launch. Innovative business model supported with right-fit infrastructure." },
  { title: "CDN Market Research", result: "44 CDN buyers interviewed", metrics: ["Executive Brief published", "Pricing intelligence", "Supplier capabilities mapped"], desc: "Interviewed 44 CDN buyers. Published industry-leading Executive Brief 'Sourcing CDN Services' with pricing, market dynamics, and supplier capabilities." },
]

const testimonials: { quote: string; name: string; title: string; company: string; tier: 'principal' | 'firm'; tag: string }[] = [
  { quote: "Since engaging them they have helped me significantly reduce my cost structure through several major outsourcing deals worth deep 8 figures. Hard work, diligence and attention to detail are phenomenal. They made me look like a hero to my executive management. They are a secret weapon.", name: "Peter Borner", title: "Former Head of IT", company: "Sony Music", tier: "firm", tag: "Enterprise" },
  { quote: "Tony operates on a level very few can hope to reach. His experience working with C-Suite execs across Fortune 100 and startups alike is hard to come by. The breadth and depth of his network is unparalleled.", name: "Executive Recommendation", title: "", company: "", tier: "principal", tag: "Enterprise" },
  { quote: "For over 16 years, Tony and his team helped my companies understand the differences between suppliers. They saved us millions, created agility and new budget out of thin air with each engagement. A secret weapon in my toolbox for truth, transparency, and actionable direction.", name: "Phil Wiser", title: "EVP & CTO", company: "ViacomCBS", tier: "firm", tag: "Media" },
  { quote: "Risk-free proposition money-wise. If they didn't save or create us at least twice their initial fee we'd get a full refund. When they said they could carve out 27% savings, I thought it was impossible without undermining key relationships. Tony and his team hit that number and the relationships are stronger than ever.", name: "Paul Santana", title: "Manager of Data Center Operations", company: "eBay", tier: "firm", tag: "Enterprise" },
  { quote: "Tony is uniquely qualified to do exactly what he does best. Tuned in to what would improve the impact of his clients and partners. He listens for when opportunities align, and powerfully connects dots to make magic happen. His commitment to positive social impact through business is both real and admirable.", name: "Executive Recommendation", title: "", company: "", tier: "principal", tag: "Enterprise" },
  { quote: "Tony and his team are my most reliable global resource, ready to perform at a moment's notice. Inside knowledge and ability to handle high-level complex negotiations helped us move fast. They made scaling easier.", name: "Paul Sams", title: "COO", company: "Blizzard Entertainment", tier: "firm", tag: "Gaming" },
  { quote: "Tony Greenberg individually has made a most significant difference in the trajectory of my decade-long journey as an entrepreneur. Tony's network allows almost instantaneous connectivity at the highest level with significant yield across industries. Unparalleled ability to screen deals and bring out long-term success at the highest ethical standards.", name: "Wulf Kaal", title: "Entrepreneur & Co-Founder", company: "Menagerie", tier: "principal", tag: "Blockchain" },
  { quote: "The deal Tony and his team got for the Walt Disney Internet Group was one of the best deals in IT services I saw during my tenure at Disney. No hurdle or objection they did not address quickly and completely. Always looking for a win-win.", name: "Robert Gonsalves", title: "Former Director of Production Operations", company: "Warner Bros. Online / Walt Disney", tier: "firm", tag: "Media" },
  { quote: "Tony and his team helped us cut the clutter, gain insight, and distill our team's thoughts for over 50 digital media, IT, and product studies. Their access to global top-level executives, granular bottom-up approach, and understanding of our corporate strategy differentiate their offering.", name: "Gary Share", title: "Windows Marketing and Product", company: "Microsoft", tier: "firm", tag: "Enterprise" },
  { quote: "I've known Tony for in excess of 10 years. An amazingly talented entrepreneur who understands media, IT & infrastructure like no one I've ever met. I would recommend either he or his firm unequivocally for business planning, scale, or cost containment. Globally astute consummate analysts and deal pros extraordinaire.", name: "Richard Titus", title: "EVP BBC, Managing Director Razorfish LA", company: "BBC / Razorfish", tier: "principal", tag: "Media" },
  { quote: "Each time Tony and his team saved significant time in negotiating and closing contracts, providing at least 20 if not 40% savings over what we could have done alone. Cut processes in half. Extremely knowledgeable, always bringing innovation and out-of-the-box thinking.", name: "Michael Montalto", title: "Consultant", company: "Accenture", tier: "firm", tag: "Enterprise" },
  { quote: "Under-promised and over-delivered for more than 4 years. Tony and his team are our daily go-to for each step toward our vision. They paid for themselves by accelerating our growth by years and remain a vital resource.", name: "Kipras Kazlauskas", title: "Co-Founder", company: "Syntropy", tier: "firm", tag: "Blockchain" },
  { quote: "Tony and his team are very well connected in the global high-tech community. He runs a great organization that is well thought of, especially in media, gaming, IT, and blockchain. A generous giver of his time and energy to worthy causes, driving impact to become measurable, attainable, and reportable.", name: "William Quigley", title: "Managing Director", company: "WAX / Clearstone Venture Partners / Idealab", tier: "principal", tag: "Blockchain" },
  { quote: "Within 30 hours of our decision, we were fully installed and up and running. Tony and his team not only saved an incredible amount of time, resources, and money, but we know we have the best possible solution now and far beyond.", name: "Ian Rodgers", title: "CEO Beats Music, GM Yahoo Music", company: "Beats Music (acquired by Apple)", tier: "firm", tag: "Media" },
  { quote: "Tony and his team helped us understand the differences between suppliers, build strong new partnerships, and reduced our monthly expenditure by over 75%. Using RampRate is one of the smartest moves a business-minded CTO can make.", name: "Blair Harrison", title: "CEO", company: "Frequency (formerly Viacom)", tier: "firm", tag: "Media" },
  { quote: "Keeping us focused, educating us on our options, identifying well-qualified suppliers, and operating under tight deadlines — all things Tony and his team did exceptionally well. Uniquely rare data and a solid practice. They opened my eyes to the possibilities of outsourcing on a broader scale.", name: "Todd Miller", title: "CIO", company: "SF Chronicle – Hearst Corp", tier: "firm", tag: "Media" },
  { quote: "Had already received quotes from four top-tier providers. Tony and his team brought in two others, had all re-quote, and lowered prices 17-36%. Achieved breakthrough innovative SLA coverage. WOW is the best I can say.", name: "Charles Butler", title: "Director of Network Operations", company: "AOL", tier: "firm", tag: "Enterprise" },
  { quote: "In a field filled with prognosticators who claim to know the next great thing, Tony and his team apply sound business judgment and analytics to assist senior management in making crucial, time-sensitive decisions.", name: "Jay Samit", title: "Former EVP", company: "Sony Corporation of America", tier: "principal", tag: "Media" },
  { quote: "Tony and his team handled our project with utmost professionalism and requisite confidentiality. Saved us over 40% and months of due diligence. I intend on using RampRate again.", name: "Andrew Robbins", title: "Vice President of New Media", company: "Miramax", tier: "firm", tag: "Media" },
  { quote: "Game-changing. Within just a couple of months, Tony and his team expanded our reach beyond what we thought was possible. RampRate's experience navigating telecom and cloud industries is an invaluable asset.", name: "Domantas Jaskunas", title: "Co-Founder", company: "Syntropy", tier: "firm", tag: "Blockchain" },
  { quote: "I knew I was leaving a bit on the table in our outsourced contracts. We can count on Tony and his team to be precise, timely, and create millions in value. No-nonsense, data-driven, and responsive to a T.", name: "Dean Nelson", title: "VP Global Foundation Services", company: "eBay", tier: "firm", tag: "Enterprise" },
  { quote: "Adaptable. Tony and his team stayed on schedule and within price dozens of times across hundreds of millions in spend. Always saved us tremendous time and money.", name: "Rich Lappenbusch", title: "Executive", company: "Microsoft", tier: "firm", tag: "Enterprise" },
  { quote: "Intel — and three other firms I worked at — engaged Tony and his team. They provided valuable and highly targeted research, truly understanding our project needs, timeline, and budget. RampRate defines professionalism and runs a world-class team.", name: "Ron Vaisbort", title: "Executive", company: "Intel / Blackberry / Ivalua", tier: "firm", tag: "Enterprise" },
  { quote: "Tony and his team were adaptable, brilliant, and innovative. Stayed on schedule, within price. We saved millions.", name: "Niles Triget", title: "Executive", company: "Thomson Reuters / Delphion", tier: "firm", tag: "Finance" },
  { quote: "In a league of its own when it comes to matching solutions with clients. Tony and his team's ability to understand what clients need often outpaces even the clients' own understanding.", name: "Kevin Shively", title: "Executive Director", company: "International Webcasting Association", tier: "firm", tag: "Media" },
  { quote: "I have always considered Tony and his team a trusted advisor when it comes to digital entertainment services. RampRate combines a unique approach with consulting professionals who deliver results.", name: "Geoff Campbell", title: "Former VP", company: "Sony Corporation of America", tier: "firm", tag: "Media" },
  { quote: "Tony and his team's comprehensive, organized expert approach to assessing our needs allowed us to complete this process in record time.", name: "Michael Whelan", title: "CIO", company: "Primedia / MSNBC", tier: "firm", tag: "Media" },
  { quote: "Tony and his team simply got us better pricing and better SLA protections than we got for ourselves!", name: "Ryan Hughes", title: "Network Operations", company: "National Hockey League", tier: "firm", tag: "Gaming" },
  { quote: "Tony and his team are out-of-the-box thinkers and are extremely professional. The caliber of their teams is excellent.", name: "Isabel Maxwell", title: "Entrepreneur at Large", company: "", tier: "firm", tag: "Enterprise" },
  { quote: "When we receive a RampRate RFP it is professionally prepared and provides the information required for WTG to provide a quality proposal.", name: "Stacey McCormick", title: "Director of Sales", company: "World Telecom Group", tier: "firm", tag: "Enterprise" },
]

const clientLogoImages = [
  { name: "Sony", src: "https://ramprate.com/wp-content/uploads/Sony-Corporation1.png" },
  { name: "Microsoft", src: "https://ramprate.com/wp-content/uploads/28413-3-microsoft-logo-transparent-background-1-300x110.png" },
  { name: "eBay", src: "https://ramprate.com/wp-content/uploads/eBay.png" },
  { name: "Intel", src: "https://ramprate.com/wp-content/uploads/Intel-logo-300x169.png" },
  { name: "Hearst", src: "https://ramprate.com/wp-content/uploads/hearstcorporation.jpg" },
  { name: "Accenture", src: "https://ramprate.com/wp-content/uploads/Accenture.jpg" },
  { name: "Blizzard", src: "https://ramprate.com/wp-content/uploads/blizzard1.jpg" },
  { name: "Clearstone", src: "https://ramprate.com/wp-content/uploads/clearstone.jpg" },
  { name: "Syntropy", src: "https://ramprate.com/wp-content/uploads/SyntropyLogoSmall02-04-21.png" },
  { name: "Menagerie", src: "https://ramprate.com/wp-content/uploads/menagerie-icon-on-left-text-on-right-300x90.jpg" },
  { name: "NHL", src: "https://ramprate.com/wp-content/uploads/NHL-Network.png" },
  { name: "Miramax", src: "https://ramprate.com/wp-content/uploads/Miramax.png" },
  { name: "Warner Bros", src: "https://ramprate.com/wp-content/uploads/Warner-Bros.-Online.png" },
  { name: "Viacom", src: "https://ramprate.com/wp-content/uploads/Viacom.png" },
  { name: "World Telecom Group", src: "https://ramprate.com/wp-content/uploads/World-Telecom-Group.png" },
  { name: "IWA", src: "https://ramprate.com/wp-content/uploads/International-Webcasting-Association.png" },
]

const additionalClients = ["Nike", "Goldman Sachs", "McKinsey", "PayPal", "Disney", "Fox", "Thomson Reuters", "Primedia", "MSNBC", "BBC", "Beats Music", "AOL", "Razorfish"]

const boardMembers = [
  { name: "Stuart Newton", role: "ex-Deloitte Blockchain", img: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/ILlNmwvCsckXBqPO.jpg", linkedin: "https://pr.linkedin.com/in/stuartnewton" },
  { name: "Gulliver Smithers", role: "ex-CTO Sony", img: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/eUVmQqArMuCNZtXr.png", linkedin: "https://uk.linkedin.com/in/gulliversmithers" },
  { name: "Purvee Kondal", role: "VP Sephora", img: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/DmFFlqTRTIEZwtwI.webp", linkedin: "https://www.linkedin.com/in/purveek" },
  { name: "Curt Hessler", role: "ex-Treasury / Rhodes Scholar", img: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/YLsgxbxwspMjUSdw.png", linkedin: "https://www.linkedin.com/in/curt-hessler-a3682b3a" },
  { name: "Barry Patmore", role: "34yr Accenture", img: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/yOBAXZZhcHZhmOMj.png", linkedin: "https://www.linkedin.com/in/barry-patmore-8188b526" },
  { name: "Peter Gross", role: "VP Bloom Energy", img: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/kkqxDucjDNUUXIpQ.png", linkedin: "https://www.linkedin.com/in/petrgross" },
  { name: "Peter Hirshberg", role: "ex-Apple $1B", img: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/QmgSWAnZPqduAHKb.png", linkedin: "https://www.linkedin.com/in/hirshberg" },
  { name: "Joe Weinman", role: "Cloudonomics", img: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/OXBRrCfquIfGdqNH.png", linkedin: "https://www.linkedin.com/in/joeweinman" },
  { name: "Sandy Climan", role: "ex-CAA / Universal", img: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/jeEhGYbagnzDkfJe.jpg", linkedin: "https://www.linkedin.com/in/sandycliman" },
  { name: "Tyler Kolodney", role: "ex-Orioles", img: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663242884547/UVyoiPewtvstKrsa.jpg", linkedin: "https://www.linkedin.com/in/tyler-kolodny-451522192" },
]

const testimonialSocials: Record<string, { linkedin?: string; twitter?: string }> = {
  "Kevin Shively": { linkedin: "https://www.linkedin.com/in/kevinshively", twitter: "https://x.com/shiveman" },
  "Rich Lappenbusch": { linkedin: "https://www.linkedin.com/in/richlappenbusch", twitter: "https://x.com/richlap" },
  "Richard Titus": { linkedin: "https://www.linkedin.com/in/rxdxt", twitter: "https://x.com/richardtitus" },
  "Blair Harrison": { linkedin: "https://www.linkedin.com/in/theblairharrison", twitter: "https://x.com/blairharrison" },
}

const confidentialTestimonials = [
  { quote: "We brought RampRate in to validate what we thought was an optimized infrastructure spend. Within six weeks, they found $14M in annual savings we didn't know existed — without changing a single vendor relationship. What surprised us wasn't the number. It was that they understood our internal politics well enough to structure the savings so every division head felt like they won. That's not sourcing. That's organizational intelligence.", attribution: "SVP, Global Infrastructure · Fortune 100 Technology Company", division: "RampRate" },
  { quote: "We were two founders with a working product and no idea how to get Fortune 500 companies to return our emails. Tony's team didn't just open doors — they sat in the room with us, reframed our pitch in real time, and closed our first enterprise pilot in 11 days. That pilot became our Series B story. We went from interesting technology to investable company in one quarter.", attribution: "Co-Founder & CEO · Network Infrastructure Startup, Series B", division: "Syzygy" },
  { quote: "We've used RampRate across three CTO transitions and two corporate restructurings over 12 years. They're the only external advisor who survived every regime change — because each new CTO independently concluded they were indispensable. The institutional knowledge they carry about our infrastructure is deeper than most of our own internal teams. They've saved us eight figures cumulatively, but what I value most is that they've never once leaked a number, a name, or a strategy to anyone.", attribution: "CTO · Global Media & Entertainment Corporation", division: "RampRate" },
  { quote: "Most advisors in our space either understand enterprise or understand blockchain. They found us enterprise partners who actually understood what we were building — not just executives who wanted a blockchain slide in their board deck. Within 90 days we had three paid pilots with companies whose names would break our NDA if I mentioned them.", attribution: "CTO · Layer 1 Blockchain Protocol", division: "Stratum" },
  { quote: "We were sitting on a collection worth tens of millions with no way to monetize it without selling pieces we'd spent decades acquiring. ImpactSoul designed a tokenization structure that let us retain full ownership while creating a revenue stream we never thought possible. They spent two hours understanding the cultural significance of what we held before they ever mentioned a number. That's when we knew.", attribution: "Director · Private Cultural Foundation, Latin America", division: "ImpactSoul" },
  { quote: "I've worked with Gartner, McKinsey, and two boutique sourcing firms. RampRate is the only one that put their fee at risk. They guaranteed twice their cost in savings or we'd get a refund. I thought it was a gimmick until they delivered 31% — six points above their own projection. Every recommendation came with a number, a timeline, and a name. No hand-waving.", attribution: "VP, Technology Operations · Fortune 500 E-Commerce Platform", division: "RampRate" },
  { quote: "We were burning runway trying to figure out US market entry on our own. RampRate's growth team restructured our go-to-market, connected us with two clinical validation partners, and helped us close a strategic investment — all in five months. They pushed back on three term sheets that would have diluted us unnecessarily. Their incentive was aligned with ours because they took equity, not cash.", attribution: "Founder & CEO · Health Technology Startup, Seed to Series A", division: "Syzygy" },
  { quote: "Our board kept asking: where's the enterprise revenue? We had a working protocol but no bridge to the companies that actually needed it. RampRate's Stratum team understood both worlds — they translated our technology into language that procurement teams and CTOs could evaluate. Two of the four enterprise deals we closed that year came directly through their network, and those deals are still active three years later.", attribution: "CEO · Decentralized Infrastructure Company", division: "Stratum" },
  { quote: "We'd been told by three consulting firms that our project was unbankable — too much social impact, not enough return profile. ImpactSoul restructured the tokenization model so the impact metrics became the value driver, not the cost center. Investors who wouldn't take our call six months earlier started reaching out to us. They built a financial instrument around our mission without asking us to compromise it.", attribution: "Executive Director · Regenerative Development NGO", division: "ImpactSoul" },
  { quote: "When you're scaling infrastructure for millions of concurrent users across four continents, you can't afford a sourcing advisor who needs a week to understand your architecture. RampRate was already fluent in our stack before the first call. They renegotiated our CDN and hosting contracts in three weeks — not three months — and the savings funded our entire Asia-Pacific expansion. They move at game speed, not consulting speed.", attribution: "VP Engineering · Major Interactive Entertainment Company", division: "RampRate" },
]

const CATEGORIES = ["All", "Enterprise", "Media", "Blockchain", "Gaming", "Finance"] as const

const divisionColors: Record<string, string> = {
  RampRate: "oklch(0.82 0.15 75)",
  Syzygy: "oklch(0.7 0.2 280)",
  Stratum: "oklch(0.65 0.2 150)",
  ImpactSoul: "oklch(0.7 0.15 30)",
}

export default function ProofPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All")

  const filteredTestimonials = useMemo(() => {
    if (activeFilter === "All") return testimonials
    return testimonials.filter((t) => t.tag === activeFilter)
  }, [activeFilter])

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: testimonials.length }
    testimonials.forEach((t) => { map[t.tag] = (map[t.tag] || 0) + 1 })
    return map
  }, [])

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: 'var(--dark)' }}>
        <div className="glass-orb glass-orb-rust w-[400px] h-[400px] -top-40 -right-40" />
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] bottom-0 -left-32" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.82_0.15_75)] mb-4 block" style={{ fontFamily: 'var(--font-body)' }}>Proof</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              24 Years of{' '}
              <span className="text-[oklch(0.55_0.15_30)]">Trajectory-Changing</span> Results
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-10" style={{ fontFamily: 'var(--font-body)' }}>
              Don't take our word for it. Here's what our clients say about working with RampRate — and why they keep coming back.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { value: "$24B+", label: "Decisions Brokered" },
                { value: "24%", label: "Avg IT Budget Savings" },
                { value: "50+", label: "Countries" },
                { value: "24yrs", label: "Track Record" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4">
                  <div className="text-2xl font-bold text-[oklch(0.82_0.15_75)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</div>
                  <div className="text-xs text-white/50" style={{ fontFamily: 'var(--font-body)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="relative section-warm py-20 sm:py-28 overflow-hidden">
        <div className="glass-orb glass-orb-rust w-[300px] h-[300px] -top-32 -right-32" />
        <div className="glass-orb glass-orb-amber w-[200px] h-[200px] bottom-10 -left-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.55_0.15_30)]" style={{ fontFamily: 'var(--font-body)' }}>Case Studies</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Enterprise-Grade <span className="text-[oklch(0.55_0.15_30)]">Results</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((cs) => (
              <div key={cs.title} className="glass-card-warm p-7 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'oklch(0.55 0.15 30 / 0.1)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.15 30)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                  <h3 className="text-sm font-bold leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{cs.title}</h3>
                </div>
                <div className="mb-4 px-3 py-2 rounded-md" style={{ background: 'oklch(0.55 0.15 30 / 0.08)' }}>
                  <span className="text-sm font-bold text-[oklch(0.45_0.12_30)]" style={{ fontFamily: 'var(--font-mono)' }}>{cs.result}</span>
                </div>
                <p className="text-sm text-[oklch(0.4_0.02_50)] leading-relaxed mb-4" style={{ fontFamily: 'var(--font-body)' }}>{cs.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cs.metrics.map((m) => (
                    <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-[oklch(0.94_0.03_80)] text-[oklch(0.45_0.02_50)] font-medium" style={{ fontFamily: 'var(--font-body)' }}>{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="section-light py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <h3 className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.5_0.02_50)] mb-10" style={{ fontFamily: 'var(--font-body)' }}>
            Trusted by Industry Leaders
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {clientLogoImages.map((logo) => (
              <div key={logo.name} className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} alt={logo.name} className="h-full w-auto object-contain" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8">
            {additionalClients.map((c) => (
              <span key={c} className="text-xs font-medium text-[oklch(0.55_0.02_50)]" style={{ fontFamily: 'var(--font-body)' }}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Board of Advisors */}
      <section className="relative section-dark py-16 sm:py-20 overflow-hidden">
        <div className="glass-orb glass-orb-rust w-[200px] h-[200px] top-0 -left-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-display)' }}>
            Board of <span className="text-[oklch(0.55_0.15_30)]">Advisors</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {boardMembers.map((m) => (
              <div key={m.name} className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white hover:text-[oklch(0.55_0.15_30)] transition-colors" style={{ fontFamily: 'var(--font-body)' }}>{m.name}</a>
                <div className="text-xs text-white/50 mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>{m.role}</div>
                <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex mt-1.5 w-5 h-5 rounded-full items-center justify-center hover:bg-white/20 transition-colors" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-white/60"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B Corp Badge */}
      <section className="section-light py-12">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-5 rounded-xl border border-black/5" style={{ background: 'oklch(0.97 0.01 80)' }}>
            <div className="text-3xl font-bold text-[oklch(0.55_0.15_30)]" style={{ fontFamily: 'var(--font-display)' }}>B</div>
            <div className="text-left">
              <div className="text-sm font-bold" style={{ fontFamily: 'var(--font-body)' }}>Certified B Corporation</div>
              <div className="text-xs text-[oklch(0.5_0.02_50)]" style={{ fontFamily: 'var(--font-body)' }}>Meeting the highest standards of social and environmental performance</div>
            </div>
          </div>
        </div>
      </section>

      {/* 30 Testimonials with filter */}
      <section className="relative section-light py-20 sm:py-28 overflow-hidden">
        <div className="glass-orb glass-orb-amber w-[300px] h-[300px] -bottom-32 -left-32" />
        <div className="glass-orb glass-orb-rust w-[180px] h-[180px] top-20 -right-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                What Our <span className="text-[oklch(0.55_0.15_30)]">Clients</span> Say
              </h2>
              <p className="text-sm text-[oklch(0.5_0.02_50)]" style={{ fontFamily: 'var(--font-body)' }}>
                {activeFilter === "All" ? "30 voices. Two decades. One consistent thread: Tony and his team deliver." : `${filteredTestimonials.length} ${activeFilter} testimonials.`}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.5 0.02 50)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`text-[11px] px-3 py-1.5 rounded-full font-semibold tracking-wide transition-all ${
                    activeFilter === cat
                      ? 'text-white shadow-sm'
                      : 'bg-[oklch(0.94_0.03_80)] text-[oklch(0.45_0.02_50)] hover:bg-[oklch(0.90_0.04_60)]'
                  }`}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    ...(activeFilter === cat ? { background: 'oklch(0.55 0.15 30)' } : {}),
                  }}
                >
                  {cat} <span className="opacity-60 ml-0.5">({counts[cat] || 0})</span>
                </button>
              ))}
            </div>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredTestimonials.map((t, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-xl p-7 border hover:shadow-md transition-shadow"
                style={{
                  background: t.tier === 'principal' ? 'oklch(0.97 0.02 30)' : 'oklch(0.97 0.01 80)',
                  borderColor: t.tier === 'principal' ? 'oklch(0.55 0.15 30 / 0.15)' : 'rgba(0,0,0,0.05)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="oklch(0.55 0.15 30 / 0.3)" stroke="none"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[oklch(0.94_0.03_80)] text-[oklch(0.45_0.02_50)] font-semibold tracking-wide uppercase" style={{ fontFamily: 'var(--font-mono)' }}>{t.tag}</span>
                    {t.tier === 'principal' && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold tracking-wide uppercase" style={{ fontFamily: 'var(--font-mono)', background: 'oklch(0.55 0.15 30 / 0.1)', color: 'oklch(0.45 0.12 30)' }}>Principal</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[oklch(0.35_0.02_50)] leading-relaxed mb-5 italic" style={{ fontFamily: 'var(--font-body)' }}>"{t.quote}"</p>
                <div className="border-t border-black/5 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-body)' }}>{t.name}</div>
                      <div className="text-xs text-[oklch(0.5_0.02_50)]" style={{ fontFamily: 'var(--font-body)' }}>
                        {t.title}{t.company ? `, ${t.company}` : ""}
                      </div>
                    </div>
                    {testimonialSocials[t.name] && (
                      <div className="flex gap-1.5">
                        {testimonialSocials[t.name].linkedin && (
                          <a href={testimonialSocials[t.name].linkedin} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[oklch(0.55_0.15_30)]/20 transition-colors" style={{ background: 'oklch(0.55 0.15 30 / 0.1)' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="oklch(0.55 0.15 30)"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                          </a>
                        )}
                        {testimonialSocials[t.name].twitter && (
                          <a href={testimonialSocials[t.name].twitter} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[oklch(0.55_0.15_30)]/20 transition-colors" style={{ background: 'oklch(0.55 0.15 30 / 0.1)' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="oklch(0.55 0.15 30)"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Confidential Engagements */}
      <section className="relative section-dark py-20 sm:py-28 overflow-hidden">
        <div className="glass-orb glass-orb-blue w-[350px] h-[350px] -bottom-40 -right-40" />
        <div className="glass-orb glass-orb-amber w-[200px] h-[200px] top-20 -left-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.82 0.15 75)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[oklch(0.82_0.15_75)]" style={{ fontFamily: 'var(--font-body)' }}>Confidential Engagements</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              What Our <span className="text-[oklch(0.82_0.15_75)]">Confidential Clients</span> Say
            </h2>
            <p className="text-sm text-white/50 max-w-2xl mx-auto leading-relaxed italic" style={{ fontFamily: 'var(--font-body)' }}>
              Many of our most impactful engagements are protected by NDA. We've shared these with permission, with identifying details removed. References are available to qualified prospects upon request.
            </p>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {confidentialTestimonials.map((t, i) => (
              <div key={i} className="glass-card break-inside-avoid p-7 hover:bg-white/[0.08] transition-all">
                <div className="flex items-center justify-between mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="oklch(0.82 0.15 75 / 0.3)" stroke="none"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                  <span
                    className="text-[9px] px-2 py-0.5 rounded-full font-semibold tracking-wide uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      background: `color-mix(in oklch, ${divisionColors[t.division]}, transparent 85%)`,
                      color: divisionColors[t.division],
                    }}
                  >
                    {t.division}
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-5 italic" style={{ fontFamily: 'var(--font-body)' }}>"{t.quote}"</p>
                <div className="border-t border-white/[0.06] pt-4">
                  <div className="flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" className="shrink-0"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    <span className="text-xs text-white/40 italic" style={{ fontFamily: 'var(--font-body)' }}>{t.attribution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold transition-all shadow-lg"
              style={{ background: 'oklch(0.82 0.15 75)', color: 'oklch(0.15 0.02 75)', fontFamily: 'var(--font-body)', boxShadow: '0 10px 30px oklch(0.82 0.15 75 / 0.2)' }}
            >
              Request References
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <p className="text-xs text-white/30 mt-4" style={{ fontFamily: 'var(--font-body)' }}>References available to qualified prospects under NDA</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20" style={{ background: 'oklch(0.55 0.15 30)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Ready to Write Your Own Success Story?
          </h2>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
            The audit is free. The ROI guarantee is real. Let's talk.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold bg-white text-[oklch(0.35_0.1_30)] hover:bg-white/90 transition-all shadow-lg" style={{ fontFamily: 'var(--font-body)' }}>
              Start a Conversation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/process#flow-circuit" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all" style={{ fontFamily: 'var(--font-body)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Flow Circuit Assessment
            </Link>
            <Link href="/process#find-me" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all" style={{ fontFamily: 'var(--font-body)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
              Find Your Me
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
