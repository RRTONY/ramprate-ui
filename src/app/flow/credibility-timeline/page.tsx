import type { Metadata } from "next";
import CredibilityTimelineClient from "./CredibilityTimelineClient";
import { ClientOnly } from "@/components/flow/ClientOnly";

export const metadata: Metadata = {
  title: "25 Years of Pattern Recognition — The Flow Circuit Timeline",
  description:
    "The credibility timeline behind The Flow Circuit: from RampRate's founding in 2000 through Harvard, Davos, $40B in managed transactions, and the 2025 platform launch.",
  alternates: { canonical: "https://ramprate.com/flow/credibility-timeline" },
};

export default function Page() {
  return (
    <ClientOnly>
      <CredibilityTimelineClient />
    </ClientOnly>
  );
}
