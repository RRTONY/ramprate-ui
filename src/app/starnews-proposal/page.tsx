import type { Metadata } from "next";
import StarNewsProposalGate from "./StarNewsProposalGate";

export const metadata: Metadata = {
  title: "StarNews × RampRate | Building What Endures",
  robots: { index: false, follow: false, nocache: true },
};

export default function StarNewsProposalPage() {
  return <StarNewsProposalGate />;
}
