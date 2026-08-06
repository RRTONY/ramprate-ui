import type { Metadata } from "next";
import BioClient from "./BioClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Tony Greenberg | Architect of the Invisible",
  description:
    "Meet Tony Greenberg, founder of RampRate and creator of The Flow Circuit — an entrepreneur turned architect of human operating systems, bridging business impact with the science of human energy.",
  alternates: { canonical: "https://ramprate.com/flow/bio" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Bio", url: "https://ramprate.com/flow/bio" },
        ])}
      />
      <ClientOnly>
        <BioClient />
      </ClientOnly>
    </>
  );
}
