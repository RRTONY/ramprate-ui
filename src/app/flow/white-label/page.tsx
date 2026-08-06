import type { Metadata } from "next";
import WhiteLabelClient from "./WhiteLabelClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "White-Label Configuration | The Flow Circuit",
  description:
    "Embed the Flow Circuit assessment in your own platform with custom branding. Admin tools for embed codes, REST API access, and webhook payloads for enterprise white-label deployments.",
  alternates: { canonical: "https://flow.tonygreenberg.com/white-label" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "White Label", url: "https://ramprate.com/flow/white-label" },
        ])}
      />
      <ClientOnly>
        <WhiteLabelClient />
      </ClientOnly>
    </>
  );
}
