import { NextRequest, NextResponse } from "next/server";

// The only public entry point into /biochain/catalogue - every outbound link
// to the catalogue (buyer-intake page, the BioChain overview page) routes
// through here instead of linking directly, so the catalogue itself is never
// a standalone landing page a crawler or a shared URL can reach cold. Sets a
// short-lived cookie the catalogue page checks server-side before rendering
// (see src/app/biochain/catalogue/page.tsx) and redirects there.
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/biochain/catalogue", request.url));
  response.cookies.set("biochain_catalogue_gate", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 30,
  });
  return response;
}
