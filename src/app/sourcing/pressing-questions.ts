// Shared so the visible Q&A on the page and the FAQPage JSON-LD in layout.tsx
// stay in sync (Google requires FAQ schema to match on-page content).
export const pressingQuestions = [
  {
    num: '01',
    question: 'Am I overpaying for GPU compute — or just paying for hype?',
    context:
      'AI cluster pricing is a black box. Spot vs. reserved vs. committed — every provider structures it differently. Without benchmark data, you\'re negotiating blind.',
  },
  {
    num: '02',
    question: 'Build, colo, or lease? What\'s the real math on my next data center?',
    context:
      'The build-vs-buy calculus has shifted. Power costs, land, permitting, and construction timelines have all changed. The right answer depends on your 5-year workload trajectory.',
  },
  {
    num: '03',
    question: 'Are my SLAs actually protecting me — or just protecting the vendor?',
    context:
      'Most enterprise SLAs are written by the provider\'s legal team. Credit structures, force majeure clauses, and uptime definitions are designed to minimize their exposure, not maximize yours.',
  },
  {
    num: '04',
    question: 'How do I evaluate edge locations without visiting 40 sites?',
    context:
      'Edge is about latency, not logos. The right site depends on your user geography, interconnection needs, and local power economics — not the provider\'s marketing deck.',
  },
  {
    num: '05',
    question: 'Is my MSA locking me into terms I\'ll regret in 18 months?',
    context:
      'Master Service Agreements are where the real leverage lives. Auto-renewal traps, price escalation clauses, and exit penalties can cost millions if you don\'t catch them upfront.',
  },
  {
    num: '06',
    question: 'What should I actually be paying per kW in this market?',
    context:
      'Power pricing varies 3–5× across metros. Knowing the real rate — not the rack rate — requires transaction data from deals closed this quarter, not last year\'s analyst report.',
  },
  {
    num: '07',
    question: 'How do I consolidate 12 vendor relationships without breaking production?',
    context:
      'Vendor sprawl is the silent budget killer. Consolidation saves 20–35%, but the migration risk is real. You need a sequenced plan, not a spreadsheet.',
  },
  {
    num: '08',
    question: 'Can I renegotiate mid-contract — or am I stuck until renewal?',
    context:
      'You\'re almost never stuck. Mid-contract renegotiation is an art — and providers will move if you know where their margin lives. Most enterprises leave this money on the table.',
  },
  {
    num: '09',
    question: 'What\'s the real cost of AI infrastructure beyond the GPU?',
    context:
      'Networking, cooling, power delivery, storage, and interconnection can double the sticker price. The total cost of ownership for AI workloads is fundamentally different from traditional compute.',
  },
  {
    num: '10',
    question: 'Who else just closed this exact deal — and what did they learn?',
    context:
      'The most valuable intelligence isn\'t in a database. It\'s in the head of the CTO who signed the same contract 60 days ago. We connect you with them.',
  },
]
