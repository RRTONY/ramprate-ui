import type { Metadata } from "next";
import TeamBuilderClient from "./TeamBuilderClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Team Architecture | The Flow Circuit",
  description:
    "Map your innovation relay. Take the 12-question assessment individually or join with a team code, then view your team's Energy Matrix and sample reports.",
  alternates: { canonical: "https://ramprate.com/flow/team-builder" },
};

export default function TeamBuilderPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Team Builder", url: "https://ramprate.com/flow/team-builder" },
        ])}
      />
      <ClientOnly>
        <TeamBuilderClient />
      </ClientOnly>
    </>
  );
}
