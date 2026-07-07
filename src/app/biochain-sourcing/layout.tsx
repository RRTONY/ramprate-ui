import type { Metadata } from "next";
import JsonLd, {
  serviceJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/components/shared/JsonLd";
import { faqs } from "./faq-data";

export const metadata: Metadata = {
  title: "BioChain Sourcing - Verified Biologics Procurement",
  description:
    "RampRate's BioChain practice: verified sourcing for peptides, exosomes, stem cells, and regenerative biologics. 24 years of procurement intelligence applied to the healing economy.",
  keywords: [
    "peptide sourcing",
    "exosome sourcing",
    "stem cell procurement",
    "regenerative medicine supply chain",
    "biologics vendor sourcing",
    "NAD+ sourcing",
  ],
  alternates: { canonical: "/biochain-sourcing" },
  openGraph: {
    title: "BioChain Sourcing | RampRate",
    description:
      "Verified sourcing intelligence for peptides, exosomes, stem cells, and regenerative biologics.",
    url: "https://ramprate.com/biochain-sourcing",
  },
};

export default function BioChainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: "BioChain Sourcing",
          description:
            "Verified sourcing advisory for peptides, exosomes, stem cells, and regenerative biologics - vendor qualification, benchmarked pricing, and contract negotiation.",
          url: "https://ramprate.com/biochain-sourcing",
          serviceType: "Biologics sourcing advisory",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          {
            name: "BioChain Sourcing",
            url: "https://ramprate.com/biochain-sourcing",
          },
        ])}
      />
      <JsonLd
        data={faqJsonLd(
          faqs.map((f) => ({ question: f.question, answer: f.answer })),
        )}
      />
      {children}
    </>
  );
}
