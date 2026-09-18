import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readSource = (path: string) =>
  readFile(resolve(process.cwd(), path), "utf8");

describe("Kumbaya shared-upside intake", () => {
  it("keeps the public route, values, accessible four-step intake, and canonical metadata", async () => {
    const [page, form, route, attachmentRoute, storage, sitePages] =
      await Promise.all([
        readSource("src/app/kumbaya/page.tsx"),
        readSource("src/components/kumbaya/KumbayaIntakeForm.tsx"),
        readSource("src/app/api/kumbaya-intake/route.ts"),
        readSource("src/app/api/kumbaya-intake/attachment/route.ts"),
        readSource("src/lib/storage.ts"),
        readSource("src/lib/site-pages.ts"),
      ]);

    expect(page).toContain('canonical: "/kumbaya"');
    expect(page).toContain("The Shared Upside Protocol");
    expect(page).toContain("RampRate × ImpactSol");
    expect(page).toContain("Purpose before presence.");
    expect(page).toContain("Bring purpose");
    expect(page).toContain("Community support.");
    expect(page).toContain("Turn trust into useful leverage.");
    expect(page).toContain("Make purpose economically durable.");
    expect(page).toContain("Evidence. Alignment. Access. Care.");
    expect(page).toContain("What this means for an event");
    expect(page).toContain("A living impact network.");
    expect(page).toContain(
      "A room where regenerative health becomes investable.",
    );
    expect(page).toContain("B Lab&apos;s public directory");
    expect(page).toContain("Sprout Social");
    expect(form).toContain('fetch("/api/kumbaya-intake"');
    expect(form).toContain(
      'const steps = ["The event", "The room", "The opportunity", "Review"]',
    );
    expect(form).toContain(
      "aria-label={`Step ${step + 1} of ${steps.length}`}",
    );
    expect(form).toContain('type="date"');
    expect(form).toContain('label="Event details"');
    expect(form).toContain('label="Venue link"');
    expect(form).toContain('label="Venue photo or moodboard image"');
    expect(form).toContain('fetch("/api/kumbaya-intake/attachment"');
    expect(form).toContain('accept="image/jpeg,image/png,image/webp"');
    expect(form).toContain('role="alert"');
    expect(route).toContain('formType: "kumbaya-shared-upside-intake"');
    expect(route).toContain("kumbayaSchema.validate");
    expect(route).toContain("stripUnknown: true");
    expect(route).toContain("venueAttachmentSchema");
    expect(attachmentRoute).toContain("MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024");
    expect(attachmentRoute).toContain("allowedImageTypes");
    expect(attachmentRoute).toContain("storagePut");
    expect(attachmentRoute).toContain("safeFileName");
    expect(storage).toContain("v1/storage/presign/put");
    expect(storage).toContain("url: `/manus-storage/${key}`");
    expect(sitePages).toContain('path: "/kumbaya"');
    expect(sitePages).toContain("The Shared Upside Protocol");
  });
});
