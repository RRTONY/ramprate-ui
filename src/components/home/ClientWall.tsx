'use client'

import {useState} from 'react'

/* ── CLIENT LOGO WALL — Two-Tier ── */
const tier1Clients = [
  {name: 'Microsoft', context: '50+ strategy & product studies'},
  {name: 'eBay', context: '27% infrastructure savings'},
  {name: 'Sony', context: 'Deep 8-figure outsourcing deals'},
  {name: 'ViacomCBS', context: 'Budget optimization across all IT categories'},
  {name: 'Intel', context: 'Digital strategy & alliances research'},
  {name: 'Nike', context: 'Multi-year procurement, 7-figure reductions'},
  {name: 'Hearst', context: '16+ years, saved millions globally'},
  {name: 'Blizzard', context: 'Complex negotiations, rapid scaling'},
]
const tier2Clients = [
  {name: 'Disney', context: 'Best IT services deal during executive tenure'},
  {name: 'AOL', context: '17-36% price reductions; breakthrough SLAs'},
  {name: 'NHL', context: 'Breakthrough PPV streaming solution'},
  {name: 'Miramax', context: '40%+ savings; diligence compressed'},
  {name: 'Warner Bros.', context: 'Win-win structures across two engagements'},
  {name: 'Verizon', context: 'Enterprise telecom partnerships'},
  {name: 'AT&T', context: 'Telecom infrastructure navigation'},
  {name: 'Merrill Lynch', context: 'Fortune 500 IT cost optimization'},
  {name: 'Accenture', context: '20-40% savings; cut processes in half'},
  {name: 'Thomson Reuters', context: 'Saved millions; marketplace mapping'},
  {name: 'Beats Music', context: 'Fully installed in 30 hours'},
  {name: 'XPRIZE', context: '$3M+ grant funding managed'},
  {name: 'Syntropy', context: '4+ year daily engagement; growth accelerated'},
  {name: 'Riot Games', context: 'Rapid scaling for multiplayer platforms'},
  {name: 'NBC', context: 'Content delivery optimization'},
  {name: 'Fox', context: 'Broadcast infrastructure advisory'},
  {name: 'Ticketmaster', context: 'eCommerce infrastructure'},
  {name: 'McGraw Hill', context: 'Publishing infrastructure optimization'},
  {name: 'Vodafone', context: 'Global telecom advisory'},
  {name: 'Primedia', context: 'Needs assessment in record time'},
]

function ClientCard({name, context}: {name: string; context: string}) {
  return (
    <div className="text-center px-2 py-4">
      <h3
        className="text-xs sm:text-sm font-bold tracking-[0.15em] uppercase"
        style={{fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.6)'}}
      >
        {name}
      </h3>
      <p
        className="text-[11px] sm:text-xs mt-1 leading-snug"
        style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.3)'}}
      >
        {context}
      </p>
    </div>
  )
}

export default function ClientWall() {
  const [showAllClients, setShowAllClients] = useState(false)

  return (
    <section className="section-dark py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight"
            style={{fontFamily: 'var(--font-display)'}}
          >
            25 Years Inside the World&apos;s Most
            <br className="hidden sm:block" />
            <span style={{color: 'var(--gold)'}}> Complex Enterprises</span>
          </h2>
          <p
            className="mt-3 text-sm"
            style={{fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.4)'}}
          >
            100+ engagements. $10B+ in decisions transacted. Names you know.
          </p>
        </div>

        {/* Tier 1 */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px rounded-lg overflow-hidden"
          style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)'}}
        >
          {tier1Clients.map((c) => (
            <div key={c.name} style={{background: 'oklch(0.18 0.01 250)'}}>
              <ClientCard name={c.name} context={c.context} />
            </div>
          ))}
        </div>

        {/* Tier 2 */}
        {showAllClients && (
          <div
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-px rounded-lg overflow-hidden mt-3"
            style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)'}}
          >
            {tier2Clients.map((c) => (
              <div key={c.name} style={{background: 'oklch(0.18 0.01 250)'}}>
                <ClientCard name={c.name} context={c.context} />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAllClients(!showAllClients)}
            className="text-xs font-semibold tracking-[0.15em] uppercase transition-colors hover:text-white/70 text-white/40"
            style={{fontFamily: 'var(--font-body)'}}
          >
            {showAllClients ? '— Show Less' : '+ View All Clients'}
          </button>
        </div>
      </div>
    </section>
  )
}
