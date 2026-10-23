import { describe, expect, it } from "vitest";
import { tzFromCity } from "../src/lib/relationship-profile-cities";
import {
  formatProfileText,
  sanitizeMeta,
  sanitizePrefill,
  validateValues,
} from "../src/lib/relationship-profile-fields";

const valid = {
  fullName: "Dean Nelson",
  company: "Acme",
  email: "dean@acme.com",
  phone: "+1 555 123 4567",
  relType: "Partner",
  location: "Austin, Texas",
  consent: "yes",
};

describe("validateValues", () => {
  it("accepts the required fields alone", () => {
    const { data, errors } = validateValues(valid);
    expect(errors).toEqual({});
    expect(data.fullName).toBe("Dean Nelson");
  });

  it("flags every missing required field, including consent", () => {
    const { errors } = validateValues({});
    expect(Object.keys(errors).sort()).toEqual(
      [
        "company",
        "consent",
        "email",
        "fullName",
        "location",
        "phone",
        "relType",
      ].sort(),
    );
  });

  it("rejects a bad email and a too-short phone", () => {
    const { errors } = validateValues({
      ...valid,
      email: "not-an-email",
      phone: "12",
    });
    expect(errors.email).toBeTruthy();
    expect(errors.phone).toBeTruthy();
  });

  it("treats optional fields as optional but still checks them when given", () => {
    expect(validateValues({ ...valid, assistantEmail: "" }).errors).toEqual({});
    expect(
      validateValues({ ...valid, assistantEmail: "nope" }).errors
        .assistantEmail,
    ).toBeTruthy();
  });

  it("rejects an option that is not in the list", () => {
    expect(
      validateValues({ ...valid, relType: "Something else" }).errors.relType,
    ).toBeTruthy();
  });

  it("drops unknown multi-select values and unknown keys", () => {
    const { data } = validateValues({
      ...valid,
      days: ["Mon", "Funday"],
      sneaky: "x",
    });
    expect(data.days).toEqual(["Mon"]);
    expect(data.sneaky).toBeUndefined();
  });

  it("only checks the keys asked for", () => {
    expect(validateValues({}, ["fullName"]).errors).toEqual({
      fullName: "Please add your name.",
    });
  });
});

describe("sanitizeMeta and sanitizePrefill", () => {
  it("keeps a real time zone and drops a malformed one", () => {
    expect(
      sanitizeMeta({ timezone: "America/Chicago", tzSource: "city" }),
    ).toEqual({ timezone: "America/Chicago", tzSource: "city" });
    expect(sanitizeMeta({ timezone: "<script>" })).toEqual({});
  });

  it("keeps only known, valid prefill values", () => {
    expect(
      sanitizePrefill({ fullName: "Dean", relType: "Nope", other: "x" }),
    ).toEqual({ fullName: "Dean" });
  });
});

describe("tzFromCity", () => {
  it("finds common cities, with or without the state or country", () => {
    expect(tzFromCity("Austin")).toBe("America/Chicago");
    expect(tzFromCity("Austin, Texas")).toBe("America/Chicago");
    expect(tzFromCity("Bangalore")).toBe("Asia/Kolkata");
  });

  it("tells apart cities that share a name", () => {
    expect(tzFromCity("San Jose")).toBe("America/Los_Angeles");
    expect(tzFromCity("San Jose, Costa Rica")).toBe("America/Costa_Rica");
  });

  it("returns null for an unknown city", () => {
    expect(tzFromCity("Springfield")).toBeNull();
    expect(tzFromCity("")).toBeNull();
  });
});

describe("formatProfileText", () => {
  it("lists answers by section and notes where the time zone came from", () => {
    const { data } = validateValues(valid);
    const text = formatProfileText(data, {
      timezone: "America/Chicago",
      tzSource: "city",
      receivedAt: "2026-10-23T00:00:00.000Z",
    });
    expect(text).toContain("ABOUT YOU");
    expect(text).toContain("Name: Dean Nelson");
    expect(text).toContain("City: Austin, Texas");
    expect(text).toContain("America/Chicago (worked out from their city)");
    expect(text).not.toContain("Consent");
  });
});
