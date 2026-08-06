import type { Metadata } from "next";
import AlphaInviteClient from "./AlphaInviteClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Join the Alpha | The Flow Circuit",
  description:
    "Be one of 10 companies to pilot The Flow Circuit. Create your team, get a single invite link, and see your group's Energy Matrix and friction points.",
  alternates: { canonical: "https://flow.tonygreenberg.com/alpha" },
};

export default function AlphaPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Alpha", url: "https://ramprate.com/flow/alpha" },
        ])}
      />
      <ClientOnly>
        <AlphaInviteClient />
      </ClientOnly>
    </>
  );
}
