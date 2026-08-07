import type { Metadata } from "next";
import AlignmentResultsClient from "./AlignmentResultsClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Your Flow Circuit Results | The Flow Circuit",
  description:
    "Your personalized Flow Circuit report - dominant energy role, energy distribution, stress zones, deep analysis, and team dynamics based on your 12-question assessment.",
  alternates: { canonical: "https://flow.tonygreenberg.com/results" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Results", url: "https://ramprate.com/flow/results" },
        ])}
      />
      <ClientOnly>
        <AlignmentResultsClient />
      </ClientOnly>
    </>
  );
}
