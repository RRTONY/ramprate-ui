import type { Metadata } from "next";
import AiDocGate from "./AiDocGate";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "AI Doc Film Tokenization - Ownership Brief",
  description:
    "A complete ownership and tokenization proposal for the AI Documentary Film project - covering token structure, revenue sharing, investment tiers, IP rights, and distribution strategy.",
  alternates: { canonical: "/aidoc-ownership-brief" },
};

export default function AiDocOwnershipBriefPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "AI Doc Ownership Brief", url: "https://ramprate.com/aidoc-ownership-brief" },
        ])}
      />
      <AiDocGate />
    </>
  );
}
