import type { Metadata } from "next";
import InspirationsClient from "./InspirationsClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Inspirations | The Minds Behind The Flow Circuit",
  description:
    "The thinkers, researchers, and practitioners whose work shaped The Flow Circuit — from Al Fahden's Team Dimensions to Csikszentmihalyi's flow state, Belbin's team roles, and the research citations behind the assessment.",
  alternates: { canonical: "https://ramprate.com/flow/inspirations" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Inspirations", url: "https://ramprate.com/flow/inspirations" },
        ])}
      />
      <ClientOnly>
        <InspirationsClient />
      </ClientOnly>
    </>
  );
}
