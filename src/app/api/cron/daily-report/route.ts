import { NextResponse } from "next/server";
import { isCronRequestAuthorized } from "@/lib/reports/cron-auth";
import { generateDailyReport } from "@/lib/reports/daily-report";

export async function GET(req: Request) {
  if (!isCronRequestAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await generateDailyReport();
    return NextResponse.json({
      ok: true,
      emailId: result.emailId,
      reportRunId: result.reportRunId,
      alertCount: result.alerts.length,
    });
  } catch (err) {
    console.error("cron/daily-report failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Report generation failed" },
      { status: 500 },
    );
  }
}
