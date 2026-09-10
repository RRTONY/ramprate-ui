import { NextRequest, NextResponse } from "next/server";
import { hasAdminConfiguration, isConfiguredAdmin } from "@/lib/admin/access";

export async function GET(request: NextRequest) {
  const isTestRuntime =
    process.env.NODE_ENV === "test" || process.env.VITEST === "true";
  if (!isTestRuntime) {
    return new NextResponse(null, { status: 404 });
  }

  const requestedEmail = request.headers.get("x-admin-test-email");
  if (!hasAdminConfiguration() || !isConfiguredAdmin(requestedEmail)) {
    return NextResponse.json({ configured: false }, { status: 401 });
  }

  return NextResponse.json({ configured: true });
}
