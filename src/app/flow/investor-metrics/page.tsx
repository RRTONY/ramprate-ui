import type { Metadata } from "next";
import InvestorMetricsClient from "./InvestorMetricsClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Investor Metrics Dashboard | The Flow Circuit",
  description:
    "Aggregate platform data showing adoption velocity, engagement depth, and market validation signals for The Flow Circuit. Admin-only, screenshot-ready for pitch decks.",
  alternates: { canonical: "https://flow.tonygreenberg.com/investor-metrics" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Investor Metrics", url: "https://ramprate.com/flow/investor-metrics" },
        ])}
      />
      <ClientOnly>
        <InvestorMetricsClient />
      </ClientOnly>
    </>
  );
}
