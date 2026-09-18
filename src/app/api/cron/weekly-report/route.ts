import { NextResponse } from "next/server";
import { isCronRequestAuthorized } from "@/lib/reports/cron-auth";
import { generateWeeklyReport } from "@/lib/reports/weekly-report";

export async function GET(req: Request) {
  if (!isCronRequestAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await generateWeeklyReport();
    return NextResponse.json({
      ok: true,
      emailId: result.emailId,
      reportRunId: result.reportRunId,
    });
  } catch (err) {
    console.error("cron/weekly-report failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Report generation failed" },
      { status: 500 },
    );
  }
}
