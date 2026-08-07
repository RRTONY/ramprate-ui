import type { Metadata } from "next";
import ConductorPlaybookClient from "./ConductorPlaybookClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "The Conductor's Playbook - Rules for Orchestrating Introductions",
  description:
    "A 7-step interactive playbook for the Conductor role: the Mind Meld, the Audit, the Friendly Guidance, the Social Impact Check, and more - the rules for making introductions that actually multiply.",
  alternates: { canonical: "https://ramprate.com/flow/conductor-playbook" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          {
            name: "Conductor Playbook",
            url: "https://ramprate.com/flow/conductor-playbook",
          },
        ])}
      />
      <ClientOnly>
        <ConductorPlaybookClient />
      </ClientOnly>
    </>
  );
}
