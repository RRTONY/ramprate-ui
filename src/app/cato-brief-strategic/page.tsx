import type { Metadata } from "next";
import CatoBriefPage from "@/components/cato-brief/CatoBriefPage";
import DesktopBrief from "./brief/DesktopBrief";
import MobileBrief from "./brief/MobileBrief";

export const metadata: Metadata = {
  title: "Cato Digital Strategic Financing Brief | RampRate",
  robots: { index: false, follow: false, nocache: true },
};

export default function CatoStrategicBriefPage() {
  return (
    <CatoBriefPage
      brief="strategic"
      desktop={<DesktopBrief />}
      mobile={<MobileBrief />}
    />
  );
}
