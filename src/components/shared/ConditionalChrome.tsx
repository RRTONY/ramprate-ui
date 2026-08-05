"use client";

import { usePathname } from "next/navigation";
import ExitSurvey from "@/components/shared/ExitSurvey";

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
  const isFlow = pathname?.startsWith("/flow");

  return (
    <>
      {!isFlow && header}
      <main className="min-h-screen">{children}</main>
      {!isFlow && footer}
      {!isFlow && <ExitSurvey />}
    </>
  );
}
