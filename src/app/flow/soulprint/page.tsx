import type { Metadata } from "next";
import SoulPrintClient from "./SoulPrintClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "SoulPrint | The Flow Circuit",
  description:
    "8 ancient + modern frameworks. One AI-synthesized portrait of your soul's operating system - the thing you can't run from, rendered in language you can finally understand.",
  alternates: { canonical: "https://flow.tonygreenberg.com/soulprint" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "SoulPrint", url: "https://ramprate.com/flow/soulprint" },
        ])}
      />
      <ClientOnly>
        <SoulPrintClient />
      </ClientOnly>
    </>
  );
}
