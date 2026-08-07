import type { Metadata } from "next";
import SoulPrintLayerClient from "./SoulPrintLayerClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Consciousness Layer | The Flow Circuit",
  description:
    "A deeper lens on who you are - an optional consciousness layer drawing from Enneagram, Human Design, Astrology, and Numerology that sits alongside your Flow Circuit profile.",
  alternates: { canonical: "https://flow.tonygreenberg.com/consciousness" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          {
            name: "Consciousness",
            url: "https://ramprate.com/flow/consciousness",
          },
        ])}
      />
      <ClientOnly>
        <SoulPrintLayerClient />
      </ClientOnly>
    </>
  );
}
