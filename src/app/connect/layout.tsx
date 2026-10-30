import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect with RampRate",
  description:
    "Tell us about your project, introduction, partnership idea or inquiry and the RampRate team will take it from there.",
  alternates: { canonical: "/connect" },
};

export default function ConnectLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
