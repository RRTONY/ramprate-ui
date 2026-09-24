import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { generateReportPdf, type ReportInput } from "@/lib/admin/report-pdf";

const longParagraphs = Array.from(
  { length: 40 },
  (_, i) =>
    `Paragraph ${i + 1}. This section is deliberately longer than one page so it has to flow onto the next page instead of being clipped.`,
);

const input: ReportInput = {
  title: "Supplier Intake Forms: SOP",
  subtitle: "From submission to follow-up",
  date: "September 26, 2026",
  eyebrow: "Standard Operating Procedure",
  documentInfo: {
    version: "1.0",
    owner: "Webmaster",
    classification: "Internal use only",
  },
  sections: [
    { heading: "Purpose", paragraphs: ["Short intro."] },
    { heading: "Very long section", paragraphs: longParagraphs },
    {
      heading: "Procedure",
      steps: ["Open the Sheet", "Set Stage", "Confirm the CC copy"],
      bullets: ["Use the dropdown", "One row at a time"],
      callout: "Never paste into the Stage column.",
      table: { headers: ["Role", "Person"], rows: [["Reviewer", "Rob"]] },
    },
  ],
};

function pageCount(pdf: Buffer): number {
  return (pdf.toString("latin1").match(/\/Type\s*\/Page(?!s)/g) || []).length;
}

describe("generateReportPdf", () => {
  it("renders a long report across pages without clipping, with front matter", async () => {
    const pdf = await generateReportPdf(input);
    expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
    // cover + document info/contents + at least 2 pages for the long section
    expect(pageCount(pdf)).toBeGreaterThanOrEqual(4);
    if (process.env.REPORT_PDF_OUT)
      fs.writeFileSync(process.env.REPORT_PDF_OUT, pdf);
  });

  it("skips the front-matter page when no documentInfo is given", async () => {
    const withInfo = await generateReportPdf(input);
    const without = await generateReportPdf({
      ...input,
      documentInfo: undefined,
    });
    expect(pageCount(without)).toBe(pageCount(withInfo) - 1);
  });
});
