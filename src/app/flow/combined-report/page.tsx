import type { Metadata } from "next";
import CombinedReportClient from "./CombinedReportClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "The Combined Report — Flow Circuit DNA + SoulPrint",
  description:
    "Merge your Flow Circuit team DNA with your TrueSelf SoulPrint blueprint. A 12,000-word AI-synthesized report covering your convergence analysis, resistance map, and integration path.",
  alternates: { canonical: "https://ramprate.com/flow/combined-report" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Combined Report", url: "https://ramprate.com/flow/combined-report" },
        ])}
      />
      <ClientOnly>
        <CombinedReportClient />
      </ClientOnly>
    </>
  );
}
