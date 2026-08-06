import type { Metadata } from "next";
import PeerAssessmentClient from "./PeerAssessmentClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "360° Peer Review | The Flow Circuit",
  description: "Answer 12 questions about how a colleague actually shows up in the work, and help them see their perception gap.",
  alternates: { canonical: "https://flow.tonygreenberg.com/peer-assessment" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Peer Assessment", url: "https://ramprate.com/flow/peer-assessment" },
        ])}
      />
      <ClientOnly>
        <PeerAssessmentClient />
      </ClientOnly>
    </>
  );
}
