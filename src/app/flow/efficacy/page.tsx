import type { Metadata } from "next";
import EfficacyReportClient from "./EfficacyReportClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Efficacy Report | The Flow Circuit",
  description:
    "Does Deep Calibration actually work? A Monte Carlo simulation of 10,000 synthetic respondents measuring classification accuracy, test-retest reliability, faking resistance, and role distribution bias - full methodology and limitations disclosed.",
  alternates: { canonical: "https://ramprate.com/flow/efficacy" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Efficacy", url: "https://ramprate.com/flow/efficacy" },
        ])}
      />
      <ClientOnly>
        <EfficacyReportClient />
      </ClientOnly>
    </>
  );
}
