// Field manifest for the Kumbaya event-intake form
// (src/app/kumbaya/KumbayaForm.tsx), extracted field-for-field from the
// existing prototype at https://ramprate-event-intake.eclecticexe.chatgpt.site
// so the Formik/Yup rebuild renders the exact same fields, labels, hints,
// placeholders, and option lists as the original - only the rendering
// engine changed (vanilla DOM -> Formik-driven React), not the content.
export type KumbayaFieldType =
  | "text"
  | "date"
  | "url"
  | "email"
  | "textarea"
  | "select";

export interface KumbayaFieldDef {
  key: string;
  label: string;
  type: KumbayaFieldType;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: string[];
  full?: boolean;
  tall?: boolean;
}

// A field list that should render inside a collapsed <details> drawer -
// matches the original's declarative drawers (step 0, step 1) and the
// three sections its script collapsed at runtime via collapseSection()
// (step 2). Rendering them as real <details> here achieves the identical
// end result without porting that runtime DOM-rewriting trick.
export interface KumbayaFieldGroup {
  drawerTitle?: string;
  fields: KumbayaFieldDef[];
}

export const KUMBAYA_STEP_NAMES = [
  "The event",
  "The people",
  "The fit",
  "The readout",
] as const;

export const KUMBAYA_STEP0: KumbayaFieldGroup[] = [
  {
    fields: [
      { key: "event", label: "Event name", type: "text", required: true, placeholder: "e.g. Future of Health Summit", full: true },
      { key: "date", label: "Event date", type: "date", required: true },
    ],
  },
  {
    drawerTitle: "Optional event details · open if useful",
    fields: [
      { key: "deadline", label: "Decision deadline", type: "date", hint: "When do you need an answer?" },
      { key: "venue", label: "Where is it?", type: "text", required: true, placeholder: "City, venue, or virtual" },
      { key: "eventLink", label: "Event link", type: "url", placeholder: "https://", hint: "Website, invitation, or deck" },
      { key: "venueLink", label: "Venue link", type: "url", placeholder: "https://venue-or-map.com", hint: "Venue website, map, listing, or photo gallery" },
      // venueImage (file) is handled separately, not via the generic renderer
      { key: "organizer", label: "Organizer / organization", type: "text", hint: "Optional if the organizer is the contact below" },
      { key: "contact", label: "Organizer name + email", type: "text", required: true, placeholder: "Name · email · phone" },
      { key: "attendance", label: "Expected attendance", type: "select", hint: "Optional. A range is perfect.", options: ["Under 50", "50–150", "150–500", "500–2,000", "2,000+"] },
      { key: "audience", label: "Who is actually in the room?", type: "textarea", hint: "Optional. Investors, operators, government, founders, media, community, etc." },
      { key: "eventStage", label: "Where is this event in its life?", type: "select", options: ["Future idea / early planning", "Dates being held", "Confirmed and building the room", "Open for sponsors and partners", "Part of a recurring series", "Past event with a future edition"] },
    ],
  },
  {
    fields: [
      { key: "priority", label: "Why does this matter now?", type: "textarea", required: true, full: true, hint: "What is the opportunity, urgency, or delightful coincidence?" },
    ],
  },
];

export const KUMBAYA_STEP1: KumbayaFieldGroup[] = [
  {
    drawerTitle: "Optional room intelligence · open if useful",
    fields: [
      { key: "people", label: "Five to ten people expected", type: "textarea", full: true, tall: true, placeholder: "Jane Smith · CEO, Example · https://linkedin.com/in/...\nAlex Rivera · Investor, Fund · https://...", hint: "Name, role, company, and a link for each. One per line." },
      { key: "relationship", label: "Who invited you?", type: "text", placeholder: "Name and relationship to you" },
      { key: "targetSponsors", label: "Who are your target sponsors?", type: "textarea", placeholder: "Company · contact · link · reason for fit", hint: "Names, links, and why each one fits" },
      { key: "existingSponsors", label: "Who are your existing sponsors?", type: "textarea", placeholder: "Sponsor · status · contribution · link", hint: "Include confirmed, pending, and in-kind sponsors" },
      { key: "investmentLevel", label: "What is the investment level?", type: "textarea", placeholder: "$25,000 committed · $50,000 ask · venue in-kind · tier details", hint: "Requested and/or committed cash, in-kind value, or sponsorship tiers" },
    ],
  },
  // "asks" checkbox group rendered separately, then:
  {
    fields: [
      { key: "ask", label: "What would make this a win?", type: "textarea", full: true, placeholder: "The smallest useful thing we could do is…", hint: "Optional. The smallest useful thing we could do is…" },
    ],
  },
];

export const KUMBAYA_ASKS_OPTIONS: { id: string; value: string; small: string }[] = [
  { id: "sponsor", value: "Sponsorship / money", small: "Cash, in-kind, or underwriting" },
  { id: "attend", value: "Attendance / table", small: "Relationship-building or hosting" },
  { id: "speak", value: "Speaking", small: "Talk, panel, keynote, workshop" },
  { id: "intro", value: "Introductions", small: "Bring the right people together" },
  { id: "charity", value: "Charitable support", small: "Donation or community support" },
  { id: "other", value: "Other", small: "Tell us below" },
];
// Displayed labels differ slightly from their submitted value for "speak"
// ("Speaking / moderation") - kept as a display-only override so the
// submitted value stays exactly "Speaking", matching the original.
export const KUMBAYA_ASKS_DISPLAY_LABEL: Record<string, string> = {
  speak: "Speaking / moderation",
};

export const KUMBAYA_UNITS_OPTIONS: string[] = [
  "Enterprise IT, data centers & infrastructure",
  "AI compute, GPU & advanced infrastructure",
  "Cloud, edge, telecom & connectivity",
  "Web3, stablecoins & tokenization",
  "Health, biologics & regenerative medicine",
  "Psychedelic medicine, mental health & community care",
  "Longevity, wellness & human transformation",
  "Climate, energy, water & regenerative systems",
  "Impact, philanthropy & cultural assets",
  "NGOs, foundations & mission-driven organizations",
  "Founder growth, capital & strategic partnerships",
  "Legal operations, claims & dispute support",
  "Wealth, donor & distribution networks",
  "Media, arts & cultural platforms",
  "Channel, distribution & publishing partnerships",
  "Communities, culture & convening networks",
  "Other portfolio or partner category",
];

export const KUMBAYA_PRACTICAL_SUPPORT_OPTIONS: { id: string; value: string; small: string }[] = [
  { id: "food", value: "Food", small: "Catering, snacks, dietary care" },
  { id: "beverage", value: "Beverage", small: "Wine, non-alcoholic, coffee, hospitality" },
  { id: "giftbag", value: "Gift bag", small: "Useful, beautiful, mission-aligned" },
  { id: "donations", value: "Donations", small: "Charity, community, or in-kind support" },
];

// Step 2 ("The fit"). Three groups (units, "Names, permission...", and
// "Promotion, PR...") are rendered as collapsed <details> drawers, matching
// what the original's collapseSection() produced at runtime.
export const KUMBAYA_STEP2_FIT_FIELDS: KumbayaFieldDef[] = [
  { key: "fit", label: "Why is this a fit for one of those paths?", type: "textarea" },
  { key: "visibility", label: "What visibility is offered?", type: "textarea", hint: "Logo, stage mention, private room, content, none, or not applicable" },
  { key: "eventBudget", label: "What is the total event budget?", type: "text", placeholder: "$250,000 estimated total event budget", hint: "Optional. Include currency and whether it is confirmed, estimated, or still being built." },
  { key: "budget", label: "Requested cash or in-kind value", type: "text", placeholder: "$0 / $5,000 / venue / media / other", hint: "Include currency and what it covers" },
  { key: "contribution", label: "What can the organizer contribute?", type: "textarea", placeholder: "Access, audience, content, introductions, mission alignment…" },
  { key: "risks", label: "Anything we should know?", type: "textarea", full: true, hint: "Political, reputational, exclusivity, conflicts, controversial participants, or sensitivities" },
];

export const KUMBAYA_STEP2_NAMES_DRAWER: KumbayaFieldDef[] = [
  { key: "nameSource", label: "How are names being collected?", type: "textarea", hint: "Optional. Registration, opt-in, referrals, partner list, purchased list, scraping, or unknown" },
  { key: "contactRights", label: "What are our rights to contact them?", type: "textarea", hint: "Optional. State the actual consent language or restriction" },
  { key: "profilePrep", label: "Can attendee profiles be prepared in advance?", type: "select", hint: "Optional. Bios, roles, links, interests, permission, and why the connection could matter.", options: ["Yes — profiles and permissions are ready", "Partly — names are ready, profiles need work", "Not yet — help us prepare them", "No — introductions will be informal"] },
  { key: "topThree", label: "Who are the top three people or organizations to connect?", type: "textarea", placeholder: "1. Person / organization · connection wanted · why\n2. Person / organization · connection wanted · why\n3. Person / organization · connection wanted · why", hint: "Optional. Tell us who should meet whom and why." },
  { key: "connectionFormat", label: "What kind of connection is appropriate?", type: "select", options: ["Warm email introduction", "Private room or dinner", "On-stage or panel connection", "Direct message after consent", "Shared article or briefing first", "Recommend the right format"] },
  { key: "followupPermission", label: "What follow-through is permitted?", type: "textarea", hint: "Optional. One-time introduction, event follow-up, CRM relationship, or ongoing partner conversation." },
  { key: "crmFocus", label: "What should the CRM relationship become?", type: "select", options: ["One-time event follow-up", "Qualified RampRate relationship pipeline", "Partner / sponsor relationship", "ImpactSoul or charitable community relationship", "Newsletter or content audience", "No CRM follow-up requested", "Unclear — recommend a path"] },
  { key: "emailTiming", label: "Sponsor email timing", type: "select", options: ["Before the event — invite / sponsor ask", "Before the event — co-marketing announcement", "During the event — live activation", "After the event — recap / follow-up", "Before and after", "No sponsor email requested", "Recommend timing"] },
  { key: "marketingInventory", label: "Co-marketing opportunities available", type: "textarea", full: true, placeholder: "Event site · registration email · stage · signage · social · content · booth · partner email · private dinner · attendee introductions", hint: "Where could RampRate, ImpactSoul, a partner, or a friend’s logo or voice appear?" },
  { key: "timeSlot", label: "What time or slot is available?", type: "textarea", hint: "Optional. Arrival, setup, speaking, panel, workshop, private room, departure" },
  { key: "publishingPartnership", label: "Could this be a publishing partnership?", type: "textarea", full: true, placeholder: "Podcast, newsletter, editorial, event listing, interview, live stream, post-event recap…", hint: "Optional. Tell us if you want RampRate or ImpactSoul to publish, distribute, host, interview, recap, or amplify the event." },
  { key: "articleGoal", label: "If we write an article, what should it generate?", type: "textarea", placeholder: "Bring in 2 sponsors and 40 qualified attendees", hint: "Sponsors, attendees, speakers, or a mix" },
  { key: "distributionPlan", label: "What distribution opportunity is available?", type: "textarea", placeholder: "TonyGreenberg.com feature + PR partners + partner distribution + estimated reach", hint: "Optional. We have a wide net of PR agencies, editorial relationships, and distribution partnerships that can help promote an event, depending on timing, story, audience, and available lead time. Include TonyGreenberg.com, newsletters, partner channels, social, or an estimated 10,000–60,000-view reach." },
];

export const KUMBAYA_STEP2_PROMOTION_DRAWER: KumbayaFieldDef[] = [
  { key: "inviteAsset", label: "Is there a Partyful, Luma, or other invite?", type: "select", options: ["Yes — live invite is ready", "Yes — invite is being built", "No — landing page or RSVP flow instead", "Not yet"] },
  { key: "inviteLink", label: "Invite or RSVP link", type: "url", placeholder: "https://lu.ma/...", hint: "Luma, Partyful, Eventbrite, website, or private invitation" },
  { key: "targetAttendees", label: "Who are the target attendees?", type: "textarea", full: true, placeholder: "Founders, family offices, clinicians, policymakers, artists, local community, technical operators…", hint: "The people you want in the room, not just the largest possible audience" },
  { key: "promotionPlan", label: "How will the event be promoted?", type: "textarea", placeholder: "Organic social, paid media, partner email, PR, direct outreach, community ambassadors…", hint: "Optional. Tell us what already exists and what still needs to happen." },
  { key: "promotionChannels", label: "What channels and tools are you using?", type: "textarea", placeholder: "LinkedIn + email + partner newsletters + Sprout Social", hint: "LinkedIn, Instagram, email, WhatsApp, newsletters, partners, media, Sprout Social, etc." },
  { key: "journalists", label: "Are any journalists, editors, creators, or media partners coming?", type: "textarea", placeholder: "Name · outlet · role · confirmed / invited · link", hint: "Optional. Names, outlets, links, and whether attendance is confirmed." },
  { key: "mediaAssets", label: "What media assets exist?", type: "textarea", placeholder: "Speaker bios + press release draft + image folder", hint: "Press release, images, speaker bios, clips, brand kit, talking points, recap plan" },
  { key: "promotionOwner", label: "Who owns promotion and follow-through?", type: "text", placeholder: "Organizer / PR agency / social lead", hint: "Optional. Name, role, agency, or team." },
  { key: "promotionTiming", label: "When does promotion begin?", type: "select", options: ["Already live", "Within 7 days", "2–4 weeks before", "1–3 months before", "Long-lead / future series", "Not decided"] },
  // practicalSupport checkbox group rendered separately
  { key: "practicalDetails", label: "Practical details", type: "textarea", full: true, placeholder: "Vegan catering for 120 · non-alcoholic bar · 50 mission-aligned gift bags · $5,000 community donation", hint: "Optional. Tell us what is needed, what is already covered, and the approximate value." },
];

export const KUMBAYA_STEP2_TAIL_FIELDS: KumbayaFieldDef[] = [
  { key: "timeCommitment", label: "What time commitment are you asking for?", type: "text", placeholder: "e.g. 20-minute panel + 30-minute reception", hint: "Minutes or hours, including prep and travel" },
  { key: "crmOwner", label: "Who owns the follow-up after the event?", type: "textarea", full: true, hint: "Name, role, CRM owner, and expected next action" },
];

export const KUMBAYA_STEP2_RISKS2: KumbayaFieldDef = {
  key: "risks2",
  label: "Anything else we should know?",
  type: "textarea",
  full: true,
  hint: "Political, reputational, exclusivity, conflicts, controversial participants, or sensitivities",
};

export const KUMBAYA_STEP3_FIELDS: KumbayaFieldDef[] = [
  { key: "name", label: "Your name", type: "text", hint: "Optional" },
  { key: "email", label: "Your email", type: "email", hint: "Optional" },
];

// Every field name the form can submit, in the order the original's own
// mailto/summary logic used - kept here (not just in the backend) so a
// single source of truth drives both the UI and src/lib/kumbaya-intake.ts's
// KUMBAYA_FIELD_LABELS.
export const KUMBAYA_ALL_FIELD_KEYS: string[] = [
  ...KUMBAYA_STEP0.flatMap((g) => g.fields.map((f) => f.key)),
  ...KUMBAYA_STEP1.flatMap((g) => g.fields.map((f) => f.key)),
  ...KUMBAYA_STEP2_FIT_FIELDS.map((f) => f.key),
  ...KUMBAYA_STEP2_NAMES_DRAWER.map((f) => f.key),
  ...KUMBAYA_STEP2_PROMOTION_DRAWER.map((f) => f.key),
  ...KUMBAYA_STEP2_TAIL_FIELDS.map((f) => f.key),
  KUMBAYA_STEP2_RISKS2.key,
  ...KUMBAYA_STEP3_FIELDS.map((f) => f.key),
];
