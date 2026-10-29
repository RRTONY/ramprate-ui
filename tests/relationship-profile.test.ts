import { describe, expect, it } from "vitest";
import { tzFromCity } from "../src/lib/relationship-profile-cities";
import {
  formatProfileText,
  sanitizeMeta,
  sanitizePrefill,
  validateValues,
} from "../src/lib/relationship-profile-fields";

import {
  readProfileDraft,
  writeProfileDraft,
  clearProfileDraft,
} from "../src/lib/relationship-profile-draft";

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

describe("onboarding QA validation regressions", () => {
  it.each(["test@x..com", ".t@x.com", "t.@x.com", "t..t@x.com"])(
    "rejects invalid email %s for both email fields",
    (email) => {
      const { errors } = validateValues({
        ...valid,
        email,
        assistantEmail: email,
      });
      expect(errors.email).toBeTruthy();
      expect(errors.assistantEmail).toBeTruthy();
    },
  );

  it("trims email spaces and accepts plus-addressing for both fields", () => {
    const { data, errors } = validateValues({
      ...valid,
      email: " a+b@x.com ",
      assistantEmail: " assistant+event@x.com ",
    });
    expect(errors).toEqual({});
    expect(data.email).toBe("a+b@x.com");
    expect(data.assistantEmail).toBe("assistant+event@x.com");
  });

  it.each([
    "00000000000",
    "+0000000",
    "1234567890123456",
    "123456",
    "@name",
    "abc1234567",
    "++12345678",
    "1234/5678",
  ])("rejects invalid phone %s", (phone) =>
    expect(validateValues({ ...valid, phone }).errors.phone).toBeTruthy(),
  );

  it.each(["1234567", "+123456789012345", "+1 (415) 555-0123", "415.555.0123"])(
    "accepts valid phone %s",
    (phone) => expect(validateValues({ ...valid, phone }).errors).toEqual({}),
  );

  it("keeps a username in the separate channel handle field", () => {
    const { data, errors } = validateValues({
      ...valid,
      channelHandle: "@name",
    });
    expect(errors).toEqual({});
    expect(data.channelHandle).toBe("@name");
  });

  it.each([
    ["18:00", "08:00"],
    ["08:00", "08:00"],
  ])(
    "blocks working hours %s to %s on Continue and full submission",
    (hoursStart, hoursEnd) => {
      const input = { ...valid, hoursStart, hoursEnd };
      for (const keys of [undefined, ["location", "hoursStart", "hoursEnd"]]) {
        expect(validateValues(input, keys).errors.hoursEnd).toBe(
          "Your day ends before it starts. Please check your hours.",
        );
      }
    },
  );

  it("accepts later hours and keeps missing optional hours optional", () => {
    for (const hours of [
      {},
      { hoursStart: "08:00" },
      { hoursEnd: "18:00" },
      { hoursStart: "08:00", hoursEnd: "18:00" },
    ]) {
      expect(validateValues({ ...valid, ...hours }).errors).toEqual({});
    }
  });

  it("cleans scheduling links in the data used by Review and submission", () => {
    const { data, errors } = validateValues({
      ...valid,
      calendarLink: " calendly.com/zz ",
    });
    expect(errors).toEqual({});
    expect(data.calendarLink).toBe("https://calendly.com/zz");
  });

  it.each([
    "javascript:alert(1)",
    "ftp://example.com/zz",
    "data:text/html,test",
    "https://",
    "not a link",
  ])("rejects unsafe or invalid link %s", (calendarLink) =>
    expect(
      validateValues({ ...valid, calendarLink }).errors.calendarLink,
    ).toBeTruthy(),
  );

  it("accepts HTTP links and blank optional links", () => {
    expect(
      validateValues({ ...valid, calendarLink: "http://example.com/zz" })
        .errors,
    ).toEqual({});
    expect(validateValues({ ...valid, calendarLink: " " }).errors).toEqual({});
  });

  it("keeps the existing text limits and consent requirement", () => {
    expect(
      validateValues({ ...valid, fullName: "x".repeat(201) }).errors.fullName,
    ).toBeTruthy();
    expect(
      validateValues({ ...valid, priorities: "x".repeat(2001) }).errors
        .priorities,
    ).toBeTruthy();
    expect(
      validateValues({ ...valid, priorities: "x".repeat(2000) }).errors,
    ).toEqual({});
    expect(
      validateValues({ ...valid, consent: "" }).errors.consent,
    ).toBeTruthy();
  });
});

describe("profile drafts", () => {
  function memoryStore(initial?: string) {
    let saved = initial ?? null;
    return {
      getItem: () => saved,
      setItem: (_key: string, value: string) => {
        saved = value;
      },
      removeItem: () => {
        saved = null;
      },
    };
  }

  it("restores the step and partial input, excluding consent and the spam trap", () => {
    const storage = memoryStore();
    expect(
      writeProfileDraft(
        {
          values: {
            ...valid,
            email: "unfinished@",
            priorities: "  draft  ",
            website_url: "trap",
          },
          step: 2,
        },
        () => storage,
      ),
    ).toBe(true);
    const restored = readProfileDraft(() => storage);
    expect(restored.step).toBe(2);
    expect(restored.values.fullName).toBe(valid.fullName);
    expect(restored.values.email).toBe("unfinished@");
    expect(restored.values.priorities).toBe("  draft  ");
    expect(restored.values.consent).toBeUndefined();
    expect(restored.values.website_url).toBeUndefined();
  });

  it("ignores consent even if manually added to saved browser data", () => {
    const storage = memoryStore(
      JSON.stringify({
        version: 1,
        step: 5,
        values: { ...valid, website_url: "trap" },
      }),
    );
    expect(readProfileDraft(() => storage).values.consent).toBeUndefined();
    expect(readProfileDraft(() => storage).values.website_url).toBeUndefined();
  });

  it("handles corrupt drafts and bounds restored step numbers", () => {
    expect(readProfileDraft(() => memoryStore("bad json"))).toEqual({
      values: {},
      step: 0,
    });
    expect(
      readProfileDraft(() =>
        memoryStore(JSON.stringify({ version: 1, values: {}, step: 99 })),
      ).step,
    ).toBe(5);
    expect(
      readProfileDraft(() =>
        memoryStore(JSON.stringify({ version: 1, values: {}, step: -1 })),
      ).step,
    ).toBe(0);
  });

  it("works when access to storage or any storage operation throws", () => {
    const denied = () => {
      throw new Error("storage blocked");
    };
    expect(readProfileDraft(denied)).toEqual({ values: {}, step: 0 });
    expect(writeProfileDraft({ values: valid, step: 2 }, denied)).toBe(false);
    expect(() => clearProfileDraft(denied)).not.toThrow();
    const storage = { getItem: denied, setItem: denied, removeItem: denied };
    expect(readProfileDraft(() => storage)).toEqual({ values: {}, step: 0 });
    expect(writeProfileDraft({ values: valid, step: 2 }, () => storage)).toBe(
      false,
    );
    expect(() => clearProfileDraft(() => storage)).not.toThrow();
  });

  it("removes a saved draft after success", () => {
    const storage = memoryStore();
    writeProfileDraft({ values: valid, step: 5 }, () => storage);
    clearProfileDraft(() => storage);
    expect(readProfileDraft(() => storage)).toEqual({ values: {}, step: 0 });
  });
});
