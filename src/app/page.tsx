import type { Metadata } from "next";
import HomeContent from "@/components/home/HomeContent";
import { getPageSeo, withSeoOverrides } from "@/lib/sanity/seo";

export const revalidate = 60;

const FALLBACK_METADATA: Metadata = {
  // No title override - inherits the root layout's default
  // ("RampRate - Investment & Advisory") verbatim, with no "| RampRate"
  // suffix appended (that suffix only applies to child-route titles).
  description:
    "RampRate is a B-Corp certified advisory firm helping enterprises optimize IT infrastructure sourcing, cut technology costs, and drive measurable impact - plus verified peptide supplier sourcing through RampRate BioChain. 24+ years of independent advisory.",
  keywords: [
    "IT infrastructure advisory",
    "enterprise IT sourcing",
    "data center procurement",
    "supplier negotiation",
    "B Corp advisory",
    "RampRate",
    "peptide supplier network",
    "verified peptide suppliers",
    "peptide sourcing",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "RampRate - Investment & Advisory",
    description:
      "Independent advisory helping enterprises optimize IT infrastructure sourcing, cut technology costs, and drive measurable impact.",
    url: "https://ramprate.com",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageSeo("/");
  return withSeoOverrides(FALLBACK_METADATA, data?.seo);
}

export default function HomePage() {
  return <HomeContent />;
}
