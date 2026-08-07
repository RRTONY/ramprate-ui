import type { Metadata } from "next";
import MyJourneyClient from "./MyJourneyClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "My Journey | The Flow Circuit",
  description:
    "Your Flow Circuit self-discovery command center - view your energy DNA results, teams, assessment history, and continue exploring the full ecosystem in one place.",
  alternates: { canonical: "https://flow.tonygreenberg.com/my-journey" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "My Journey", url: "https://ramprate.com/flow/my-journey" },
        ])}
      />
      <ClientOnly>
        <MyJourneyClient />
      </ClientOnly>
    </>
  );
}
