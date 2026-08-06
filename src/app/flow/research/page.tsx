import type { Metadata } from "next";
import ResearchDashboardClient from "./ResearchDashboardClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Live Research Dashboard | The Flow Circuit",
  description:
    "Real-time validation data from opted-in Flow Circuit participants, comparing theoretical Monte Carlo predictions against actual respondent behavior across role distribution, entropy, and score differentiation.",
  alternates: { canonical: "https://flow.tonygreenberg.com/research" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Research", url: "https://ramprate.com/flow/research" },
        ])}
      />
      <ClientOnly>
        <ResearchDashboardClient />
      </ClientOnly>
    </>
  );
}
