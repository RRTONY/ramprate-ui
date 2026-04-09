'use client'

import {useState} from 'react'

const PASSWORD = 'adam2026'

const matters = [
  {
    track: 'Track 1 · Urgent',
    variant: 'urgent',
    title: 'Greenberg v. Hayek Appeal',
    clickupTaskId: '868hxxtx3',
    clickupUrl: 'https://app.clickup.com/t/868hxxtx3',
    items: [
      'Attorney of record transfer filing — Brian Castorina replacement must be initiated immediately',
      'Missing transcript identification and cure',
      'Brian Castorina outstanding issues resolved (holds, liens, pending fee disputes)',
      'Parallel $107K damages case status',
      'Henry Jannol billing dispute resolution',
    ],
    deadline: 'Rolling — immediate initiation required',
  },
  {
    track: 'Track 2 · Active',
    variant: 'active',
    title: 'Kodah Matters',
    clickupTaskId: '868hxxtyh',
    clickupUrl: 'https://app.clickup.com/t/868hxxtyh',
    items: [
      'Full matter log to be established',
      'Next steps and deadlines documented',
      'Communication cadence defined',
      'Paula introduction — referral/spiff structure to be discussed (see Referral section below)',
    ],
    deadline: 'Framework delivery by March 24',
  },
  {
    track: 'Track 3 · Personal',
    variant: 'personal',
    title: 'Clarisse Abelarde Matters',
    clickupTaskId: '868j1ejg8',
    clickupUrl: 'https://app.clickup.com/t/868j1ejg8',
    items: [
      'Matter scope to be defined in follow-up',
      'Separate communication log required',
      'Sensitivity protocols established',
    ],
    deadline: 'Intake call to be scheduled this week',
  },
  {
    track: 'Track 4 · Incoming',
    variant: 'incoming',
    title: 'New Leads & Referrals',
    clickupTaskId: '868j1ejth',
    clickupUrl: 'https://app.clickup.com/t/868j1ejth',
    items: [
      'Keenan — $1M lawsuit matter (assess fit)',
      'Additional leads to be logged upon intake',
      'Consumer products representation opportunity (pending current matter resolution)',
    ],
    deadline: 'Keenan intake assessment by March 27',
  },
]

const protocol = [
  {element: 'Primary Channel', standard: 'WhatsApp for real-time; email for formal record', owner: 'Both'},
  {element: 'Response SLA', standard: 'Same business day; urgent matters within 4 hours', owner: 'Adam / Admin'},
  {element: 'Weekly Status', standard: 'Written update on all active matters every Monday', owner: "Adam's team"},
  {element: 'Deadline Register', standard: 'Shared master log maintained and updated in real time', owner: 'Both'},
  {element: 'Admin Contact', standard: 'Please confirm name, direct line, and email of your admin', owner: 'Adam'},
  {element: 'Billing', standard: 'Invoices within 48 hours of work performed; itemized', owner: "Adam's office"},
  {element: 'Approvals', standard: 'Written approval required for all strategic decisions', owner: 'Tony'},
]

export default function AttorneyPage() {
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
            <div><strong className="text-black">To:</strong> Adam Zaffos, Esq.</div>
            <div><strong className="text-black">Re:</strong> Partnership Framework &amp; Active Matters</div>
            <div><strong className="text-black">Status:</strong> Confidential Attorney-Client</div>
          </div>
        </div>

        {/* ── Salutation + Opening ── */}
        <div className="mb-8">
          <div className="text-2xl sm:text-3xl font-bold mb-5" style={{fontFamily: 'var(--font-display)'}}>Adam,</div>
          <p className="mb-4 leading-relaxed text-sm">
            I want to start by saying directly: I intend for you to be one of the best client relationships you have ever had, and I expect the same standard in return. That begins with structure. We have several active matters running concurrently and the way we have been managing communication and accountability has been too informal relative to the stakes involved.
          </p>
          <p className="leading-relaxed text-sm">
            This letter establishes the working framework I want in place going forward — covering active matters, communication protocols, deadlines, the referral relationship through Paula (our mutual contact via Kodah), and the immediate actions required this week. Consider this our operating agreement as partners.
          </p>
        </div>

        <hr className="border-t border-gray-200 my-9" />

        {/* ── Immediate Actions ── */}
        <div className="mb-1 text-xl sm:text-2xl font-bold" style={{fontFamily: 'var(--font-display)'}}>
          Immediate Actions — This Week
        </div>
        <div className="text-xs font-bold uppercase tracking-widest mb-5 text-gray-500">
          Time-sensitive · Requires confirmation by next Monday
        </div>

        <div className="rounded px-5 py-4 mb-6 text-sm leading-relaxed bg-gray-100 border border-black">
          <strong>Payment:</strong> You will receive a $10,000 payment from me by next Monday. This is contingent on the transfer of attorney of record being initiated this week. Please confirm receipt, apply it to the appropriate retainer or matter account, and send written confirmation of allocation within 24 hours of receipt.
        </div>

        <ul className="mb-6 space-y-2">
          {[
            'Transfer of attorney of record — Brian Castorina replacement must be initiated immediately. Confirm filing date and court acknowledgment timeline.',
            'Missing transcripts — Provide a written accounting of which transcripts are outstanding, who is responsible for obtaining them, and the deadline for completion.',
            'Brian Castorina — Outline all open issues with prior counsel including any holds, liens, or pending fee disputes that could affect case posture.',
            'Written status update on all matters below delivered to me no later than EOD Friday, March 20.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 pl-1 text-sm pb-2 border-b border-gray-200">
              <span className="shrink-0 mt-0.5 font-bold">→</span>
              {item}
            </li>
          ))}
        </ul>

        <hr className="border-t border-gray-200 my-9" />

        {/* ── Active Matter Log ── */}
        <div className="mb-1 text-xl sm:text-2xl font-bold" style={{fontFamily: 'var(--font-display)'}}>
          Active Matter Log
        </div>
        <div className="text-xs font-bold uppercase tracking-widest mb-5 text-gray-500">
          Four primary tracks — each requires its own deadline register
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-2">
          {matters.map((m) => (
            <div key={m.track} className="rounded p-5 bg-gray-50 border border-gray-300 border-l-4 border-l-black">
              <span className="inline-block text-xs font-bold uppercase tracking-wide px-2 py-1 rounded mb-3 bg-black text-white">
                {m.track}
              </span>
              <div className="text-base font-bold mb-3" style={{fontFamily: 'var(--font-display)'}}>
                {m.title}
              </div>
              <ul className="space-y-1 mb-3">
                {m.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm pb-1.5 border-b border-gray-200">
                    <span className="shrink-0 mt-0.5 text-xs font-bold">→</span>
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
          How we work together — non-negotiable standards
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

        {/* ── Referral Consideration — Paula ── */}
        <div className="mb-1 text-xl sm:text-2xl font-bold" style={{fontFamily: 'var(--font-display)'}}>
          Referral Consideration — Paula &amp; the Kodah Introduction
        </div>
        <div className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">
          On the record · No mandated action · For discussion and documentation
        </div>

        <div className="rounded-lg p-6 bg-gray-100 border border-gray-300 space-y-3 text-sm leading-relaxed">
          <p>
            <strong>The introduction:</strong> Paula introduced us — she is a mutual friend who made the connection between me and your practice through the Kodah relationship. That introduction has value and deserves to be acknowledged openly.
          </p>
          <p>
            <strong>Open question — ongoing vs. one-time:</strong> I want clarity on whether Paula&apos;s role is limited to the initial introduction, or whether she has involvement in successive matters that flow from this relationship going forward. If she is actively involved in future referrals or matters, that changes the structure of any consideration.
          </p>
          <p>
            <strong>Open question — compensation/spiff:</strong> How is Paula compensated for this? Does she receive a referral fee on matters referred? A percentage? A flat spiff? Something in kind? I want to make sure she is properly acknowledged and that any arrangement is clearly defined, ethical, and compliant with bar rules.
          </p>
          <p>
            <strong>Open question — ongoing obligations:</strong> If additional clients or matters come through the Kodah network as a result of Paula&apos;s introduction, is there a continuing obligation to her? That should be defined now, not after the fact.
          </p>
          <p className="text-gray-600 italic">
            No action is mandated here. This is on the list for a direct conversation. I want it in the open because I believe every relationship deserves clarity, and I intend to honor every introduction that brings real value.
          </p>
        </div>

        <hr className="border-t border-gray-200 my-9" />

        {/* ── Future Opportunity ── */}
        <div className="mb-1 text-xl sm:text-2xl font-bold" style={{fontFamily: 'var(--font-display)'}}>
          Future Opportunity — Consumer Products
        </div>
        <div className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">
          Pending resolution of current active matters
        </div>
        <p className="mb-4 text-sm leading-relaxed">
          Based on your background and experience with consumer products matters, I have a representation opportunity I believe would be well suited to your practice. I am not in a position to bring this forward until our current matters are properly structured and moving. Consider this a strong incentive to get the foundation right quickly.
        </p>
        <p className="text-sm leading-relaxed">
          The opportunity is real, the relationship is warm, and it will come to you as a direct referral once I have confidence that our working relationship operates at the standard I hold for all my partnerships.
        </p>

        <hr className="border-t border-gray-200 my-9" />

        {/* ── Closing ── */}
        <div className="pt-2 border-t-2 border-black">
          <p className="mb-4 text-sm leading-relaxed">
            Adam, I am a demanding client because I take these matters seriously and because I have built two significant businesses on the principle that tight process creates the conditions for exceptional outcomes. I look forward to building that with you.
          </p>
          <p className="mb-6 text-sm leading-relaxed">
            Please confirm receipt of this letter, provide your admin&apos;s contact information, and send me a written response to each of the immediate action items above by Friday, March 20.
          </p>
          <div className="text-4xl sm:text-5xl font-bold leading-tight" style={{fontFamily: 'var(--font-display)'}}>
            Tony Greenberg
          </div>
          <div className="text-xs font-bold uppercase tracking-widest mt-2 text-gray-600">
            Founder &amp; CEO · RampRate · ImpactSoul B Corp · Santa Monica, CA
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="mt-16 pt-5 text-center text-xs leading-loose border-t border-gray-200 text-gray-500">
          CONFIDENTIAL — Attorney-Client Communication · Tony Greenberg · Santa Monica, CA<br />
          RampRate Inc. · ImpactSoul · March 17, 2026
        </div>

      </div>
    </main>
  )
}
