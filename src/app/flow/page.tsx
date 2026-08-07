import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import JsonLd, {
  serviceJsonLd,
  breadcrumbJsonLd,
} from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Stop Fighting Your Nature",
  description:
    "Discover your natural energy role in 5 minutes. The Flow Circuit maps the invisible architecture of team performance - Spark, Amplifier, Filter, Ground, or Conductor. Used by teams at RampRate, ImpactSoul, and more.",
  alternates: { canonical: "https://ramprate.com/flow" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: "The Flow Circuit",
          description:
            "Discover your natural energy role in 5 minutes with The Flow Circuit, a team and relationship assessment platform that maps the invisible architecture of team performance.",
          url: "https://ramprate.com/flow",
          serviceType: "Team and relationship assessment platform",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
        ])}
      />
      <HomeClient />
    </>
  );
}
