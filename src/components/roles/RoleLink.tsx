"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ROLE_SOURCES } from "@/lib/roles";

const noSubscribe = () => () => {};
function srcSuffix() {
  const src = new URLSearchParams(window.location.search).get("src");
  return src && ROLE_SOURCES.includes(src)
    ? `?src=${encodeURIComponent(src)}`
    : "";
}

// Carries a valid ?src= origin tag from the listing page on to the role page.
export default function RoleLink({
  slug,
  className,
  children,
}: {
  slug: string;
  className?: string;
  children: React.ReactNode;
}) {
  const suffix = useSyncExternalStore(noSubscribe, srcSuffix, () => "");
  return (
    <Link href={`/roles/${slug}${suffix}`} className={className}>
      {children}
    </Link>
  );
}
