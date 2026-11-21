export const advisoryPractices = [
  {
    name: "Sourcing",
    decision: "Benchmark a technology contract",
    description:
      "Compare pricing, renewal terms and service commitments against deals for comparable infrastructure.",
    href: "/sourcing",
    iconKind: "sourcing",
    accentColor: "var(--gold)",
    darkSectionAccent: "oklch(0.82 0.15 75)",
    topics: [
      "Cloud and data centers",
      "Supplier selection",
      "Contract negotiation",
    ],
  },
  {
    name: "Syzygy",
    decision: "Land an anchor customer",
    description:
      "Identify the enterprise buyer who needs your product. Align the advisors, partners and capital it takes to win that account.",
    href: "/growth",
    iconKind: "syzygy",
    accentColor: "oklch(0.55 0.13 160)",
    darkSectionAccent: "oklch(0.75 0.15 150)",
    topics: ["Anchor clients", "Advisory boards", "US market entry"],
  },
  {
    name: "Stratum",
    decision: "Design a digital asset or network",
    description:
      "Work through token economics, governance and enterprise adoption before committing to a design.",
    href: "/web3",
    iconKind: "stratum",
    accentColor: "oklch(0.55 0.16 265)",
    darkSectionAccent: "oklch(0.79 0.11 280)",
    topics: ["Token design", "Governance", "Enterprise adoption"],
  },
  {
    name: "BioChain",
    decision: "Qualify a health supplier",
    description:
      "Evaluate suppliers, certificates of analysis and chain of custody before choosing a source.",
    href: "/biochain",
    iconKind: "biochain",
    accentColor: "oklch(0.47 0.08 195)",
    darkSectionAccent: "oklch(0.78 0.10 195)",
    topics: ["Supplier qualification", "Documentation", "Traceability"],
  },
  {
    name: "ImpactSoul",
    decision: "Fund a mission and measure its impact",
    description:
      "Design grant programs and funding models with clear responsibilities and outcomes the community can track.",
    href: "/impactsoul",
    iconKind: "impact",
    accentColor: "var(--rust)",
    darkSectionAccent: "oklch(0.78 0.12 30)",
    topics: ["Grant management", "Impact measurement", "Regenerative finance"],
  },
  {
    name: "Torque",
    decision: "Move a stalled dispute forward",
    description:
      "Find the counsel, financial specialists and evidence your matter needs, and coordinate their work around one plan.",
    href: "/torque",
    iconKind: "advisory",
    accentColor: "oklch(0.5 0.1 60)",
    darkSectionAccent: "oklch(0.79 0.12 70)",
    topics: ["Counsel sourcing", "Stalled claims", "Specialist coordination"],
  },
] as const;
