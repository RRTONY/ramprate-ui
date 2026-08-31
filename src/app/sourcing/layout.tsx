import type { Metadata } from "next";
import JsonLd, {
  serviceJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/components/shared/JsonLd";
import { pressingQuestions } from "./pressing-questions";
import { getPageSeo, withSeoOverrides } from "@/lib/sanity/seo";

const FALLBACK_METADATA: Metadata = {
  title: "Enterprise IT Infrastructure Consulting Services",
  description:
    "Independent IT Infrastructure Consulting Services for data center, cloud, and GPU compute. RampRate benchmarks pricing and negotiates SLAs to cut infrastructure spend.",
  keywords: [
    "IT infrastructure consulting services",
    "IT infrastructure consulting",
    "digital infrastructure advisory",
    "infrastructure advisory services",
    "data center consultant",
    "strategic sourcing consulting",
    "cloud cost optimization",
    "GPU compute sourcing",
    "supplier SLA negotiation",
  ],
  alternates: { canonical: "/sourcing" },
  openGraph: {
    title: "Enterprise IT Infrastructure Consulting Services | RampRate",
    description:
      "Independent IT Infrastructure Consulting Services for data center, cloud, and GPU compute. RampRate benchmarks pricing and negotiates SLAs to cut infrastructure spend.",
    url: "https://ramprate.com/sourcing",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Enterprise IT Infrastructure Consulting Services | RampRate",
    description:
      "Independent IT Infrastructure Consulting Services for data center, cloud, and GPU compute. RampRate benchmarks pricing and negotiates SLAs to cut infrastructure spend.",
    images: ["/og.png"],
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
          name: "Enterprise IT Infrastructure Consulting Services",
          description:
            "Independent IT infrastructure consulting and digital infrastructure advisory for data center, cloud, GPU compute, and network - benchmarking pricing, negotiating SLAs, and reducing enterprise technology spend.",
          url: "https://ramprate.com/sourcing",
          serviceType: "IT infrastructure consulting services",
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
