'use client'

import {useState} from 'react'

const PASSWORD = 'josh2026'

const matters = [
  {
    track: 'Track 1 · Active',
    title: 'Open Matters — To Be Defined',
    items: [
      'Full matter log to be established on first call',
      'All active case names, courts, and docket numbers documented',
      'Current status of each matter — pending filings, hearings, deadlines',
      'Any co-counsel or opposing counsel to be noted',
    ],
    deadline: 'Framework delivery by March 31, 2026',
  },
  {
    track: 'Track 2 · Deadlines',
    title: 'Deadline Register',
    items: [
      'All court-mandated deadlines to be logged immediately',
      'Statute of limitations — any approaching must be flagged as urgent',
      'Scheduled hearings, depositions, or filings in next 90 days',
      'Any deadlines dependent on third parties (opposing counsel, courts, agencies)',
    ],
    deadline: 'Initial register by March 24, 2026',
  },
  {
    track: 'Track 3 · Communication',
    title: 'Partnership Framework',
    items: [
      'Communication cadence and preferred channels to be defined',
      'Admin contact information confirmed',
      'Billing structure and invoice timeline agreed upon',
      'Written approval process for strategic decisions established',
    ],
    deadline: 'Framework confirmed by March 24, 2026',
  },
]

const protocol = [
  {element: 'Primary Channel', standard: 'WhatsApp for real-time; email for formal record', owner: 'Both'},
  {element: 'Response SLA', standard: 'Same business day; urgent matters within 4 hours', owner: 'Josh / Admin'},
  {element: 'Weekly Status', standard: 'Written update on all active matters every Monday', owner: "Josh's team"},
  {element: 'Deadline Register', standard: 'Shared master log maintained and updated in real time', owner: 'Both'},
  {element: 'Billing', standard: 'Invoices within 48 hours of work performed; itemized', owner: "Josh's office"},
  {element: 'Approvals', standard: 'Written approval required for all strategic decisions', owner: 'Tony'},
]

export default function JoshBykowskiPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [attempt, setAttempt] = useState('')
  const [error, setError] = useState(false)
  const [showCode, setShowCode] = useState(false)

  const tryUnlock = () => {
    if (attempt === PASSWORD) setUnlocked(true)
    else setError(true)
  }

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-5">
        <div className="w-full max-w-sm">
          <div className="text-2xl font-bold mb-2 text-center" style={{fontFamily: 'var(--font-display)'}}>
            Secure Portal
          </div>
          <p className="text-sm text-gray-600 text-center mb-8" style={{fontFamily: 'var(--font-body)'}}>
            This document is confidential. Enter your access code to continue.
          </p>
          <div className="relative mb-3">
            <input
              type={showCode ? 'text' : 'password'}
              value={attempt}
              onChange={(e) => { setAttempt(e.target.value); setError(false) }}
              onKeyDown={(e) => { if (e.key === 'Enter') tryUnlock() }}
              placeholder="Access code"
              autoComplete="off"
              className="w-full px-4 py-3 pr-12 border-2 border-black rounded text-sm focus:outline-none"
              style={{fontFamily: 'var(--font-body)', color: '#000000', background: '#ffffff'}}
            />
            <button
              type="button"
              onClick={() => setShowCode((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              tabIndex={-1}
              aria-label={showCode ? 'Hide code' : 'Show code'}
            >
              {showCode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          {error && <p className="text-sm text-red-600 mb-3" style={{fontFamily: 'var(--font-body)'}}>Incorrect code. Please try again.</p>}
          <button
            onClick={tryUnlock}
            className="w-full py-3 bg-black text-white font-bold rounded text-sm hover:bg-gray-800 transition-colors"
            style={{fontFamily: 'var(--font-body)'}}
          >
            Enter
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-5 bg-white text-black">
      <div className="max-w-[860px] mx-auto" style={{fontFamily: 'var(--font-body)'}}>

        {/* ── Letterhead ── */}
        <div className="flex justify-between items-start flex-wrap gap-4 pb-6 mb-9 border-b-2 border-black">
          <div>
            <div className="text-3xl sm:text-4xl font-bold leading-tight" style={{fontFamily: 'var(--font-display)'}}>
              Tony Greenberg
            </div>
            <div className="text-xs font-bold uppercase tracking-widest mt-1 text-gray-600">
              Founder &amp; CEO · RampRate · ImpactSoul
            </div>
          </div>
          <div className="text-right text-sm leading-loose text-gray-600">
            <div><strong className="text-black">Date:</strong> March 17, 2026</div>
            <div><strong className="text-black">To:</strong> Josh Bykowski, Esq.</div>
            <div><strong className="text-black">Re:</strong> Matter Framework &amp; Open Issues</div>
            <div><strong className="text-black">Status:</strong> Confidential Attorney-Client</div>
          </div>
        </div>

        {/* ── Salutation + Opening ── */}
        <div className="mb-8">
          <div className="text-2xl sm:text-3xl font-bold mb-5" style={{fontFamily: 'var(--font-display)'}}>Josh,</div>
          <p className="mb-4 leading-relaxed text-sm">
            I want to establish a proper working framework for all the matters we have running together. This is my first pass at capturing everything in one place — it is approximately 90% correct and I welcome your input to fill in what I have missed or gotten wrong. There are no accusations and no assumptions — this is simply the beginning of a system we will use together going forward.
          </p>
          <p className="leading-relaxed text-sm">
            I am building a broader CRM to manage all my legal relationships — one that will eventually allow us to share opportunities, flag conflicts, and coordinate on matters where our networks overlap. You are a valued part of that network. I look forward to cleaning up current issues and growing together.
          </p>
          <p className="mt-4 leading-relaxed text-sm">
            I have six active entrepreneur clients I am supporting right now and I am actively searching for additional counsel. If you have capacity and are interested in co-counsel opportunities, please review our attorney network application at{' '}
            <a href="/attorney-rfi" className="underline font-semibold">ramprate.com/attorney-rfi</a>.
          </p>
        </div>

        <hr className="border-t border-gray-200 my-9" />

        {/* ── Active Matter Log ── */}
        <div className="mb-1 text-xl sm:text-2xl font-bold" style={{fontFamily: 'var(--font-display)'}}>
          Open Matter Log
        </div>
        <div className="text-xs font-bold uppercase tracking-widest mb-5 text-gray-500">
          Three tracks — to be completed and confirmed on first call
        </div>

        <div className="space-y-4 mb-2">
          {matters.map((m) => (
            <div key={m.track} className="rounded p-5 bg-gray-50 border border-gray-300 border-l-4 border-l-black">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded mb-3 bg-black text-white">
                {m.track}
              </span>
              <div className="text-base font-bold mb-3" style={{fontFamily: 'var(--font-display)'}}>
                {m.title}
              </div>
              <ul className="space-y-1 mb-3">
                {m.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm pb-1.5 border-b border-gray-200">
                    <span className="shrink-0 mt-0.5 font-bold">→</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="text-xs font-bold uppercase tracking-wide text-gray-700">
                Deadline: {m.deadline}
              </div>
            </div>
          ))}
        </div>

        <hr className="border-t border-gray-200 my-9" />

        {/* ── Communication Protocol ── */}
        <div className="mb-1 text-xl sm:text-2xl font-bold" style={{fontFamily: 'var(--font-display)'}}>
          Communication Protocol
        </div>
        <div className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">
          How we work together
        </div>

        <div className="overflow-x-auto rounded border border-gray-300">
          <table className="w-full text-sm" style={{borderCollapse: 'collapse'}}>
            <thead>
              <tr className="border-b-2 border-black">
                {['Element', 'Standard', 'Owner'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {protocol.map((row, i) => (
                <tr key={i} className={i < protocol.length - 1 ? 'border-b border-gray-200' : ''}>
                  <td className="px-4 py-3 font-semibold align-top">{row.element}</td>
                  <td className="px-4 py-3 align-top">{row.standard}</td>
                  <td className="px-4 py-3 align-top whitespace-nowrap text-gray-600">{row.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <hr className="border-t border-gray-200 my-9" />

        {/* ── Closing ── */}
        <div className="pt-2 border-t-2 border-black">
          <p className="mb-4 text-sm leading-relaxed">
            Josh, thank you for all your work to date. I appreciate your partnership and look forward to building a tighter, more connected working relationship as we grow together. The system we are putting in place will benefit both of us.
          </p>
          <p className="mb-6 text-sm leading-relaxed">
            Please review this document, confirm what is correct, correct what is not, and let&apos;s schedule a call to close out the open items together.
          </p>
          <div className="text-4xl sm:text-5xl font-bold leading-tight" style={{fontFamily: 'var(--font-display)'}}>
            Tony Greenberg
          </div>
          <div className="text-xs font-bold uppercase tracking-widest mt-2 text-gray-600">
            Founder &amp; CEO · RampRate · ImpactSoul B Corp · Santa Monica, CA
          </div>
        </div>

        <div className="mt-16 pt-5 text-center text-xs leading-loose border-t border-gray-200 text-gray-500">
          CONFIDENTIAL — Attorney-Client Communication · Tony Greenberg · Santa Monica, CA<br />
          RampRate Inc. · ImpactSoul · March 17, 2026
        </div>

      </div>
    </main>
  )
}
