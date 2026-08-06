import type { Metadata } from "next";
import WhyTeamsFailClient from "./WhyTeamsFailClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Why Teams Fail | Four Circuit Failure Patterns",
  description:
    "It's never about talent. Diagnose the four team circuit failures — the All-Spark Team, the Ghost Circuit, the Trust Deficit, and the Filter Trap — and learn the fix for each.",
  alternates: { canonical: "https://ramprate.com/flow/why-teams-fail" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Why Teams Fail", url: "https://ramprate.com/flow/why-teams-fail" },
        ])}
      />
      <ClientOnly>
        <WhyTeamsFailClient />
      </ClientOnly>
    </>
  );
}
