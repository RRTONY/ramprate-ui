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
      "data center colocation cloud hosting telecom network infrastructure procurement supplier negotiation CIO sourcing SPY Index",
    description:
      "Enterprise IT advisory - data center, cloud, telecom, and network infrastructure sourcing, supplier negotiation, and SPY Index benchmarking.",
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
    title: "Private Advisory - Because Some Challenges Require More Than an Advisor",
    path: "/private-advisory",
    type: "practice",
    keywords:
      "dispute resolution specialist sourcing coordination equity dispute creditor claim discovery windfall asset protection portfolio remediation litigation support squeezed out operator slow walked creditor protected principal mixed ledger principal",
    description:
      "We source, vet, and coordinate the legal and financial specialists high-stakes disputes require - equity disputes, stalled claims, discovery windfalls, asset protection, and portfolio remediation.",
  },
  {
    title: "Supplier Intake - Become a Supplier",
    path: "/supplier-intake",
    type: "page",
    keywords:
      "supplier vendor supplier intake vendor intake supplier registration vendor registration become a supplier manufacturing partner peptides peptide supply chain supplier application vendor application due diligence supplier fit index peptide supply partner peptide synthesis peptide distributor vetting third-party tested peptides Certificate of Analysis COA verified batch-specific COA chain-of-custody tracking cGMP certified peptide manufacturer independent lab testing",
    description:
      "Quick first-touch application (no uploads, ~2-3 minutes) for peptide supply and manufacturing partners who want to become a RampRate supplier. Suppliers we want to pursue get a longer due-diligence follow-up.",
  },
  {
    title: "Client Intake - BioChain Sourcing Application",
    path: "/client-intake",
    type: "page",
    keywords:
      "client intake become a client become a customer patient intake clinic intake sourcing audit sourcing application biochain sourcing peptide sourcing exosomes stem cells NAD+ healthcare organization clinic application peptide clinic supplier wholesale peptide supplier bulk peptide sourcing peptide distributor vetting",
    description:
      "Client intake for clinics and healthcare organizations seeking a BioChain Sourcing audit for peptides, exosomes, stem cells, and NAD+.",
  },
  {
    title: "Process - How We Operate",
    path: "/process",
    type: "page",
    keywords:
      "methodology steps flow circuit process engagement process how it works workflow project stages timeline",
    description: "How RampRate works - our methodology and engagement process.",
  },
  {
    title: "How We Work - Engagement Model",
    path: "/howwework",
    type: "page",
    keywords:
      "how we work engagement model IT sourcing advisory exclusive mandate fee transparency enterprise advisory RampRate process B Corp advisory deal structure one party fees transparent",
    description:
      "RampRate's engagement model: exclusive mandates, one-party fees, and fully transparent deal structure. 25 years, $10B+ in decisions structured, 250+ enterprise clients.",
  },
  {
    title: "Expertise - Our Five Practices",
    path: "/expertise",
    type: "page",
    keywords:
      "expertise practices services capabilities what we do five practices overview RampRate practices enterprise IT sourcing growth strategy advisory Web3 blockchain advisory impact consulting private advisory dispute resolution",
    description:
      "Five practices. One mission: transparency, skin in the game, and principals who execute.",
  },
  {
    title: "Proof - Case Results",
    path: "/proof",
    type: "page",
    keywords:
      "testimonials clients results case studies proof of work track record client success stories reviews references outcomes savings",
    description:
      "Client testimonials, case studies, and results from RampRate engagements.",
  },
  {
    title: "About - Team & Advisors",
    path: "/about",
    type: "page",
    keywords:
      "team people leadership tony greenberg about us company history who we are founders principals advisors staff",
    description: "The RampRate team, leadership, and advisors.",
  },
  {
    title: "Careers - Work With Principals",
    path: "/careers",
    type: "page",
    keywords:
      "careers jobs hiring join our team work with us employment openings positions apply RampRate careers advisory firm jobs IT sourcing careers principals coalition talent recruiting",
    description:
      "25 years. 250+ global brands. One senior team. No staffing pyramid. No middlemen. Just principals executing end-to-end. Join the coalition.",
  },
  {
    title: "Values - Purpose-Driven Innovation",
    path: "/values",
    type: "page",
    keywords:
      "values mission purpose driven innovation impact preneurs trailblazers ecosystem culture what we stand for principles B Corp",
    description:
      "We build an ecosystem of impact-preneurs and trailblazers powered by opportunities, resources, innovation and human spirit.",
  },
  {
    title: "BioChain Sourcing - Verified Biologics Procurement",
    path: "/biochain-sourcing",
    type: "page",
    keywords:
      "biochain sourcing peptide sourcing exosome sourcing stem cell procurement regenerative medicine supply chain biologics supplier sourcing NAD+ sourcing verified biologics procurement healing economy peptides exosomes stem cells peptide marketplace peptide supplier network verified peptide suppliers B2B peptide sourcing research peptides BPC-157 TB-500 semaglutide tirzepatide research-use-only RUO peptides compounded pharmacy peptides peptide synthesis Certificate of Analysis COA verified cGMP certified peptide manufacturer",
    description:
      "RampRate's BioChain practice: verified sourcing for peptides, exosomes, stem cells, and regenerative biologics. 24 years of procurement intelligence applied to the healing economy.",
  },
  {
    title: "Payments Advisory - RFP Authorship & Processor Negotiation",
    path: "/payments-advisory",
    type: "page",
    keywords:
      "payments advisory payment processing RFP merchant processor negotiation credit card processing fees interchange payment gateway processor RFP payments RFP authorship merchant services",
    description:
      "RampRate writes your payment processing RFP, shops it to 25+ vetted processors, and negotiates the contract on your behalf. For merchants processing $1M+ annually.",
  },
  {
    title: "Service Provider Intelligence Index (SPY Index)",
    path: "/service-provider-intelligence-index",
    type: "page",
    keywords:
      "SPY index service provider intelligence index supplier analysis IT sourcing decisions supplier neutral benchmarking suppliers countries variables deal success savings sourcing intelligence platform",
    description:
      "The first platform for IT sourcing decisions & planning. Supplier-neutral analysis across 350+ suppliers, 80 countries, 315 variables. 99%+ deal success rate. 23.8% average savings.",
  },
  {
    title: "Blog",
    path: "/blog",
    type: "page",
    keywords: "articles writing posts thought leadership news updates blog",
    description: "RampRate blog - articles and thought leadership.",
  },
  {
    title: "Thinking",
    path: "/thinking",
    type: "page",
    keywords: "insights essays ideas opinion thinking articles perspective",
    description: "Essays and insights from RampRate.",
  },
  {
    title: "Engage",
    path: "/contact",
    type: "page",
    keywords:
      "contact form reach out connect engage get in touch talk to us schedule a call",
    description: "Get in touch with RampRate.",
  },
  {
    title: "Privacy Policy",
    path: "/privacy",
    type: "page",
    keywords: "privacy data policy personal information",
    description: "RampRate's privacy policy.",
  },
  {
    title: "Terms of Service",
    path: "/terms",
    type: "page",
    keywords: "terms legal conditions agreement",
    description: "RampRate's terms of service.",
  },
];

const SEARCH_STOPWORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "of",
  "to",
  "for",
  "in",
  "on",
  "at",
  "is",
  "it",
]);

export function matchSitePages(query: string, limit = 5): SitePage[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const allTokens = q.split(/\s+/).filter(Boolean);
  // Drop low-signal stopwords so e.g. "Become a Supplier" doesn't pull in
  // unrelated pages just because they happen to contain the letter "a".
  const significant = allTokens.filter((t) => !SEARCH_STOPWORDS.has(t));
  const tokens = significant.length > 0 ? significant : allTokens;

  const scored = SITE_PAGES.map((item) => {
    const title = item.title.toLowerCase();
    const keywords = item.keywords.toLowerCase();
    const description = item.description.toLowerCase();

    let score = 0;
    let matchedCount = 0;
    for (const tok of tokens) {
      // Weight a hit in the title highest, then keywords, then description,
      // so the most relevant page wins ties instead of array order.
      if (title.includes(tok)) score += 5;
      else if (keywords.includes(tok)) score += 2;
      else if (description.includes(tok)) score += 1;
      else continue;
      matchedCount++;
    }
    if (matchedCount === 0) return null;
    if (matchedCount === tokens.length) score += 100;
    return { item, score };
  }).filter((entry): entry is { item: SitePage; score: number } => entry !== null);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((entry) => entry.item);
}
