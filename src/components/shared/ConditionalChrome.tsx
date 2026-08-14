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
  const isFlow = pathname?.startsWith("/flow");

  return (
    <>
      {!isFlow && header}
      <main className="min-h-screen">{children}</main>
      {!isFlow && footer}
    </>
  );
}
