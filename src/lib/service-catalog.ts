export type ServiceCaseProof = {
  client: string;
  context: string;
};

export type ServiceOffering = {
  slug: string;
  title: string;
  navigationLabel: string;
  eyebrow: string;
  summary: string;
  decision: string;
  engagementMoments: string[];
  caseProof: ServiceCaseProof;
};

export const services: ServiceOffering[] = [
  {
    slug: "relationship-specialist-sourcing",
    title: "Relationship & Specialist Sourcing",
    navigationLabel: "Relationship & Specialist Sourcing",
    eyebrow: "Services / Sourcing",
    summary:
      "Find the right technology, specialist, or strategic partner—and make the selection with clarity.",
    decision:
      "You need to know who can deliver, what a good fit looks like, and how to decide without adding avoidable risk.",
    engagementMoments: [
      "Clarify the operating problem, the decision criteria, and the people who need to trust the outcome.",
      "Map the specialist landscape and focus the search on the partners equipped for the work.",
      "Support a selection process that is rigorous, workable, and ready for accountable execution.",
    ],
    caseProof: {
      client: "Microsoft",
      context: "50+ strategy & product studies",
    },
  },
  {
    slug: "deal-partnership-structuring",
    title: "Deal & Partnership Structuring",
    navigationLabel: "Deal & Partnership Structuring",
    eyebrow: "Services / Deals",
    summary:
      "Turn complex supplier, commercial, and strategic relationships into durable agreements.",
    decision:
      "You need a partnership or deal that works for the business—not a contract that creates another operational problem.",
    engagementMoments: [
      "Surface the commercial, operating, and relationship dynamics that determine whether a deal will hold.",
      "Structure options around the outcomes both sides need to achieve.",
      "Support negotiation and implementation so the agreement can work in the real world.",
    ],
    caseProof: {
      client: "eBay",
      context: "$50M in savings & social impact dashboard for data centers",
    },
  },
  {
    slug: "blockchain-tokenization-payment-infrastructure",
    title: "Blockchain, Tokenization & Payment Infrastructure",
    navigationLabel: "Blockchain & Payment Infrastructure",
    eyebrow: "Services / Infrastructure",
    summary:
      "Build the commercial and operating foundation for tokenized, blockchain, and payment initiatives.",
    decision:
      "You need to connect technical possibility with a credible market, operating, and partnership strategy.",
    engagementMoments: [
      "Define the commercial use case before committing to a technology path.",
      "Map the ecosystem, partners, payment flows, and operating dependencies around the initiative.",
      "Translate a complex infrastructure decision into clear steps for leadership, teams, and partners.",
    ],
    caseProof: {
      client: "Intel",
      context: "Digital strategy & alliances research",
    },
  },
  {
    slug: "growth-strategy-fractional-execution",
    title: "Growth Strategy & Fractional Execution",
    navigationLabel: "Growth Strategy & Fractional Execution",
    eyebrow: "Services / Growth",
    summary:
      "Move from a growth decision to accountable delivery with senior, embedded support.",
    decision:
      "You need a practical growth path and the capacity to execute it without separating strategy from day-to-day reality.",
    engagementMoments: [
      "Clarify the commercial decision, operating constraint, and near-term outcome that matter most.",
      "Build a workable plan across people, partners, product, and market priorities.",
      "Stay close enough to execution that decisions turn into forward motion.",
    ],
    caseProof: {
      client: "Riot Games",
      context: "Supported rapid global expansion",
    },
  },
];

export const impactSolService = {
  title: "ImpactSol",
  eyebrow: "A separate RampRate brand",
  summary:
    "Impact, ESG & non-dilutive capital advisory for organisations that need measurable progress and aligned funding.",
  href: "/impactsoul",
  caseProof: {
    client: "XPRIZE",
    context: "$3M+ grant funding managed",
  },
} as const;

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
