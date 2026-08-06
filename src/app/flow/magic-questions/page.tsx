import type { Metadata } from "next";
import MagicQuestionsClient from "./MagicQuestionsClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "10 Magic Questions to Make Your Project Go Right",
  description:
    "Tony Greenberg's original framework for kicking assumptions before they kick you — 10 interactive project questions, each mapped to a Flow Circuit role: Spark, Amplifier, Filter, Ground, and Conductor.",
  alternates: { canonical: "https://ramprate.com/flow/magic-questions" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Magic Questions", url: "https://ramprate.com/flow/magic-questions" },
        ])}
      />
      <ClientOnly>
        <MagicQuestionsClient />
      </ClientOnly>
    </>
  );
}
