export type NuAminoQuestion = {
  id: string;
  label: string;
  understanding?: string;
};
export type NuAminoSection = {
  id: string;
  title: string;
  subtitle: string;
  questions: NuAminoQuestion[];
};

export const NUAMINO_SECTIONS: NuAminoSection[] = [
  {
    id: "business",
    title: "Business snapshot",
    subtitle:
      "Licensing, facilities, customers, technology and operating model",
    questions: [
      {
        id: "licensing",
        label: "What licensing do you hold, and in which states?",
        understanding:
          "503A licensed in all 50 states plus Puerto Rico and DC; based in Las Vegas.",
      },
      {
        id: "nevadaPeptides",
        label:
          "Which specific peptides are covered under your Nevada Board of Pharmacy compounding approval?",
        understanding:
          "Approximately seven peptides approved; exact list not yet available.",
      },
      {
        id: "facilities",
        label:
          "Do you operate any manufacturing facilities beyond Oxnard, and if so, what do they focus on?",
        understanding:
          "DEA-certified GMP facility in Oxnard, California focused on oral thin-film and oral drops; acquired roughly 2.5 years ago.",
      },
      {
        id: "lab",
        label:
          "What lab space do you have, and how much of it is GMP-adjacent?",
        understanding:
          "NuBev Labs in Las Vegas: 30,000 sq ft total, 10,000 sq ft GMP-adjacent.",
      },
      {
        id: "customers",
        label:
          "What does the rest of your customer base look like, beyond the four large MLM clients?",
        understanding:
          "Approximately 52 B2B customers total, including four MLM clients with annual revenues in the $100M–$1.25B range. The other approximately 48 are not yet profiled.",
      },
      {
        id: "revenue",
        label: "What is your current annual revenue?",
        understanding: "Just under $50M.",
      },
      {
        id: "ip",
        label: "What IP do you hold around your delivery technology?",
        understanding: "40+ patents in oral thin-film peptide delivery.",
      },
      {
        id: "capacity",
        label:
          "What's your current production capacity, and how far can it scale?",
        understanding:
          "30,000 oral-drop units per day, scalable to 60,000 per day.",
      },
      {
        id: "portfolio",
        label:
          "What's the rest of the breakdown of your product portfolio, beyond GLP-1?",
        understanding:
          "GLP-1 makes up roughly 30–40% of the peptide portfolio. Delivery is oral-only: drops and oral mucosal/buccal spray; no injectables, pills, or capsules. The remaining product mix is not yet clear.",
      },
      {
        id: "funding",
        label: "How is the business funded?",
        understanding: "Self-funded, no outside investors or debt.",
      },
      {
        id: "marketRole",
        label:
          "How would you describe your role in the market: direct seller or technology/manufacturing partner?",
        understanding:
          "Richard described NuAmino on the October 2 call as a technology company that generally looks for partners to take its products to market.",
      },
    ],
  },
  {
    id: "intake",
    title: "Supplier intake verification",
    subtitle:
      "Confirm whether the September 9 submission under Unwind the Mind Institute applies specifically to NuAmino",
    questions: [
      {
        id: "catalog",
        label: "What's the breadth of your current product catalog?",
        understanding: "All 17 peptides offered in liquid format.",
      },
      {
        id: "pricing",
        label:
          "What's the pricing for the rest of your catalog, beyond BPC-157, TB-500, and GHK-CU?",
        understanding:
          "BPC-157 $70 per 30 ml unit; TB-500 $99 per 30 ml unit; GHK-CU $29 per 30 ml unit. Prices for the other 14 are unknown.",
      },
      {
        id: "moq",
        label: "What's your minimum order quantity?",
        understanding: "Large tier, $25K+.",
      },
      {
        id: "leadTime",
        label: "What's your standard lead time?",
        understanding: "4–8 weeks.",
      },
      {
        id: "terms",
        label: "What are your standard payment terms?",
        understanding: "50% upfront, 50% on delivery.",
      },
      {
        id: "shipping",
        label: "Where do you ship?",
        understanding: "All 50 states.",
      },
      {
        id: "buyers",
        label: "What types of buyers are currently eligible to purchase?",
        understanding: "All account types.",
      },
      {
        id: "monthlyCapacity",
        label: "What's your monthly production capacity?",
        understanding: "100,000 units.",
      },
    ],
  },
  {
    id: "stability",
    title: "Stability testing",
    subtitle: "A discrepancy requiring a direct explanation",
    questions: [
      {
        id: "stabilityTesting",
        label:
          "What does your stability testing actually show, and does it vary by product? Our records show two different claims: the September 9 intake states “accelerated only,” while Richard stated on the October 2 call that semaglutide/tirzepatide have a 360-day beyond-use date supported by real-time testing at 100% activity. Please clarify the evidence and which shelf-life claims are supported.",
      },
    ],
  },
  {
    id: "gtm",
    title: "Go-to-market & customer profiling",
    subtitle:
      "Understand the buyers and channels that best match NuAmino's priorities",
    questions: [
      {
        id: "buyerMix",
        label:
          "Beyond the four large MLM clients, what does your current buyer mix look like?",
      },
      {
        id: "partnershipModel",
        label:
          "What does “partner to go to market with” mean concretely for NuAmino: co-branded product, white-label manufacturing, licensing your formulation, channel development and management, or a pure supply relationship?",
      },
      {
        id: "idealCustomer",
        label:
          "Do you have a defined ideal customer profile, or are you open to whatever channel brings volume?",
      },
      {
        id: "avoidChannels",
        label:
          "Are there any channels or customer types you'd want us to avoid?",
      },
      {
        id: "growthTarget",
        label:
          "What's your growth or volume target for the next 12 months that we should be sourcing buyers toward?",
      },
    ],
  },
  {
    id: "positioning",
    title: "Product & positioning fit",
    subtitle: "Product priorities, branding and documentation",
    questions: [
      {
        id: "priorityProducts",
        label:
          "For new channel development, which products do you most want us to lead with?",
        understanding:
          "The ED/cardiovascular opportunity Richard mentioned on October 2 was an exploratory direction, not a confirmed NuAmino priority.",
      },
      {
        id: "branding",
        label:
          "Can buyers put their own branding on the product, or does everything ship under NuAmino/NuBev branding?",
      },
      {
        id: "documentation",
        label:
          "Do you have regulatory or IP documentation packages you can share with prospective buyers?",
        understanding:
          "This came up on the October 2 call but was not directly addressed.",
      },
    ],
  },
  {
    id: "fulfillment",
    title: "Fulfillment & capacity",
    subtitle: "Available capacity and commercial operating constraints",
    questions: [
      {
        id: "availableCapacity",
        label:
          "Of your current 30,000 units per day capacity, how much is already committed versus available for new channel volume?",
      },
      {
        id: "scaleTrigger",
        label:
          "What's the timeline and trigger for scaling from 30,000 to 60,000 units per day?",
      },
      {
        id: "newBuyerTerms",
        label:
          "Does the 4–8 week lead time and $25K+ minimum order quantity hold for new buyers we bring in, or does it flex with volume commitment?",
      },
    ],
  },
  {
    id: "commercial",
    title: "Commercial structure",
    subtitle:
      "Make sure channel economics and buyer selection criteria are aligned",
    questions: [
      {
        id: "margins",
        label:
          "What does your margin structure typically look like across different types of deals: direct accounts versus distributor/wholesale, large volume versus small?",
        understanding:
          "This helps align a proposed referral structure to the actual deal economics without asking you to set a rate.",
      },
      {
        id: "criteria",
        label:
          "What matters most when evaluating a potential buyer or channel: deal size, speed to close, exclusivity, volume commitment, geographic reach or something else?",
        understanding:
          "This lets us build the appropriate tiers into our proposal rather than negotiating every rate separately.",
      },
      {
        id: "exclusivity",
        label:
          "Are there any existing commitments, relationships or geographies where exclusivity would already be constrained?",
      },
    ],
  },
];
export const NUAMINO_QUESTION_IDS = NUAMINO_SECTIONS.flatMap((s) =>
  s.questions.map((q) => q.id),
);
