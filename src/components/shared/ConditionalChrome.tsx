"use client";

import { usePathname } from "next/navigation";

export function ConditionalChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname?.split("/").filter(Boolean) || [];
  // /artifacts/[slug] artifact pages render standalone (no site nav/footer
  // around the sandboxed iframe) - but not the /artifacts listing itself
  // or /artifacts/admin, which should feel like normal parts of the site.
  // Segment-based check (not a string-prefix check) so a real artifact
  // slugged e.g. "admin-something" isn't mistaken for the admin route.
  const isStandaloneArtifact =
    segments[0] === "artifacts" &&
    segments.length === 2 &&
    segments[1] !== "admin";
  const isStandalonePage =
    segments[0] === "biochain-partner-faq" ||
    segments[0] === "kumbaya" ||
    segments[0] === "active-pharm-form";
  const hideChrome =
    pathname?.startsWith("/flow") || isStandaloneArtifact || isStandalonePage;

  return (
    <>
      {!hideChrome && header}
      <main className="min-h-screen">{children}</main>
      {!hideChrome && footer}
    </>
  );
}
