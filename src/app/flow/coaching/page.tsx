import type { Metadata } from "next";
import CoachingClient from "./CoachingClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Weekly Coaching | The Flow Circuit",
  description:
    "Get personalized weekly coaching prompts based on your Flow Circuit profile — actions to leverage your strengths, stretch your growth edge, and protect against burnout.",
  alternates: { canonical: "https://flow.tonygreenberg.com/coaching" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Coaching", url: "https://ramprate.com/flow/coaching" },
        ])}
      />
      <ClientOnly>
        <CoachingClient />
      </ClientOnly>
    </>
  );
}
