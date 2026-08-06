import type { Metadata } from "next";
import TeamMapPageClient from "./TeamMapPageClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Tribe Energy Map | The Flow Circuit",
  description:
    "See how your team's energy flows. Map every teammate's Flow Circuit role, spot friction pairs, and find the gaps holding your tribe back.",
  alternates: { canonical: "https://flow.tonygreenberg.com/team-map" },
};

export default function TeamMapPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Team Map", url: "https://ramprate.com/flow/team-map" },
        ])}
      />
      <ClientOnly>
        <TeamMapPageClient />
      </ClientOnly>
    </>
  );
}
