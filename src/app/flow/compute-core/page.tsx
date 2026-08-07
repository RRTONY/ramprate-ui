import type { Metadata } from "next";
import ComputeCoreClient from "./ComputeCoreClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Compute Core | Silicon Sanctuary Terminal",
  description:
    "An interactive terminal experience probing the questions AI forces us to ask about purpose, wisdom, and intent - the Silicon Sanctuary interface for The Flow Circuit.",
  alternates: { canonical: "https://ramprate.com/flow/compute-core" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          {
            name: "Compute Core",
            url: "https://ramprate.com/flow/compute-core",
          },
        ])}
      />
      <ClientOnly>
        <ComputeCoreClient />
      </ClientOnly>
    </>
  );
}
