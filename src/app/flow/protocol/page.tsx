import type { Metadata } from "next";
import ProtocolClient from "./ProtocolClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "The Protocol | The Operating Manual for High-Performance Teams",
  description:
    "The rules of engagement for the Flow Circuit: how the baton passes from Spark to Amplifier to Filter to Ground, the Facilitator's role, and how teams navigate resistance to a new operating system.",
  alternates: { canonical: "https://ramprate.com/flow/protocol" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Protocol", url: "https://ramprate.com/flow/protocol" },
        ])}
      />
      <ClientOnly>
        <ProtocolClient />
      </ClientOnly>
    </>
  );
}
