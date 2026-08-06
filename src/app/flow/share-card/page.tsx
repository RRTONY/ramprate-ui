import type { Metadata } from "next";
import ShareCardClient from "./ShareCardClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Your Flow Card | The Flow Circuit",
  description:
    "Generate and share your Flow Circuit results card — a downloadable, shareable graphic of your energy DNA role and purity score, ready for LinkedIn or your team.",
  alternates: { canonical: "https://flow.tonygreenberg.com/share-card" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Share Card", url: "https://ramprate.com/flow/share-card" },
        ])}
      />
      <ClientOnly>
        <ShareCardClient />
      </ClientOnly>
    </>
  );
}
