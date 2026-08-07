import type { Metadata } from "next";
import EnterpriseDashboardClient from "./EnterpriseDashboardClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Circuit Health Dashboard - Enterprise Team View",
  description:
    "See your team's full Flow Circuit role composition at a glance - circuit health score, role distribution, gaps, and strengths, with optimization recommendations for enterprise teams.",
  alternates: {
    canonical: "https://flow.tonygreenberg.com/enterprise-dashboard",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          {
            name: "Enterprise Dashboard",
            url: "https://ramprate.com/flow/enterprise-dashboard",
          },
        ])}
      />
      <ClientOnly>
        <EnterpriseDashboardClient />
      </ClientOnly>
    </>
  );
}
