import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const storeFormSubmission = vi.fn();
vi.mock("@/lib/submissions/store", () => ({ storeFormSubmission }));

const { POST: postContact } = await import("@/app/api/contact-intake/route");
const { POST: postNewsletter } =
  await import("@/app/api/newsletter-intake/route");
const projectFile = (path: string) => resolve(process.cwd(), path);

describe("managed form submission persistence", () => {
  beforeEach(() => {
    storeFormSubmission.mockReset();
    storeFormSubmission.mockResolvedValue({ id: 1 });
  });

  it("persists a valid contact payload before returning success", async () => {
    const response = await postContact(
      new NextRequest("https://ramprate.com/api/contact-intake", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          referer: "https://ramprate.com/contact",
        },
        body: JSON.stringify({
          name: "Jane Example",
          email: "jane@example.com",
          message: "Please contact me about advisory services.",
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(storeFormSubmission).toHaveBeenCalledWith({
      formType: "contact",
      sourceUrl: "https://ramprate.com/contact",
      payload: {
        name: "Jane Example",
        email: "jane@example.com",
        message: "Please contact me about advisory services.",
      },
    });
  });

  it("validates and persists a newsletter subscription", async () => {
    const response = await postNewsletter(
      new NextRequest("https://ramprate.com/api/newsletter-intake", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          referer: "https://ramprate.com/",
        },
        body: JSON.stringify({ email: "reader@example.com" }),
      }),
    );

    expect(response.status).toBe(200);
    expect(storeFormSubmission).toHaveBeenCalledWith({
      formType: "newsletter",
      sourceUrl: "https://ramprate.com/",
      payload: { email: "reader@example.com" },
    });
  });

  it("adds persistence to every established Google Sheet intake path", async () => {
    const routes = [
      "src/app/api/champions-intake/route.ts",
      "src/app/api/client-intake/route.ts",
      "src/app/api/engagement-intake/route.ts",
      "src/app/api/payments-intake/route.ts",
      "src/app/api/supplier-intake/route.ts",
      "src/app/api/supplier-intake-long/route.ts",
    ];
    const sources = await Promise.all(
      routes.map((route) => readFile(projectFile(route), "utf8")),
    );

    for (const source of sources) {
      expect(source).toMatch(/from ["']@\/lib\/submissions\/store["']/);
      expect(source).toContain("storeFormSubmission");
    }
  });
});
