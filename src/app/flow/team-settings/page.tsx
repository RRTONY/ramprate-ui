import type { Metadata } from "next";
import TeamSettingsClient from "./TeamSettingsClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Team Settings | The Flow Circuit",
  description:
    "Configure your team's Flow Circuit — branding, logo, Slack integration, and weekly energy report notifications.",
  alternates: { canonical: "https://flow.tonygreenberg.com/team-settings" },
};

export default function TeamSettingsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Team Settings", url: "https://ramprate.com/flow/team-settings" },
        ])}
      />
      <ClientOnly>
        <TeamSettingsClient />
      </ClientOnly>
    </>
  );
}
