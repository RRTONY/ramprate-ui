import type { Metadata } from "next";
import CatoBriefGate from "./CatoBriefGate";
export const metadata: Metadata = {
  title: "Cato Digital Financing Brief | RampRate",
  robots: { index: false, follow: false, nocache: true },
};
export default function CatoBriefPage() {
  return <CatoBriefGate />;
}
