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
  const hideChrome = pathname?.startsWith("/flow");

  return (
    <>
      {!hideChrome && header}
      <main className="min-h-screen">{children}</main>
      {!hideChrome && footer}
    </>
  );
}
