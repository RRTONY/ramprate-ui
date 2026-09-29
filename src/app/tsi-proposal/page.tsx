import { isPortalUnlocked } from "@/lib/portal-auth";
import type { PortalId } from "@/lib/portal-auth";
import PortalGate from "@/components/portal/PortalGate";
import { TSI_PROPOSAL_HTML } from "./proposal-content";

// "tsi-proposal" is not yet a registered portal id: src/lib/portal-auth.ts (off-limits to this
// tool) needs a matching entry + password env var added before this actually unlocks. See the
// handoff note left for the team. Cast is temporary, remove once that's wired up.
const PORTAL_ID = "tsi-proposal" as PortalId;

export const metadata = {
  title: "TSI Group — Channel Strategy Proposal",
  robots: { index: false, follow: false },
};

export default async function TsiProposalPage() {
  const unlocked = await isPortalUnlocked(PORTAL_ID);

  if (!unlocked) {
    return (
      <PortalGate
        portalId={PORTAL_ID}
        title="TSI Group — Channel Strategy Proposal"
        subtitle="Confidential draft proposal. Enter the access code to view."
      />
    );
  }

  return (
    <iframe
      title="TSI Group Channel Strategy Proposal"
      srcDoc={TSI_PROPOSAL_HTML}
      className="fixed inset-0 h-screen w-full border-0"
    />
  );
}
