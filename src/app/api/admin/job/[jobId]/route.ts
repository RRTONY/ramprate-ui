import { NextRequest, NextResponse } from "next/server";
import { isPortalUnlocked } from "@/lib/portal-auth";
import { getJob } from "@/lib/admin/job-store";

// Polled by the browser every few seconds while a background admin-chat job
// (started via POST /api/admin/job) is in progress. Deliberately returns
// only what the chat UI needs, not the full job record (messages/attachments
// stay server-side).
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const unlocked = await isPortalUnlocked("admin");
  if (!unlocked) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { jobId } = await params;
  const job = await getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: job.status,
    stepLabel: job.stepLabel,
    answer: job.answer,
    error: job.error,
    branch: job.branch,
    prNumber: job.prNumber,
    downloads: job.downloads,
    iteration: job.iteration,
  });
}
