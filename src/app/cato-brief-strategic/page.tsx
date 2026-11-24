import type { Metadata } from "next";
import CatoStrategicGate from "./CatoStrategicGate";

export const metadata: Metadata = {
  title: "Cato Digital Strategic Financing Brief | RampRate",
  robots: { index: false, follow: false, nocache: true },
};

export default function CatoStrategicBriefPage() {
  return <CatoStrategicGate />;
}
