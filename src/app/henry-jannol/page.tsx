'use client'

import {useState} from 'react'

const PASSWORD = 'henry2026'

const matters = [
  {
    track: 'Track 1 · Co-Counsel Unwind',
    title: 'Greenberg v. Hayek — Co-Counsel Transition',
    items: [
      'Formal withdrawal or substitution of co-counsel — confirm process and timeline',
      'Outstanding billing dispute — itemized invoice required for all fees claimed',
      'Any lien or hold on case files, transcripts, or work product must be disclosed',
      'Transfer of all case materials, notes, and work product to Adam Zaffos',
      'Accounting of any retainer funds held — refund or credit applied',
    ],
    deadline: 'Resolution by March 27, 2026',
  },
  {
    track: 'Track 2 · Billing Dispute',
    title: 'Fee Dispute Resolution',
    items: [
      'Provide complete billing records for all time charged on this matter',
      'Identify any disputed charges and proposed resolution',
      'Confirm no liens filed against judgment or settlement proceeds',
      'Written confirmation of final accounting once resolved',
    ],
    deadline: 'Initial response by March 20, 2026',
  },
  {
    track: 'Track 3 · Documentation',
    title: 'File & Record Transfer',
    items: [
      'Full case file inventory — all documents in your possession',
      'Transcripts — identify any outstanding or withheld',
      'Court filings under your signature — provide copies',
      'Communications with opposing counsel relevant to active matters',
    ],
    deadline: 'Full transfer by March 31, 2026',
  },
]

const protocol = [
  {element: 'Primary Channel', standard: 'Email for all formal communications', owner: 'Both'},
  {element: 'Response SLA', standard: 'Within 2 business days', owner: 'Henry / Admin'},
  {element: 'Billing Response', standard: 'Itemized response to all disputed charges within 5 business days', owner: 'Henry'},
  {element: 'File Transfer', standard: 'All materials transferred within 10 business days of written request', owner: 'Henry'},
  {element: 'Confirmation', standard: 'Written confirmation required for all transfers and resolutions', owner: 'Both'},
]

export default function HenryJannolPage() {
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
            <div><strong className="text-black">To:</strong> Henry Jannol, Esq.</div>
            <div><strong className="text-black">Re:</strong> Co-Counsel Transition &amp; Open Issues</div>
            <div><strong className="text-black">Status:</strong> Confidential Attorney-Client</div>
          </div>
        </div>

        {/* ── Salutation + Opening ── */}
        <div className="mb-8">
          <div className="text-2xl sm:text-3xl font-bold mb-5" style={{fontFamily: 'var(--font-display)'}}>Henry,</div>
          <p className="mb-4 leading-relaxed text-sm">
            I want to be direct and professional about the transition we need to complete. There are several open items that require resolution as we move forward with new counsel on the Greenberg v. Hayek matter. This document is my first attempt to capture all outstanding issues in one place — it is not accusatory and makes no assumptions. I believe it is approximately 90% correct and I welcome your input to improve it.
          </p>
          <p className="leading-relaxed text-sm">
            The goal here is clean and complete — a proper transition that protects the case, resolves any billing questions with full transparency, and allows us both to move forward without loose ends. I would like your written response to each item below.
          </p>
          <p className="mt-4 leading-relaxed text-sm">
            I am also building a broader practice around helping entrepreneurs navigate legal complexity — you can learn more about that and our attorney network at{' '}
            <a href="/attorney-rfi" className="underline font-semibold">ramprate.com/attorney-rfi</a>.
            As we resolve these transition matters, I am open to future collaboration opportunities.
          </p>
        </div>

        <hr className="border-t border-gray-200 my-9" />

        {/* ── Active Matter Log ── */}
        <div className="mb-1 text-xl sm:text-2xl font-bold" style={{fontFamily: 'var(--font-display)'}}>
          Open Matter Log
        </div>
        <div className="text-xs font-bold uppercase tracking-widest mb-5 text-gray-500">
          Three tracks — all require written response and resolution
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
          Standards for this transition process
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
            Henry, I hold no animosity and have no interest in anything other than a clean, professional resolution. I have built my businesses on the principle that tight process and honest communication produce the best outcomes — and I apply that standard to every professional relationship, including transitions.
          </p>
          <p className="mb-6 text-sm leading-relaxed">
            Please confirm receipt and provide your written response to each item above within the timelines specified.
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
