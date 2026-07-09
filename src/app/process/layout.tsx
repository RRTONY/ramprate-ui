import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Process - How We Deliver",
  description:
    "RampRate's advisory process aligns the right roles, removes friction, and turns strategy into execution - from ideation to orchestration and measurable results.",
  keywords: [
    "IT sourcing advisory process",
    "enterprise advisory methodology",
    "exclusive mandate advisory",
  ],
  alternates: { canonical: "/process" },
  openGraph: {
    title: "Our Process - How RampRate Delivers",
    description:
      "How RampRate aligns roles, removes friction, and turns strategy into execution.",
    url: "https://ramprate.com/process",
  },
};

export default function ProcessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
