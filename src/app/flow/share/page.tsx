import type { Metadata } from "next";
import ShareResultsClient from "./ShareResultsClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Shared Assessment Result | The Flow Circuit",
  description:
    "View a shared Flow Circuit assessment result — see the role, energy distribution, and personalized report for this shared link.",
  alternates: { canonical: "https://flow.tonygreenberg.com/share" },
};

export default function SharePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Share", url: "https://ramprate.com/flow/share" },
        ])}
      />
      <ClientOnly>
        <ShareResultsClient />
      </ClientOnly>
    </>
  );
}
