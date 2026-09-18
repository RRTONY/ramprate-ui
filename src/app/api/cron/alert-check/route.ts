import { NextResponse } from "next/server";
import { isCronRequestAuthorized } from "@/lib/reports/cron-auth";
import { runAlertCheck } from "@/lib/reports/alert-check";

export async function GET(req: Request) {
  if (!isCronRequestAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runAlertCheck();
    return NextResponse.json({
      ok: true,
      alertCount: result.alertsFired.length,
      emailId: result.emailId,
      reportRunId: result.reportRunId,
    });
  } catch (err) {
    console.error("cron/alert-check failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Alert check failed" },
      { status: 500 },
    );
  }
}
