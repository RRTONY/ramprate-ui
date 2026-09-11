import { NextResponse } from "next/server";

export async function GET() {
  const isTestRuntime =
    process.env.NODE_ENV === "test" || process.env.VITEST === "true";
  if (!isTestRuntime) return new NextResponse(null, { status: 404 });

  return NextResponse.json({ databaseManaged: true });
}
