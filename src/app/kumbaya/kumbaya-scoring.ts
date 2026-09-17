import type { KumbayaFormValues } from "./KumbayaForm";

// KumbayaFormValues is a loose Record (see KumbayaForm.tsx) since it backs
// a large, mostly-optional Formik form - these two casts keep the actual
// scoring/prototype logic below readable instead of repeating `as string`
// everywhere.
function str(v: KumbayaFormValues[string]): string {
  return typeof v === "string" ? v : "";
}
function arr(v: KumbayaFormValues[string]): string[] {
  return Array.isArray(v) ? v : [];
}

// Ported field-for-field from the original prototype's score()/
// makePrototype() functions - same weights, same thresholds, same
// (including one latent no-op: "Publishing partnership" is checked as a
// possible `asks` value below, but no `asks` checkbox actually submits
// that value - kept as-is since the brief is to preserve the existing
// scoring rubric exactly, not to fix it).
export interface KumbayaScoreBreakdownRow {
  label: string;
  points: number;
  max: number;
}

export interface KumbayaScoreResult {
  score: number;
  recommendation: string;
  recommendationHeading: string;
  description: string;
  klass: "good" | "maybe" | "no";
  breakdown: KumbayaScoreBreakdownRow[];
  breakdownText: string;
  daysUntilEvent: number;
  leadTimeLabel: string;
}

export function computeKumbayaScore(
  values: KumbayaFormValues,
): KumbayaScoreResult {
  const dateStr = str(values.date);
  const eventDate = dateStr ? new Date(dateStr) : null;
  const days = eventDate
    ? Math.ceil((eventDate.getTime() - Date.now()) / 86400000)
    : 0;

  const people = str(values.people)
    .split("\n")
    .filter((line) => line.trim());
  const units = arr(values.units);
  const asks = arr(values.asks);

  const breakdown: KumbayaScoreBreakdownRow[] = [
    { label: "Lead time", points: days >= 7 ? 20 : days >= 3 ? 8 : 0, max: 20 },
    {
      label: "Audience scale",
      points: ["150–500", "500–2,000", "2,000+"].includes(str(values.attendance))
        ? 15
        : 0,
      max: 15,
    },
    {
      label: "Named relationships",
      points: people.length >= 5 ? 20 : 10,
      max: 20,
    },
    { label: "Portfolio-category fit", points: units.length ? 15 : 0, max: 15 },
    {
      label: "Useful role requested",
      points:
        asks.includes("Introductions") ||
        asks.includes("Speaking") ||
        asks.includes("Publishing partnership")
          ? 10
          : 5,
      max: 10,
    },
    {
      label: "Evidence and sponsor map",
      points: (str(values.eventLink) ? 5 : 0) + (str(values.targetSponsors) ? 5 : 0),
      max: 10,
    },
    {
      label: "Contact permission clarity",
      points: str(values.contactRights) && str(values.nameSource) ? 5 : 0,
      max: 5,
    },
    {
      label: "Co-marketing inventory",
      points: str(values.marketingInventory) || str(values.publishingPartnership) ? 5 : 0,
      max: 5,
    },
  ];

  const score = breakdown.reduce((sum, row) => sum + row.points, 0);
  const klass: KumbayaScoreResult["klass"] =
    score >= 65 ? "good" : score >= 40 ? "maybe" : "no";
  const recommendation =
    score >= 65
      ? "Strong strategic fit"
      : score >= 40
        ? "Possible fit · needs judgment"
        : "Probably not a RampRate sponsorship";
  const recommendationHeading =
    score >= 65
      ? "Review for involvement"
      : score >= 40
        ? "Route for a decision"
        : "Route elsewhere or decline";
  const description =
    score >= 65
      ? "Worth a fast human review. The room, timing, requested role, relationship permissions, and portfolio relevance show enough signal to consider active involvement."
      : score >= 40
        ? "There may be a useful route, but the value exchange, permissions, or timing needs sharper definition before we spend money or social capital."
        : "The current application does not yet justify sponsorship. Consider a charitable route, a warm recommendation, or a respectful no.";

  return {
    score,
    recommendation,
    recommendationHeading,
    description,
    klass,
    breakdown,
    breakdownText: breakdown.map((r) => `${r.label} ${r.points}/${r.max}`).join(" | "),
    daysUntilEvent: days,
    leadTimeLabel: days < 7 ? "Tight timing" : "On time",
  };
}

export interface KumbayaPrototype {
  headline: string;
  paragraph: string;
  people: string[];
  backing: string;
  publishing: string;
  distribution: string;
  text: string;
}

export function buildKumbayaPrototype(
  values: KumbayaFormValues,
): KumbayaPrototype {
  const event = str(values.event) || "This event";
  const why = str(values.priority) || "a timely opportunity";
  const date = str(values.date) || "a future date";
  const where = str(values.venue) || "a location to be confirmed";
  const units = arr(values.units);
  const cat = units.join(", ") || "the right portfolio and partner categories";
  const people = str(values.people)
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);
  const asksArr = arr(values.asks);
  const asks = asksArr.join(", ") || "a thoughtful partnership";
  const backing = str(values.investmentLevel) || str(values.visibility);
  const publishing = str(values.publishingPartnership) || str(values.articleGoal);
  const distribution =
    str(values.distributionPlan) || "TonyGreenberg.com and the wider distribution network";
  const audience = str(values.audience) || "a relevant audience";

  const headline = `${event}: ${why}`;
  const paragraph = `${event} is planned for ${date} in ${where}. It brings together ${audience} around ${why}. The strongest fit appears to be ${cat}, with a request for ${asks.toLowerCase()}.`;

  const text = [
    headline,
    "",
    paragraph,
    people.length ? "Who’s in the room:\n" + people.map((p) => "• " + p).join("\n") : "",
    backing ? "Why this is worth backing:\n" + backing : "",
    publishing
      ? "Publishing opportunity:\n" + publishing + " Distribution: " + distribution
      : "",
    "Built with RampRate × ImpactSoul",
  ]
    .filter(Boolean)
    .join("\n\n");

  return { headline, paragraph, people, backing, publishing, distribution, text };
}
