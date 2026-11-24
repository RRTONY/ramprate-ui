import type { Metadata } from "next";
import { cookies } from "next/headers";
import CatoStrategicGate from "./CatoStrategicGate";
import BriefViewer from "./brief/BriefViewer";
import DesktopBrief from "./brief/DesktopBrief";
import MobileBrief from "./brief/MobileBrief";
import { catoMono, catoSerif } from "./brief/fonts";
import { AUTH_COOKIE, validSession } from "./private/access";
import "./brief/brief.css";

export const metadata: Metadata = {
  title: "Cato Digital Strategic Financing Brief | RampRate",
  robots: { index: false, follow: false, nocache: true },
};

// The brief is rendered on the server only for a signed-in reader (cookie set
// by ./content after the password check). Reading the cookie makes this page
// dynamic and uncached, and keeps the brief out of every public file.
export default async function CatoStrategicBriefPage() {
  const signedIn = validSession(
    (await cookies()).get(AUTH_COOKIE)?.value,
    process.env.PORTAL_AUTH_SECRET ?? "",
  );
  if (!signedIn) return <CatoStrategicGate />;

  return (
    <div className={`${catoSerif.variable} ${catoMono.variable}`}>
      <BriefViewer desktop={<DesktopBrief />} mobile={<MobileBrief />} />
    </div>
  );
}
