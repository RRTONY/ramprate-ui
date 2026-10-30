// Open Roles (/roles). Roles live here, not in a public JSON file, so Draft
// roles are never downloadable once preview is turned off.

// true = Draft roles show, a PREVIEW bar appears and the pages are noindex.
// Set to false only after Sam and Tony approve (go-live checklist in
// docs/ai/project_open_roles.md).
export const ROLES_PREVIEW = true;

export const ROLES_SITE = {
  site: "ramprate",
  siteName: "RampRate",
  defaultSource: "ramprate_site",
};

// Tony's mandatory screening banner. Do not reword without his approval.
export const SCREENING_BANNER = {
  heading: "PLEASE DO NOT APPLY UNLESS YOU MEET BOTH REQUIREMENTS:",
  items: [
    "At least 3 years of directly relevant, hands-on experience in employer health benefits, EAPs, health plans, payer/provider contracting, capitation or closely related institutional healthcare business development.",
    "At least 10 years of established professional relationships in these sectors, with current decision-maker access and demonstrable ability to activate those relationships.",
  ],
  footer:
    "If you do not meet BOTH requirements, please do not apply. This is a senior relationship-led execution role, not an entry-level research assignment.",
};

// Keep in step with the Dover application form.
export const KNOCKOUTS = { experienceMin: 3, relationshipsMin: 10 };

export const ROLE_SOURCES = [
  "ramprate_site",
  "impactsoul_site",
  "braintrust",
  "linkedin",
  "referral",
  "ats_board",
];

export type RoleSection = { heading: string; text?: string; items?: string[] };
export type Role = {
  role_id: string;
  slug: string;
  title: string;
  practice_area: string;
  summary: string;
  engagement_type: string;
  pay_text: string;
  status: "Draft" | "Approved" | "Closed";
  visible_on: "RampRate" | "ImpactSoul" | "Both";
  screening_banner: boolean;
  approved_by: string;
  approved_on: string;
  apply_url: string;
  sections: RoleSection[];
  application_uploads: string[];
  application_questions: string[];
};

export const ROLES: Role[] = [
  {
    role_id: "ROLE-001",
    slug: "healthcare-partnerships-research-execution-lead",
    title: "Healthcare Partnerships Research & Execution Lead",
    practice_area: "Healthcare Partnerships",
    summary:
      "Senior, relationship-led role researching and executing healthcare partnerships across EAP, employer health, capitation, insurers, and VA and government channels.",
    engagement_type: "Contractor, minimum 6 months",
    pay_text:
      "USD $50-$100 per hour or agreed retainer, plus negotiated performance-based compensation",
    status: "Draft",
    visible_on: "Both",
    screening_banner: true,
    approved_by: "",
    approved_on: "",
    apply_url: "https://REPLACE-WITH-DOVER-APPLY-LINK",
    sections: [
      {
        heading: "Focus areas",
        items: [
          "Employee assistance programs (EAP) and employer health benefits",
          "Capitation arrangements and insurers",
          "VA and government partnerships",
        ],
      },
      {
        heading: "About the role",
        text: "[PLACEHOLDER - replace with the approved wording from the first EAP role PDF.] This is a senior relationship-led execution role, not an entry-level research assignment.",
      },
      {
        heading: "Engagement",
        items: [
          "Contractor engagement, minimum 6 months",
          "USD $50-$100 per hour or an agreed retainer",
          "Negotiated performance-based compensation on top",
        ],
      },
    ],
    application_uploads: [
      "Resume (required)",
      "Cover letter (optional)",
      "LinkedIn profile link (required)",
    ],
    application_questions: [
      "Which of these sectors do you hold current decision-maker relationships in? Select all that apply: EAP providers, employer benefits buyers, health plans and insurers, capitation or risk-bearing groups, VA, other federal or state government.",
      "Name up to three decision-makers or organizations you could activate in your first 30 days. No confidential details.",
      "Describe one partnership or contract you personally originated in these sectors: who, your role, and the result with numbers (maximum 150 words).",
      "Which best describes your most recent role? Independent consultant, partnerships or BD at a payer or plan, benefits advisor or broker, EAP or behavioral health vendor, government or VA contracting, other.",
      "Availability: hours per week (under 10, 10-20, 20-30, 30+), earliest start date, and can you commit to at least 6 months?",
      "Pay: preferred structure (hourly within $50-$100, monthly retainer, other) with your expected rate. Are you comfortable with performance-based compensation? Any conflicts with insurers or competing engagements?",
    ],
  },
];

export function isRoleVisible(r: Role, preview = ROLES_PREVIEW): boolean {
  if (r.visible_on !== "Both" && r.visible_on !== ROLES_SITE.siteName)
    return false;
  if (r.status === "Approved") return true;
  return preview && r.status === "Draft";
}

export const visibleRoles = (preview = ROLES_PREVIEW) =>
  ROLES.filter((r) => isRoleVisible(r, preview));

export function roleSource(src: string | null | undefined): string {
  return src && ROLE_SOURCES.includes(src) ? src : ROLES_SITE.defaultSource;
}

// Dover link with origin tracking, or null until the real link is set.
export function roleApplyUrl(
  r: Pick<Role, "apply_url" | "role_id">,
  src: string | null | undefined,
): string | null {
  if (!r.apply_url || /REPLACE/i.test(r.apply_url)) return null;
  try {
    const url = new URL(r.apply_url);
    if (url.protocol !== "https:") return null;
    url.searchParams.set("src", roleSource(src));
    url.searchParams.set("role", r.role_id);
    url.searchParams.set("site", ROLES_SITE.site);
    return url.toString();
  } catch {
    return null;
  }
}
