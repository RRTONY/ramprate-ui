import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedAdmin } from "@/lib/admin/access";

export async function GET(request: NextRequest) {
  const administrator = await getAuthorizedAdmin(request);
  if (!administrator) {
    return NextResponse.json(
      { error: "RampRate CMS sign-in is required." },
      { status: 401 },
    );
  }

  return NextResponse.json({ member: administrator });
}
