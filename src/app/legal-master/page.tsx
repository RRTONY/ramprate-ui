'use client'

import {useState} from 'react'
import Link from 'next/link'

const PASSWORD = 'tonymaster'

const allMatters = [
  {
    attorney: 'Adam Zaffos',
    portal: '/attorney',
    tracks: [
      {
        track: 'Track 1 · URGENT',
        title: 'Greenberg v. Hayek Appeal',
        items: [
          'Attorney of record transfer filing — Brian Castorina replacement',
          'Missing transcript identification and cure',
          'Brian Castorina outstanding issues (holds, liens, fee disputes)',
          'Parallel $107K damages case status',
          'Henry Jannol billing dispute resolution',
        ],
        deadline: 'Rolling — immediate',
      },
      {
        track: 'Track 2 · Active',
        title: 'Kodah Matters',
        items: [
          'Full matter log established',
          'Next steps and deadlines documented',
          'Communication cadence defined',
          'Paula introduction — referral/spiff structure discussed',
        ],
        deadline: 'March 24',
      },
      {
        track: 'Track 3 · Personal',
        title: 'Clarisse Abelarde Matters',
        items: [
          'Matter scope defined',
          'Separate communication log set up',
          'Sensitivity protocols established',
        ],
        deadline: 'Intake call this week',
      },
      {
        track: 'Track 4 · Incoming',
        title: 'New Leads & Referrals',
        items: [
          'Keenan — $1M lawsuit (assess fit)',
          'Additional leads logged upon intake',
          'Consumer products representation (pending)',
        ],
        deadline: 'Keenan by March 27',
      },
    ],
  },
  {
    attorney: 'Henry Jannol',
    portal: '/henry-jannol',
    tracks: [
      {
        track: 'Track 1 · Co-Counsel Unwind',
        title: 'Greenberg v. Hayek — Co-Counsel Transition',
        items: [
          'Formal withdrawal / substitution confirmed',
          'Outstanding billing dispute resolved — itemized invoice received',
          'Lien or hold on case files disclosed and cleared',
          'All case materials transferred to Adam Zaffos',
          'Retainer funds accounted for — refund or credit applied',
        ],
        deadline: 'March 27',
      },
      {
        track: 'Track 2 · Billing Dispute',
        title: 'Fee Dispute Resolution',
        items: [
          'Complete billing records received',
          'Disputed charges identified and resolved',
          'Confirmed no liens on judgment or settlement proceeds',
          'Final accounting confirmed in writing',
        ],
        deadline: 'Initial response March 20',
      },
      {
        track: 'Track 3 · Documentation',
        title: 'File & Record Transfer',
        items: [
          'Full case file inventory received',
          'All transcripts accounted for and transferred',
          'Copies of all court filings under Jannol signature received',
          'Relevant opposing counsel communications transferred',
        ],
        deadline: 'Full transfer March 31',
      },
    ],
  },
  {
    attorney: 'Josh Bykowski',
    portal: '/josh-bykowski',
    tracks: [
      {
        track: 'Track 1 · Active',
        title: 'Open Matters — To Be Defined',
        items: [
          'Full matter log established',
          'Active case names, courts, docket numbers documented',
          'Current status of each matter confirmed',
          'Co-counsel / opposing counsel noted',
        ],
        deadline: 'March 31',
      },
      {
        track: 'Track 2 · Deadlines',
        title: 'Deadline Register',
        items: [
          'All court-mandated deadlines logged',
          'Statute of limitations — approaching ones flagged',
          'Scheduled hearings/depositions/filings (next 90 days) confirmed',
          'Third-party dependent deadlines noted',
        ],
        deadline: 'March 24',
      },
      {
        track: 'Track 3 · Communication',
        title: 'Partnership Framework',
        items: [
          'Communication cadence and channels confirmed',
          'Admin contact information received',
          'Billing structure agreed upon',
          'Approval process established',
        ],
        deadline: 'March 24',
      },
    ],
  },
]

const immediateActions = [
  {label: '$10,000 payment sent to Adam Zaffos', owner: 'Tony', deadline: 'Next Monday'},
  {label: 'Adam confirms attorney of record transfer initiated', owner: 'Adam', deadline: 'EOD Friday March 20'},
  {label: 'Adam provides written status update on all matters', owner: 'Adam', deadline: 'EOD Friday March 20'},
  {label: 'Henry Jannol responds to billing dispute request', owner: 'Henry', deadline: 'March 20'},
  {label: 'Josh Bykowski first call scheduled', owner: 'Tony/Josh', deadline: 'This week'},
  {label: 'Keenan matter assessed for fit', owner: 'Adam', deadline: 'March 27'},
  {label: 'Paula referral structure discussion completed', owner: 'Adam/Tony', deadline: 'Next call'},
]

export default function LegalMasterPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [attempt, setAttempt] = useState('')
  const [error, setError] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggle = (key: string) => setChecked((prev) => ({...prev, [key]: !prev[key]}))

  const tryUnlock = () => {
    if (attempt === PASSWORD) setUnlocked(true)
    else setError(true)
  }

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-5">
        <div className="w-full max-w-sm">
          <div className="text-2xl font-bold mb-2 text-center" style={{fontFamily: 'var(--font-display)'}}>
            Master Legal CRM
          </div>
          <p className="text-sm text-gray-600 text-center mb-8" style={{fontFamily: 'var(--font-body)'}}>
            Admin access only. Enter your master code.
          </p>
          <div className="relative mb-3">
            <input
              type={showCode ? 'text' : 'password'}
              value={attempt}
              onChange={(e) => { setAttempt(e.target.value); setError(false) }}
              onKeyDown={(e) => { if (e.key === 'Enter') tryUnlock() }}
              placeholder="Master access code"
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
          {error && <p className="text-sm text-red-600 mb-3" style={{fontFamily: 'var(--font-body)'}}>Incorrect code.</p>}
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

  const totalItems = allMatters.reduce((acc, a) => acc + a.tracks.reduce((acc2, t) => acc2 + t.items.length, 0), 0)
  const checkedCount = Object.values(checked).filter(Boolean).length

  return (
    <main className="min-h-screen pt-24 pb-20 px-5 bg-white text-black">
      <div className="max-w-[1100px] mx-auto" style={{fontFamily: 'var(--font-body)'}}>

        {/* ── Header ── */}
        <div className="flex justify-between items-start flex-wrap gap-4 pb-6 mb-9 border-b-2 border-black">
          <div>
            <div className="text-3xl sm:text-4xl font-bold leading-tight" style={{fontFamily: 'var(--font-display)'}}>
              Master Legal CRM
            </div>
            <div className="text-xs font-bold uppercase tracking-widest mt-1 text-gray-600">
              Tony Greenberg · Admin View · All Attorneys · All Matters
            </div>
          </div>
          <div className="text-right text-sm leading-loose text-gray-600">
            <div><strong className="text-black">Last updated:</strong> March 17, 2026</div>
            <div><strong className="text-black">Attorneys:</strong> Adam Zaffos · Henry Jannol · Josh Bykowski</div>
            <div><strong className="text-black">Progress:</strong> {checkedCount} / {totalItems} items closed</div>
          </div>
        </div>

        {/* ── Progress Bar ── */}
        <div className="mb-9">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
            <span>Overall Completion</span>
            <span>{Math.round((checkedCount / totalItems) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black rounded-full transition-all duration-300"
              style={{width: `${(checkedCount / totalItems) * 100}%`}}
            />
          </div>
        </div>

        {/* ── Immediate Actions ── */}
        <div className="mb-1 text-xl sm:text-2xl font-bold" style={{fontFamily: 'var(--font-display)'}}>
          Immediate Action Items
        </div>
        <div className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">
          Time-sensitive — track completion here
        </div>
        <div className="rounded border border-gray-300 overflow-hidden mb-10">
          <table className="w-full text-sm" style={{borderCollapse: 'collapse'}}>
            <thead>
              <tr className="border-b-2 border-black bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 w-10">Done</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Action</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Owner</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {immediateActions.map((a, i) => {
                const key = `action-${i}`
                const done = checked[key]
                return (
                  <tr key={i} className={`${i < immediateActions.length - 1 ? 'border-b border-gray-200' : ''} ${done ? 'bg-gray-50' : ''}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={!!done}
                        onChange={() => toggle(key)}
                        className="w-4 h-4 accent-black cursor-pointer"
                      />
                    </td>
                    <td className={`px-4 py-3 ${done ? 'line-through text-gray-400' : ''}`}>{a.label}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{a.owner}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap font-semibold">{a.deadline}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── Attorney Sections ── */}
        {allMatters.map((attorney) => (
          <div key={attorney.attorney} className="mb-14">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xl sm:text-2xl font-bold" style={{fontFamily: 'var(--font-display)'}}>
                {attorney.attorney}
              </div>
              <Link
                href={attorney.portal}
                target="_blank"
                className="text-xs font-bold uppercase tracking-wide underline text-gray-500 hover:text-black"
              >
                View Portal →
              </Link>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest mb-5 text-gray-500">
              {attorney.tracks.length} tracks · portal: ramprate.netlify.app{attorney.portal}
            </div>

            <div className="space-y-4">
              {attorney.tracks.map((track) => {
                const trackChecked = track.items.filter((_, i) =>
                  checked[`${attorney.attorney}-${track.track}-${i}`]
                ).length
                return (
                  <div key={track.track} className="rounded border border-gray-300 border-l-4 border-l-black bg-gray-50 overflow-hidden">
                    <div className="px-5 pt-4 pb-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="inline-block text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded bg-black text-white mr-3">
                          {track.track}
                        </span>
                        <span className="font-bold text-sm" style={{fontFamily: 'var(--font-display)'}}>{track.title}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-bold text-black">{trackChecked}/{track.items.length}</span> closed · <span className="font-semibold">Deadline: {track.deadline}</span>
                      </div>
                    </div>
                    <ul className="px-5 py-3 space-y-2">
                      {track.items.map((item, i) => {
                        const key = `${attorney.attorney}-${track.track}-${i}`
                        const done = checked[key]
                        return (
                          <li key={i} className="flex items-start gap-3 text-sm py-1.5 border-b border-gray-200 last:border-0">
                            <input
                              type="checkbox"
                              checked={!!done}
                              onChange={() => toggle(key)}
                              className="mt-0.5 w-4 h-4 accent-black cursor-pointer shrink-0"
                            />
                            <span className={done ? 'line-through text-gray-400' : ''}>{item}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* ── Portal Directory ── */}
        <hr className="border-t border-gray-200 my-9" />
        <div className="mb-1 text-xl sm:text-2xl font-bold" style={{fontFamily: 'var(--font-display)'}}>
          Portal Directory
        </div>
        <div className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">
          Each attorney sees only their own portal — access codes below
        </div>
        <div className="rounded border border-gray-300 overflow-hidden">
          <table className="w-full text-sm" style={{borderCollapse: 'collapse'}}>
            <thead>
              <tr className="border-b-2 border-black bg-gray-50">
                {['Attorney', 'Portal URL', 'Access Code', 'Link'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {name: 'Adam Zaffos', url: '/attorney', code: 'adam2026'},
                {name: 'Henry Jannol', url: '/henry-jannol', code: 'henry2026'},
                {name: 'Josh Bykowski', url: '/josh-bykowski', code: 'josh2026'},
                {name: 'Tony (Master)', url: '/legal-master', code: 'tonymaster'},
              ].map((row, i) => (
                <tr key={i} className={i < 3 ? 'border-b border-gray-200' : ''}>
                  <td className="px-4 py-3 font-semibold">{row.name}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{row.url}</td>
                  <td className="px-4 py-3 font-mono text-xs bg-gray-50">{row.code}</td>
                  <td className="px-4 py-3">
                    <Link href={row.url} target="_blank" className="text-xs font-bold underline hover:text-gray-600">Open →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16 pt-5 text-center text-xs leading-loose border-t border-gray-200 text-gray-500">
          CONFIDENTIAL — Master Admin View · Tony Greenberg Only · RampRate Inc. · March 17, 2026
        </div>

      </div>
    </main>
  )
}
