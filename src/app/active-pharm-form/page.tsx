import type { Metadata } from "next";
import "./active-pharm-form.css";
import { ActivePharmForm } from "./ActivePharmForm";

// Private, client-specific intake sent directly to TheActivePharm - not
// public marketing content, same noindex rationale/approach as
// src/app/kumbaya/page.tsx.
export const metadata: Metadata = {
  title: { absolute: "TheActivePharm Supply Chain Intake — RampRate" },
  description:
    "Supply chain baseline intake for TheActivePharm, prepared by RampRate.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
  },
  other: {
    GPTBot: "noindex,nofollow,noarchive,nosnippet,noimageindex",
    ClaudeBot: "noindex,nofollow,noarchive,nosnippet,noimageindex",
  },
};

export default function ActivePharmFormPage() {
  return <ActivePharmForm />;
}
