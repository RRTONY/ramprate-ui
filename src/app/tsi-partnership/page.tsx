import type { Metadata } from "next";
import TsiPartnershipGate from "./TsiPartnershipGate";

export const metadata: Metadata = {
  title: "TSI and RampRate: What We Can Build Together",
  robots: { index: false, follow: false, nocache: true },
};

export default function TsiPartnershipPage() {
  return <TsiPartnershipGate />;
}
