import type { Metadata } from "next";
import TeamComparisonClient from "./TeamComparisonClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Team Comparison | The Flow Circuit",
  description:
    "Side-by-side Flow Circuit analysis for two teams - see where energy profiles align, where they clash, and what gaps a merger or integration would fill.",
  alternates: { canonical: "https://flow.tonygreenberg.com/team-comparison" },
};

export default function TeamComparisonPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          {
            name: "Team Comparison",
            url: "https://ramprate.com/flow/team-comparison",
          },
        ])}
      />
      <ClientOnly>
        <TeamComparisonClient />
      </ClientOnly>
    </>
  );
}
