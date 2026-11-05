import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ClientIntakeForm from "@/components/biochain/ClientIntakeForm";
import { TOTAL_FIELD_COUNT } from "@/lib/client-intake-fields";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Client Intake Application - BioChain Sourcing",
  description: `RampRate BioChain Sourcing's 8-section, ${TOTAL_FIELD_COUNT}-field client intake. Covers your organization, current sourcing, full product catalog, logistics & pricing, spend, compliance profile, customers, and goals - so we can scope your sourcing audit.`,
  keywords: [
    "client intake",
    "become a client",
    "become a customer",
    "patient intake",
    "clinic intake",
    "sourcing audit",
    "sourcing application",
    "biochain sourcing",
    "peptide sourcing",
    "exosomes",
    "stem cells",
    "NAD+",
    "healthcare organization",
    "clinic application",
    "peptide clinic supplier",
    "wholesale peptide supplier",
    "bulk peptide sourcing",
    "peptide distributor vetting",
  ],
  alternates: { canonical: "/biochain/buyer-intake" },
  openGraph: {
    title: "Client Intake Application - BioChain Sourcing | RampRate",
    description: `RampRate BioChain Sourcing's ${TOTAL_FIELD_COUNT}-field client intake for clinics and healthcare organizations sourcing peptides, exosomes, stem cells, and NAD+.`,
    url: "https://ramprate.com/biochain/buyer-intake",
  },
};

export default function ClientIntakePage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "BioChain", url: "https://ramprate.com/biochain" },
          {
            name: "Buyer Intake",
            url: "https://ramprate.com/biochain/buyer-intake",
          },
        ])}
      />
      {/* Hero */}
      <section className="section-light pt-40 pb-20 border-b border-black/10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase mb-4 block text-[oklch(0.52_0.12_70)]">
            RampRate BioChain Sourcing
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink mb-6 leading-tight">
            Client Intake Application
          </h1>
          <p className="font-body text-ink-mid text-lg leading-relaxed mb-10 max-w-2xl">
            An 8-section intake covering your organization, current sourcing,
            full product catalog, and goals, so we can scope your sourcing audit
            before the first call. No fee. No obligation. Confidential.
          </p>
          <Link
            href="/biochain/catalogue-access"
            className="font-body inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4 text-[oklch(0.45_0.1_65)] hover:opacity-80"
          >
            Browse our full product catalogue first
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Multi-step form */}
      <section className="section-warm py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <ClientIntakeForm />
        </div>
      </section>
    </main>
  );
}
