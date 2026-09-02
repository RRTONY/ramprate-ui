import type { Metadata } from "next";
import HomeContent from "@/components/home/HomeContent";
import { getPageSeo, withSeoOverrides } from "@/lib/sanity/seo";

export const revalidate = 60;

const HOME_TITLE = "RampRate | Data Center, Telecom & Cloud Advisory";
const HOME_DESCRIPTION =
  "RampRate: B Lab-certified advisory turning relationships into revenue via technology sourcing and product strategy — $10B+ managed since 2000.";

const FALLBACK_METADATA: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  keywords: [
    "technology advisory",
    "enterprise IT sourcing",
    "data center procurement",
    "supplier negotiation",
    "B Lab certified advisory",
    "RampRate",
    "peptide supplier network",
    "verified peptide suppliers",
    "peptide sourcing",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "https://ramprate.com",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/og.png"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageSeo("/");
  return withSeoOverrides(FALLBACK_METADATA, data?.seo);
}

export default function HomePage() {
  return <HomeContent />;
}
