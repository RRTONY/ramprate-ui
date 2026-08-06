import type { Metadata } from "next";
import FindYourPathClient from "./FindYourPathClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Find Your Frequency | The Flow Circuit",
  description:
    "Five portals into the same truth: your Energy DNA, Soul Blueprint, Tribe Circuit, Impact Vector, and Sacred Element. Discover where to begin your self-discovery journey across the Greenberg Ecosystem.",
  alternates: { canonical: "https://ramprate.com/flow/find-your-path" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Find Your Path", url: "https://ramprate.com/flow/find-your-path" },
        ])}
      />
      <ClientOnly>
        <FindYourPathClient />
      </ClientOnly>
    </>
  );
}
