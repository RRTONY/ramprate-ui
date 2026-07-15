import type { Metadata } from "next";
import JsonLd, {
  serviceJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/components/shared/JsonLd";
import { pressingQuestions } from "./pressing-questions";
import { getPageSeo, withSeoOverrides } from "@/lib/sanity/seo";

const FALLBACK_METADATA: Metadata = {
  title: "IT & Data Center Sourcing Advisory",
  description:
    "Independent sourcing advisory for data center, cloud, GPU compute, and network. RampRate benchmarks pricing, negotiates SLAs, and helps enterprises stop overpaying suppliers.",
  keywords: [
    "IT sourcing advisory",
    "data center procurement",
    "cloud cost optimization",
    "GPU compute sourcing",
    "supplier SLA negotiation",
    "network infrastructure sourcing",
  ],
  alternates: { canonical: "/sourcing" },
  openGraph: {
    title: "IT & Data Center Sourcing Advisory | RampRate",
    description:
      "Benchmark pricing, negotiate SLAs, and cut technology spend with independent sourcing advisory.",
    url: "https://ramprate.com/sourcing",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageSeo("/sourcing");
  return withSeoOverrides(FALLBACK_METADATA, data?.seo);
}

export default function SourcingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: "IT & Data Center Sourcing Advisory",
          description:
            "Independent sourcing advisory for data center, cloud, GPU compute, and network - benchmarking pricing, negotiating SLAs, and reducing enterprise technology spend.",
          url: "https://ramprate.com/sourcing",
          serviceType: "IT infrastructure sourcing advisory",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Sourcing", url: "https://ramprate.com/sourcing" },
        ])}
      />
      <JsonLd
        data={faqJsonLd(
          pressingQuestions.map((q) => ({
            question: q.question,
            answer: q.context,
          })),
        )}
      />
      {children}
    </>
  );
}
