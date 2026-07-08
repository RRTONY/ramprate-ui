export interface SitePage {
  title: string;
  path: string;
  type: "page" | "blog" | "practice";
  keywords: string;
  description: string;
}

export const SITE_PAGES: SitePage[] = [
  {
    title: "Sourcing - Enterprise IT Advisory",
    path: "/sourcing",
    type: "practice",
    keywords:
      "data center colocation cloud hosting telecom network infrastructure procurement vendor negotiation CIO sourcing SPY Index",
    description:
      "Enterprise IT advisory - data center, cloud, telecom, and network infrastructure sourcing, vendor negotiation, and SPY Index benchmarking.",
  },
  {
    title: "Syzygy - Growth Strategy",
    path: "/growth",
    type: "practice",
    keywords:
      "startup founder growth GTM go to market revenue strategy scaling fundraising",
    description:
      "Growth strategy for founders - go-to-market, revenue acceleration, and fundraising advisory.",
  },
  {
    title: "Stratum - Web3 & Blockchain",
    path: "/web3",
    type: "practice",
    keywords: "blockchain crypto token DAO web3 decentralized DeFi",
    description:
      "Web3 and blockchain advisory - token design, DAO governance, and decentralized infrastructure.",
  },
  {
    title: "ImpactSoul - Impact Consulting",
    path: "/impactsoul",
    type: "practice",
    keywords: "impact ESG sustainability B Corp grants NGO regenerative social",
    description:
      "Impact consulting - ESG, B Corp, regenerative projects, and grant management for NGOs and mission-driven organizations.",
  },
  {
    title: "Private Advisory - Executive Advisory",
    path: "/private-advisory",
    type: "practice",
    keywords:
      "crisis management reputation strategy board advisory transaction communications executive media coaching",
    description:
      "Executive advisory for high-stakes moments - crisis management, reputation strategy, board advisory, and media coaching.",
  },
  {
    title: "Vendor Intake - Become a Supplier",
    path: "/vendor-intake",
    type: "page",
    keywords:
      "vendor supplier vendor intake supplier intake vendor registration supplier registration become a supplier become a vendor manufacturing partner peptides peptide supply chain vendor application supplier application due diligence supplier fit index",
    description:
      "Vendor due diligence application for peptide supply and manufacturing partners who want to become a RampRate supplier.",
  },
  {
    title: "Client Intake - BioChain Sourcing Application",
    path: "/client-intake",
    type: "page",
    keywords:
      "client intake become a client become a customer patient intake clinic intake sourcing audit sourcing application biochain sourcing peptide sourcing exosomes stem cells NAD+ healthcare organization clinic application",
    description:
      "Client intake for clinics and healthcare organizations seeking a BioChain Sourcing audit for peptides, exosomes, stem cells, and NAD+.",
  },
  {
    title: "Process - How We Operate",
    path: "/process",
    type: "page",
    keywords: "methodology steps flow circuit",
    description: "How RampRate works - our methodology and engagement process.",
  },
  {
    title: "Proof - Case Results",
    path: "/proof",
    type: "page",
    keywords: "testimonials clients results case studies",
    description:
      "Client testimonials, case studies, and results from RampRate engagements.",
  },
  {
    title: "About - Team & Advisors",
    path: "/about",
    type: "page",
    keywords: "team people leadership tony greenberg",
    description: "The RampRate team, leadership, and advisors.",
  },
  {
    title: "Blog",
    path: "/blog",
    type: "page",
    keywords: "articles writing posts thought leadership",
    description: "RampRate blog - articles and thought leadership.",
  },
  {
    title: "Thinking",
    path: "/thinking",
    type: "page",
    keywords: "insights essays ideas opinion",
    description: "Essays and insights from RampRate.",
  },
  {
    title: "Engage",
    path: "/contact",
    type: "page",
    keywords: "contact form reach out connect engage",
    description: "Get in touch with RampRate.",
  },
  {
    title: "Privacy Policy",
    path: "/privacy",
    type: "page",
    keywords: "privacy data",
    description: "RampRate's privacy policy.",
  },
  {
    title: "Terms of Service",
    path: "/terms",
    type: "page",
    keywords: "terms legal",
    description: "RampRate's terms of service.",
  },
];

export function matchSitePages(query: string, limit = 5): SitePage[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const tokens = q.split(/\s+/);
  return SITE_PAGES.filter((item) => {
    const hay = `${item.title} ${item.keywords}`.toLowerCase();
    return tokens.every((tok) => hay.includes(tok));
  }).slice(0, limit);
}
