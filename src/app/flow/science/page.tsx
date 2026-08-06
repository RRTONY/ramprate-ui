import type { Metadata } from "next";
import ScienceClient from "./ScienceClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "The Science | Why Who You Are Matters More Than What You Know",
  description:
    "The research behind The Flow Circuit: why innate energy is fixed, why role misfit creates measurable stress, and why balanced teams outperform teams of individual stars — backed by 40 years of performance research.",
  alternates: { canonical: "https://ramprate.com/flow/science" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Science", url: "https://ramprate.com/flow/science" },
        ])}
      />
      <ClientOnly>
        <ScienceClient />
      </ClientOnly>
    </>
  );
}
