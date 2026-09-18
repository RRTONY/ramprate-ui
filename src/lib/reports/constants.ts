// Recipients for the automated traffic report / alert emails. Named
// constants rather than an env var, matching the existing per-flow-recipient
// convention (KUMBAYA_STAFF_EMAIL etc. in src/lib/kumbaya-intake.ts).
export const REPORT_RECIPIENTS = ["t@ramprate.com", "admin@ramprate.com"];

// Traffic-drop alert thresholds, as fractions (0.25 = 25%), evaluated by
// comparing the trailing period against the same period one week earlier.
export const ALERT_THRESHOLDS = {
  investigate: 0.25,
  urgent: 0.4,
  critical: 0.6,
} as const;

export const PACIFIC_TIME_ZONE = "America/Los_Angeles";
