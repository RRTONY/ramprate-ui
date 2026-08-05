import type { Metadata } from "next";
import JourneyClient from "./JourneyClient";
import { ClientOnly } from "@/components/flow/ClientOnly";

export const metadata: Metadata = {
  title: "The Journey | The Flow Circuit",
  description:
    "From chaos to flow in three phases: individual awakening, team calibration, and daily integration. See how The Flow Circuit turns friction into an operating system.",
  alternates: { canonical: "https://ramprate.com/flow/journey" },
};

export default function JourneyPage() {
  return (
    <ClientOnly>
      <JourneyClient />
    </ClientOnly>
  );
}
