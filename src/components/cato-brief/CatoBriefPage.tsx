import type { ReactNode } from "react";
import { isSignedIn } from "@/lib/cato-brief/routes";
import { CATO_BRIEFS, type CatoBrief } from "@/lib/cato-brief/access";
import BriefGate from "./BriefGate";
import BriefViewer from "./BriefViewer";
import { catoMono, catoSerif } from "./fonts";
import "./brief.css";

/**
 * A password-protected Cato brief page. The brief's two layouts are rendered
 * on the server only for a signed-in reader, so the brief never ships in
 * public JavaScript (reading the cookie also makes the page dynamic and
 * uncached). Signed out, only the password screen is sent.
 */
export default async function CatoBriefPage({
  brief,
  desktop,
  mobile,
}: {
  brief: CatoBrief;
  desktop: ReactNode;
  mobile: ReactNode;
}) {
  if (!(await isSignedIn(brief))) {
    return <BriefGate signInUrl={`${CATO_BRIEFS[brief].path}/content`} />;
  }
  return (
    <div className={`${catoSerif.variable} ${catoMono.variable}`}>
      <BriefViewer desktop={desktop} mobile={mobile} />
    </div>
  );
}
