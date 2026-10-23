export type Option = { value: string; label: string };

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "textarea"
  | "select"
  | "chips"
  | "multi"
  | "timezone";

export type FieldDef = {
  key: string;
  label: string;
  short?: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: Option[];
  half?: boolean;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "url" | "text";
};

export type StepDef = {
  id: string;
  title: string;
  sub: string;
  optional?: boolean;
  fields: FieldDef[];
};

export type Values = Record<string, string | string[]>;
export type TzSource = "chosen" | "city" | "device";
export type ProfileMeta = {
  timezone?: string;
  tzSource?: TzSource;
  receivedAt: string;
  sourceUrl?: string;
};

export const TZ_PICK_KEY = "tzPick";
export const CONSENT_KEY = "consent";
export const CONSENT_LABEL =
  "I am comfortable with RampRate keeping this profile and using it to coordinate scheduling and communication, including through the scheduling and CRM tools our team uses. I can ask for changes or removal at any time.";

const MAX_TEXT = 200;
const MAX_AREA = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TZ_RE = /^[A-Za-z]+(?:\/[A-Za-z0-9_+-]+){1,2}$/;

const opts = (...labels: string[]): Option[] =>
  labels.map((label) => ({ value: label, label }));

function timeOptions(): Option[] {
  const out: Option[] = [];
  for (let m = 5 * 60; m <= 23 * 60 + 30; m += 30) {
    const h = Math.floor(m / 60);
    const mm = String(m % 60).padStart(2, "0");
    const h12 = h % 12 === 0 ? 12 : h % 12;
    out.push({
      value: `${String(h).padStart(2, "0")}:${mm}`,
      label: `${h12}:${mm} ${h >= 12 ? "PM" : "AM"}`,
    });
  }
  return out;
}

const RELATIONSHIPS = opts(
  "Prospective client",
  "Active client",
  "Partner",
  "Advisor",
  "Strategic relationship",
);

const CHANNELS = opts(
  "Text or iMessage",
  "WhatsApp",
  "Email",
  "Slack",
  "Phone call",
  "Signal or Telegram",
  "LinkedIn",
);

export const STEPS: StepDef[] = [
  {
    id: "about",
    title: "About you",
    sub: "The basics, so we always get the introductions right.",
    fields: [
      {
        key: "fullName",
        label: "Full name",
        short: "Name",
        type: "text",
        required: true,
        placeholder: "First and last name",
        half: true,
        autoComplete: "name",
      },
      {
        key: "prefName",
        label: "What should we call you?",
        short: "Preferred name",
        type: "text",
        placeholder: "Preferred name",
        half: true,
        autoComplete: "nickname",
      },
      {
        key: "company",
        label: "Company",
        type: "text",
        required: true,
        placeholder: "Where you work",
        half: true,
        autoComplete: "organization",
      },
      {
        key: "role",
        label: "Your role",
        short: "Role",
        type: "text",
        placeholder: "Title or what you do",
        half: true,
        autoComplete: "organization-title",
      },
      {
        key: "email",
        label: "Work email",
        short: "Email",
        type: "email",
        required: true,
        placeholder: "name@company.com",
        half: true,
        autoComplete: "email",
        inputMode: "email",
      },
      {
        key: "phone",
        label: "Phone or messaging number",
        short: "Phone",
        type: "tel",
        required: true,
        placeholder: "Include country code",
        half: true,
        autoComplete: "tel",
        inputMode: "tel",
      },
      {
        key: "relType",
        label: "How are we connected?",
        short: "Connection",
        type: "chips",
        required: true,
        options: RELATIONSHIPS,
      },
    ],
  },
  {
    id: "when",
    title: "When and where",
    sub: "Your city and your rhythm, so we never book you at the wrong hour.",
    fields: [
      {
        key: "location",
        label: "Which city are you based in?",
        short: "City",
        type: "text",
        required: true,
        placeholder: "e.g. Austin, Texas",
        autoComplete: "address-level2",
      },
      {
        key: TZ_PICK_KEY,
        label: "Time zone (optional)",
        short: "Time zone",
        type: "timezone",
        hint: "Skip this and we will work it out from your city.",
      },
      {
        key: "hoursStart",
        label: "Working day starts",
        short: "Day starts",
        type: "select",
        options: timeOptions(),
        half: true,
      },
      {
        key: "hoursEnd",
        label: "Working day ends",
        short: "Day ends",
        type: "select",
        options: timeOptions(),
        half: true,
      },
      {
        key: "days",
        label: "Days you usually work",
        short: "Working days",
        type: "multi",
        options: opts("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"),
      },
      {
        key: "meetWindows",
        label: "Best windows for meetings (your local time)",
        short: "Meeting windows",
        type: "multi",
        options: opts(
          "Before 9am",
          "9am to 12pm",
          "12pm to 2pm",
          "2pm to 5pm",
          "After 5pm",
        ),
      },
      {
        key: "meetFormat",
        label: "Preferred meeting format",
        short: "Meeting format",
        type: "multi",
        options: opts("Video call", "Phone call", "In person", "Async first"),
      },
      {
        key: "meetLength",
        label: "Ideal meeting length",
        short: "Meeting length",
        type: "chips",
        options: opts("15 min", "30 min", "45 min", "60 min"),
      },
    ],
  },
  {
    id: "reach",
    title: "How to reach you",
    sub: "Your channels, your pace, and who helps with your calendar.",
    fields: [
      {
        key: "channels",
        label: "Channels you like (pick any)",
        short: "Channels",
        type: "multi",
        options: CHANNELS,
      },
      {
        key: "channelFirst",
        label: "First choice for something important",
        short: "First choice",
        type: "select",
        options: CHANNELS,
        half: true,
      },
      {
        key: "channelHandle",
        label: "Number or handle for that channel",
        short: "Handle",
        type: "text",
        placeholder: "So we reach the right place",
        half: true,
      },
      {
        key: "response",
        label: "How quickly do you usually reply?",
        short: "Reply speed",
        type: "select",
        options: [
          { value: "Same day", label: "Same day" },
          { value: "Within 24 hours", label: "Within 24 hours" },
          { value: "2 to 3 days", label: "2 to 3 days" },
          { value: "About a week", label: "About a week is fine" },
          {
            value: "Urgent by phone only",
            label: "Only urgent items, by phone",
          },
        ],
      },
      {
        key: "calendarLink",
        label: "Scheduling link",
        type: "url",
        placeholder: "Calendly, Cal.com, Google or Outlook link",
        half: true,
        inputMode: "url",
      },
      {
        key: "schedulePerm",
        label: "Booking permission",
        type: "select",
        options: [
          { value: "Book directly", label: "Book directly on my calendar" },
          {
            value: "Via assistant",
            label: "Propose times through my assistant",
          },
          { value: "Options first", label: "Send me options first" },
          { value: "Ask each time", label: "Ask me each time" },
        ],
        half: true,
      },
      {
        key: "assistantName",
        label: "Executive assistant (if any)",
        short: "Assistant",
        type: "text",
        placeholder: "Name",
        half: true,
      },
      {
        key: "assistantEmail",
        label: "Assistant email",
        type: "email",
        placeholder: "assistant@company.com",
        half: true,
        inputMode: "email",
      },
    ],
  },
  {
    id: "matters",
    title: "What matters to you",
    sub: "Two quick answers that help us show up with something useful.",
    fields: [
      {
        key: "priorities",
        label: "What are your top priorities right now?",
        short: "Priorities",
        type: "textarea",
        placeholder: "A sentence or two is plenty",
      },
      {
        key: "value",
        label: "Where could we create the most value together?",
        short: "Value together",
        type: "textarea",
        placeholder: "Introductions, advice, deals, a problem to solve",
      },
    ],
  },
  {
    id: "deeper",
    title: "Go deeper",
    sub: "Entirely optional. Share what feels useful and leave the rest blank.",
    optional: true,
    fields: [
      {
        key: "initiatives",
        label: "Current initiatives",
        type: "textarea",
        placeholder: "What you or your company are working on this year",
      },
      {
        key: "stakeholders",
        label: "Key people we should know",
        short: "Key people",
        type: "textarea",
        placeholder:
          "Partners, board members, colleagues, or people you would like to meet",
      },
      {
        key: "history",
        label: "How we met and what we have done together",
        short: "History",
        type: "textarea",
        placeholder:
          "Who introduced us, past projects, anything we should remember",
      },
      {
        key: "opps",
        label: "Mutual opportunities you see",
        short: "Opportunities",
        type: "textarea",
        placeholder: "Where our networks or strengths could combine",
      },
      {
        key: "boundaries",
        label: "Contact boundaries",
        type: "textarea",
        placeholder: "Hours, days or channels we should avoid",
      },
      {
        key: "delegation",
        label: "Delegation preferences",
        type: "textarea",
        placeholder: "What your team can handle and what needs you directly",
      },
      {
        key: "personal",
        label: "Personal preferences (voluntary)",
        short: "Personal preferences",
        type: "textarea",
        placeholder:
          "Name pronunciation, communication style, travel patterns, dietary needs, interests, important dates",
      },
      {
        key: "visibility",
        label: "Who at RampRate may see the personal details?",
        short: "Personal details visible to",
        type: "chips",
        options: opts(
          "Whole team",
          "My relationship owner and leadership",
          "Leadership only",
        ),
      },
    ],
  },
];

export const ALL_FIELDS: FieldDef[] = STEPS.flatMap((step) => step.fields);

export const ERROR_MESSAGES: Record<string, string> = {
  fullName: "Please add your name.",
  company: "Please add your company.",
  email: "Please add a valid email address.",
  phone: "Please add a number we can reach you on.",
  relType: "Please choose one.",
  location: "Please add your city.",
  [CONSENT_KEY]: "Please tick the box to confirm.",
};

function isValidUrl(value: string): boolean {
  if (/\s/.test(value)) return false;
  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : `https://${value}`,
    );
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

function checkValue(field: FieldDef, value: string): string {
  switch (field.type) {
    case "email":
      return EMAIL_RE.test(value) ? "" : ERROR_MESSAGES.email;
    case "tel":
      return value.replace(/\D/g, "").length >= 7 ? "" : ERROR_MESSAGES.phone;
    case "url":
      return isValidUrl(value) ? "" : "Please enter a valid link.";
    case "select":
    case "chips":
      return (field.options ?? []).some((o) => o.value === value)
        ? ""
        : "Please choose from the list.";
    case "timezone":
      return TZ_RE.test(value) ? "" : "Please choose from the list.";
    default:
      return "";
  }
}

export type ValidationResult = {
  data: Values;
  errors: Record<string, string>;
};

export function validateValues(
  raw: Record<string, unknown>,
  onlyKeys?: string[],
): ValidationResult {
  const data: Values = {};
  const errors: Record<string, string> = {};

  for (const field of ALL_FIELDS) {
    if (onlyKeys && !onlyKeys.includes(field.key)) continue;
    const input = raw[field.key];

    if (field.type === "multi") {
      const allowed = new Set((field.options ?? []).map((o) => o.value));
      const picked = Array.isArray(input)
        ? input.filter(
            (v): v is string => typeof v === "string" && allowed.has(v),
          )
        : [];
      if (picked.length) data[field.key] = Array.from(new Set(picked));
      continue;
    }

    const value = typeof input === "string" ? input.trim() : "";
    if (!value) {
      if (field.required) {
        errors[field.key] = ERROR_MESSAGES[field.key] ?? "This is needed.";
      }
      continue;
    }

    const max = field.type === "textarea" ? MAX_AREA : MAX_TEXT;
    if (value.length > max) {
      errors[field.key] = "That is a little long. Please shorten it.";
      continue;
    }

    const problem = checkValue(field, value);
    if (problem) {
      errors[field.key] = problem;
      continue;
    }
    data[field.key] = value;
  }

  if (!onlyKeys || onlyKeys.includes(CONSENT_KEY)) {
    if (raw[CONSENT_KEY] === "yes") data[CONSENT_KEY] = "yes";
    else errors[CONSENT_KEY] = ERROR_MESSAGES[CONSENT_KEY];
  }

  return { data, errors };
}

export function sanitizePrefill(raw: unknown): Values {
  const out: Values = {};
  if (!raw || typeof raw !== "object") return out;
  const source = raw as Record<string, unknown>;

  for (const field of ALL_FIELDS) {
    const input = source[field.key];
    if (field.type === "multi") {
      const allowed = new Set((field.options ?? []).map((o) => o.value));
      const picked = Array.isArray(input)
        ? input.filter(
            (v): v is string => typeof v === "string" && allowed.has(v),
          )
        : [];
      if (picked.length) out[field.key] = Array.from(new Set(picked));
      continue;
    }
    if (typeof input !== "string") continue;
    const value = input.trim();
    const max = field.type === "textarea" ? MAX_AREA : MAX_TEXT;
    if (!value || value.length > max) continue;
    if (field.type === "select" || field.type === "chips") {
      if (!(field.options ?? []).some((o) => o.value === value)) continue;
    }
    if (field.type === "timezone" && !TZ_RE.test(value)) continue;
    out[field.key] = value;
  }
  return out;
}

export function sanitizeMeta(raw: unknown): {
  timezone?: string;
  tzSource?: TzSource;
} {
  if (!raw || typeof raw !== "object") return {};
  const source = raw as Record<string, unknown>;
  const timezone =
    typeof source.timezone === "string" && TZ_RE.test(source.timezone)
      ? source.timezone
      : undefined;
  const tzSource =
    source.tzSource === "chosen" ||
    source.tzSource === "city" ||
    source.tzSource === "device"
      ? source.tzSource
      : undefined;
  return timezone ? { timezone, tzSource: tzSource ?? "device" } : {};
}

export function displayValue(
  field: FieldDef,
  value: string | string[],
): string {
  const label = (v: string) =>
    (field.options ?? []).find((o) => o.value === v)?.label ?? v;
  return Array.isArray(value) ? value.map(label).join(", ") : label(value);
}

export const TZ_SOURCE_LABEL: Record<TzSource, string> = {
  chosen: "chosen by the person",
  city: "worked out from their city",
  device: "from their device, to confirm",
};

export function formatProfileText(data: Values, meta: ProfileMeta): string {
  const lines: string[] = ["RAMPRATE RELATIONSHIP PROFILE", ""];

  for (const step of STEPS) {
    const rows: string[] = [];
    for (const field of step.fields) {
      if (field.key === TZ_PICK_KEY) continue;
      const value = data[field.key];
      if (value === undefined || (Array.isArray(value) && !value.length)) {
        continue;
      }
      rows.push(`${field.short ?? field.label}: ${displayValue(field, value)}`);
    }
    if (step.id === "when" && meta.timezone) {
      rows.push(
        `Time zone: ${meta.timezone} (${TZ_SOURCE_LABEL[meta.tzSource ?? "device"]})`,
      );
    }
    if (rows.length) lines.push(step.title.toUpperCase(), ...rows, "");
  }

  lines.push(`Received: ${meta.receivedAt}`);
  if (meta.sourceUrl) lines.push(`Source page: ${meta.sourceUrl}`);
  return lines.join("\n");
}
