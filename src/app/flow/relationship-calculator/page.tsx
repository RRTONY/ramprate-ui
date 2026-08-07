import type { Metadata } from "next";
import RelationshipCalculatorClient from "./RelationshipCalculatorClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "The Relationship Calculator - Flow Circuit Role Dynamics",
  description:
    "Select any two Flow Circuit roles and discover whether the pairing multiplies, complements, or creates productive tension - plus advice for making the relationship work.",
  alternates: {
    canonical: "https://ramprate.com/flow/relationship-calculator",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          {
            name: "Relationship Calculator",
            url: "https://ramprate.com/flow/relationship-calculator",
          },
        ])}
      />
      <ClientOnly>
        <RelationshipCalculatorClient />
      </ClientOnly>
    </>
  );
}
