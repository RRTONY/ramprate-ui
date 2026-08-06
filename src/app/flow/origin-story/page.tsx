import type { Metadata } from "next";
import OriginStoryClient from "./OriginStoryClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Origin Story | From the Z Process to The Flow Circuit",
  description:
    "25 years in the making. The timeline from Tony Greenberg's RampRate days and the Al Fahden Team Dimensions discovery through Harvard, Davos, and the 2025 launch of The Flow Circuit.",
  alternates: { canonical: "https://ramprate.com/flow/origin-story" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Origin Story", url: "https://ramprate.com/flow/origin-story" },
        ])}
      />
      <ClientOnly>
        <OriginStoryClient />
      </ClientOnly>
    </>
  );
}
