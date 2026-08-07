import type { Metadata } from "next";
import IntelClient from "./IntelClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Mission Critical Intel | Signal in the Noise",
  description:
    "Foundational texts bridging silicon and soul, compute and consciousness - curated commentary on assessments in the news plus the essays shaping how we think about AI, work, and human potential.",
  alternates: { canonical: "https://ramprate.com/flow/intel" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Intel", url: "https://ramprate.com/flow/intel" },
        ])}
      />
      <ClientOnly>
        <IntelClient />
      </ClientOnly>
    </>
  );
}
