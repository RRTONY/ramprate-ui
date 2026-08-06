import type { Metadata } from "next";
import FamilyDynamicClient from "./FamilyDynamicClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Family Dynamic | The Flow Circuit",
  description:
    "The same Flow Circuit that powers teams also runs through families. Map your family's energy roles, spot friction points, and see where the stress really lives.",
  alternates: { canonical: "https://flow.tonygreenberg.com/family" },
};

export default function FamilyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Family", url: "https://ramprate.com/flow/family" },
        ])}
      />
      <ClientOnly>
        <FamilyDynamicClient />
      </ClientOnly>
    </>
  );
}
