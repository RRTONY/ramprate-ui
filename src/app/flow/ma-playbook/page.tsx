import type { Metadata } from "next";
import MAPlaybookClient from "./MAPlaybookClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "The M&A Integration Playbook — Flow Circuit for Mergers",
  description:
    "A 3-phase playbook for merging organizational circuits during M&A — pre-deal due diligence, the Day 1-90 nervous system merge, and the Day 90-365 culture circuit, plus common anti-patterns to avoid.",
  alternates: { canonical: "https://ramprate.com/flow/ma-playbook" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "M&A Playbook", url: "https://ramprate.com/flow/ma-playbook" },
        ])}
      />
      <ClientOnly>
        <MAPlaybookClient />
      </ClientOnly>
    </>
  );
}
