import type { Metadata } from "next";
import KulaProposalGate from "./KulaProposalGate";

export const metadata: Metadata = {
  title: "Kula × RampRate | Engagement Proposal",
  robots: { index: false, follow: false, nocache: true },
};

export default function KulaProposalPage() {
  return <KulaProposalGate />;
}
