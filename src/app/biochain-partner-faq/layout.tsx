import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner FAQ",
  robots: { index: false, follow: false, nocache: true },
};

export default function PartnerFaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
