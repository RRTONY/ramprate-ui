import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artifact Manager",
  robots: { index: false, follow: false, nocache: true },
};

export default function ArtifactAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
