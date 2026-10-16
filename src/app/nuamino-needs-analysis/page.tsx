import type { Metadata } from "next";
import "../active-pharm-form/active-pharm-form.css";
import { NuAminoForm } from "./NuAminoForm";

export const metadata: Metadata = {
  title: { absolute: "NuAmino Needs Analysis | RampRate" },
  description:
    "Private needs analysis questionnaire for NuAmino, prepared by RampRate.",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default function NuAminoNeedsAnalysisPage() {
  return <NuAminoForm />;
}
