import { isPortalUnlocked } from "@/lib/portal-auth";
import PortalGate from "@/components/portal/PortalGate";
import LegalMasterContent from "./LegalMasterContent";

const allMatters = [
  {
    attorney: "Adam Zaffos",
    portal: "/attorney",
    tracks: [
      {
        track: "Track 1 · URGENT",
        title: "Greenberg v. Hayek Appeal",
        items: [
          "Attorney of record transfer filing - Brian Castorina replacement",
          "Missing transcript identification and cure",
          "Brian Castorina outstanding issues (holds, liens, fee disputes)",
          "Parallel $107K damages case status",
          "Henry Jannol billing dispute resolution",
        ],
        deadline: "Rolling - immediate",
      },
      {
        track: "Track 2 · Active",
        title: "Kodah Matters",
        items: [
          "Full matter log established",
          "Next steps and deadlines documented",
          "Communication cadence defined",
          "Paula introduction - referral/spiff structure discussed",
        ],
        deadline: "March 24",
      },
      {
        track: "Track 3 · Personal",
        title: "Clarisse Abelarde Matters",
        items: [
          "Matter scope defined",
          "Separate communication log set up",
          "Sensitivity protocols established",
        ],
        deadline: "Intake call this week",
      },
      {
        track: "Track 4 · Incoming",
        title: "New Leads & Referrals",
        items: [
          "Keenan - $1M lawsuit (assess fit)",
          "Additional leads logged upon intake",
          "Consumer products representation (pending)",
        ],
        deadline: "Keenan by March 27",
      },
    ],
  },
  {
    attorney: "Henry Jannol",
    portal: "/henry-jannol",
    tracks: [
      {
        track: "Track 1 · Co-Counsel Unwind",
        title: "Greenberg v. Hayek - Co-Counsel Transition",
        items: [
          "Formal withdrawal / substitution confirmed",
          "Outstanding billing dispute resolved - itemized invoice received",
          "Lien or hold on case files disclosed and cleared",
          "All case materials transferred to Adam Zaffos",
          "Retainer funds accounted for - refund or credit applied",
        ],
        deadline: "March 27",
      },
      {
        track: "Track 2 · Billing Dispute",
        title: "Fee Dispute Resolution",
        items: [
          "Complete billing records received",
          "Disputed charges identified and resolved",
          "Confirmed no liens on judgment or settlement proceeds",
          "Final accounting confirmed in writing",
        ],
        deadline: "Initial response March 20",
      },
      {
        track: "Track 3 · Documentation",
        title: "File & Record Transfer",
        items: [
          "Full case file inventory received",
          "All transcripts accounted for and transferred",
          "Copies of all court filings under Jannol signature received",
          "Relevant opposing counsel communications transferred",
        ],
        deadline: "Full transfer March 31",
      },
    ],
  },
  {
    attorney: "Josh Bykowski",
    portal: "/josh-bykowski",
    tracks: [
      {
        track: "Track 1 · Active",
        title: "Open Matters - To Be Defined",
        items: [
          "Full matter log established",
          "Active case names, courts, docket numbers documented",
          "Current status of each matter confirmed",
          "Co-counsel / opposing counsel noted",
        ],
        deadline: "March 31",
      },
      {
        track: "Track 2 · Deadlines",
        title: "Deadline Register",
        items: [
          "All court-mandated deadlines logged",
          "Statute of limitations - approaching ones flagged",
          "Scheduled hearings/depositions/filings (next 90 days) confirmed",
          "Third-party dependent deadlines noted",
        ],
        deadline: "March 24",
      },
      {
        track: "Track 3 · Communication",
        title: "Partnership Framework",
        items: [
          "Communication cadence and channels confirmed",
          "Admin contact information received",
          "Billing structure agreed upon",
          "Approval process established",
        ],
        deadline: "March 24",
      },
    ],
  },
];

const immediateActions = [
  {
    label: "$10,000 payment sent to Adam Zaffos",
    owner: "Tony",
    deadline: "Next Monday",
  },
  {
    label: "Adam confirms attorney of record transfer initiated",
    owner: "Adam",
    deadline: "EOD Friday March 20",
  },
  {
    label: "Adam provides written status update on all matters",
    owner: "Adam",
    deadline: "EOD Friday March 20",
  },
  {
    label: "Henry Jannol responds to billing dispute request",
    owner: "Henry",
    deadline: "March 20",
  },
  {
    label: "Josh Bykowski first call scheduled",
    owner: "Tony/Josh",
    deadline: "This week",
  },
  {
    label: "Keenan matter assessed for fit",
    owner: "Adam",
    deadline: "March 27",
  },
  {
    label: "Paula referral structure discussion completed",
    owner: "Adam/Tony",
    deadline: "Next call",
  },
];

const portalDirectory = [
  { name: "Adam Zaffos", url: "/attorney" },
  { name: "Henry Jannol", url: "/henry-jannol" },
  { name: "Josh Bykowski", url: "/josh-bykowski" },
  { name: "Tony (Master)", url: "/legal-master" },
];

export default async function LegalMasterPage() {
  const unlocked = await isPortalUnlocked("legal-master");

  if (!unlocked) {
    return (
      <PortalGate
        portalId="legal-master"
        title="Master Legal CRM"
        subtitle="Admin access only. Enter your master code."
        placeholder="Master access code"
        incorrectMessage="Incorrect code."
      />
    );
  }

  return (
    <LegalMasterContent
      allMatters={allMatters}
      immediateActions={immediateActions}
      portalDirectory={portalDirectory}
    />
  );
}
