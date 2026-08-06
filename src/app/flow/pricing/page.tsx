import type { Metadata } from "next";
import PricingClient from "./PricingClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Pricing | The Flow Circuit",
  description:
    "Individual discovery is free. Team intelligence is where the real ROI lives. Compare Explorer, Tribe, and Enterprise plans for Flow Circuit team mapping.",
  alternates: { canonical: "https://flow.tonygreenberg.com/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Pricing", url: "https://ramprate.com/flow/pricing" },
        ])}
      />
      <ClientOnly>
        <PricingClient />
      </ClientOnly>
    </>
  );
}
