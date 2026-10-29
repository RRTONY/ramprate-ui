import { ALL_FIELDS, STEPS, type Values } from "./relationship-profile-fields";

export const PROFILE_DRAFT_KEY = "ramprate.relationship-profile.draft.v1";

type Draft = { values: Values; step: number; prefill?: string };
type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type GetStorage = () => DraftStorage;
const browserStorage: GetStorage = () => window.localStorage;

export function readProfileDraft(
  getStorage: GetStorage = browserStorage,
): Draft {
  const empty: Draft = { values: {}, step: 0 };
  try {
    const saved = getStorage().getItem(PROFILE_DRAFT_KEY);
    if (!saved || saved.length > 200_000) return empty;
    const raw = JSON.parse(saved);
    if (raw?.version !== 1 || !raw.values || typeof raw.values !== "object") {
      return empty;
    }
    const values: Values = {};
    for (const field of ALL_FIELDS) {
      const value = raw.values[field.key];
      if (field.type === "multi" && Array.isArray(value)) {
        const allowed = new Set((field.options ?? []).map((o) => o.value));
        values[field.key] = value.filter(
          (v): v is string => typeof v === "string" && allowed.has(v),
        );
      } else if (typeof value === "string") {
        values[field.key] = value;
      }
    }
    const step = Number.isInteger(raw.step)
      ? Math.max(0, Math.min(STEPS.length, raw.step))
      : 0;
    return {
      values,
      step,
      ...(typeof raw.prefill === "string" && raw.prefill
        ? { prefill: raw.prefill }
        : {}),
    };
  } catch {
    return empty;
  }
}

export function writeProfileDraft(
  draft: Draft,
  getStorage: GetStorage = browserStorage,
): boolean {
  try {
    const values = Object.fromEntries(
      ALL_FIELDS.filter((field) => draft.values[field.key] !== undefined).map(
        (field) => [field.key, draft.values[field.key]],
      ),
    );
    getStorage().setItem(
      PROFILE_DRAFT_KEY,
      JSON.stringify({
        version: 1,
        values,
        step: draft.step,
        prefill: draft.prefill ?? "",
      }),
    );
    return true;
  } catch {
    return false;
  }
}

export function clearProfileDraft(
  getStorage: GetStorage = browserStorage,
): void {
  try {
    getStorage().removeItem(PROFILE_DRAFT_KEY);
  } catch {
    // Storage access is optional; a blocked store must not break submission.
  }
}
