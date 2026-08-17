import type { Metadata } from "next";
import JsonLd, {
  serviceJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/components/shared/JsonLd";
import { faqs } from "../biochain/(overview)/faq-data";

export const metadata: Metadata = {
  title: "BioChain Sourcing - Verified Biologics Procurement",
  description:
    "RampRate's BioChain practice: verified sourcing for peptides, exosomes, stem cells, and regenerative biologics. 24 years of procurement intelligence applied to the healing economy.",
  keywords: [
    "peptide sourcing",
    "exosome sourcing",
    "stem cell procurement",
    "regenerative medicine supply chain",
    "biologics supplier sourcing",
    "NAD+ sourcing",
    "peptide marketplace",
    "peptide supplier network",
    "verified peptide suppliers",
    "B2B peptide sourcing",
    "research peptides",
    "BPC-157",
    "TB-500",
    "semaglutide",
    "tirzepatide",
    "research-use-only (RUO) peptides",
    "compounded pharmacy peptides",
    "peptide synthesis",
    "Certificate of Analysis (COA) verified",
    "cGMP certified peptide manufacturer",
  ],
  // Same page body as /biochain (see page.tsx's re-export) - canonical points
  // at /biochain rather than itself so Google consolidates ranking signal
  // there instead of treating these as two competing duplicate pages. This
  // URL stays live (old links/bookmarks keep working), it just won't be
  // indexed as its own separate result.
  alternates: { canonical: "/biochain" },
  openGraph: {
    title: "BioChain Sourcing | RampRate",
    description:
      "Verified sourcing intelligence for peptides, exosomes, stem cells, and regenerative biologics.",
    url: "https://ramprate.com/biochain-sourcing",
  },
};

export default function BioChainSourcingLayout({
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
            "Verified sourcing advisory for peptides, exosomes, stem cells, and regenerative biologics - supplier qualification, validated pricing, and contract negotiation.",
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
