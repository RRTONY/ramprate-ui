import type { Metadata } from "next";
import HomeContent from "@/components/home/HomeContent";

export const revalidate = 60;

export const metadata: Metadata = {
  // No title override - inherits the root layout's default
  // ("RampRate - Investment & Advisory") verbatim, with no "| RampRate"
  // suffix appended (that suffix only applies to child-route titles).
  description:
    "RampRate is a B-Corp certified advisory firm helping enterprises optimize IT infrastructure sourcing, cut technology costs, and drive measurable impact. 24+ years of independent advisory.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "RampRate - Investment & Advisory",
    description:
      "Independent advisory helping enterprises optimize IT infrastructure sourcing, cut technology costs, and drive measurable impact.",
    url: "https://ramprate.com",
  },
};

export default function HomePage() {
  return <HomeContent />;
}
