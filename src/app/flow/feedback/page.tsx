import type { Metadata } from "next";
import AlphaFeedbackClient from "./AlphaFeedbackClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Alpha Feedback | The Flow Circuit",
  description:
    "Share your honest impression of The Flow Circuit alpha: rate the accuracy of your individual assessment and the team dynamic report, and suggest improvements.",
  alternates: { canonical: "https://flow.tonygreenberg.com/feedback" },
};

export default function FeedbackPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Feedback", url: "https://ramprate.com/flow/feedback" },
        ])}
      />
      <ClientOnly>
        <AlphaFeedbackClient />
      </ClientOnly>
    </>
  );
}
