import type { Metadata } from "next";
import ReportsDashboardClient from "./ReportsDashboardClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Reports Dashboard | The Flow Circuit",
  description:
    "Admin dashboard for The Flow Circuit — browse individual assessment reports, filter by domain and role, and generate individual or team PDF reports.",
  alternates: { canonical: "https://flow.tonygreenberg.com/reports" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Reports", url: "https://ramprate.com/flow/reports" },
        ])}
      />
      <ClientOnly>
        <ReportsDashboardClient />
      </ClientOnly>
    </>
  );
}
