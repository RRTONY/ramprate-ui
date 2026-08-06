import type { Metadata } from "next";
import TeamDashboardClient from "./TeamDashboardClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Team Dashboard | The Flow Circuit",
  description:
    "Circuit Command: your team's live Energy Matrix, role distribution, friction points, and hiring gaps, mapped from every completed Flow Circuit assessment.",
  alternates: { canonical: "https://flow.tonygreenberg.com/team-dashboard" },
};

export default function TeamDashboardPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Team Dashboard", url: "https://ramprate.com/flow/team-dashboard" },
        ])}
      />
      <ClientOnly>
        <TeamDashboardClient />
      </ClientOnly>
    </>
  );
}
