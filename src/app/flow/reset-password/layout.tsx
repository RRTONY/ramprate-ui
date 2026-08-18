import type { Metadata } from "next";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Reset Password | The Flow Circuit",
  description: "Reset the password for your Flow Circuit account.",
  alternates: { canonical: "https://ramprate.com/flow/reset-password" },
  robots: { index: false, follow: false },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Reset Password", url: "https://ramprate.com/flow/reset-password" },
        ])}
      />
      {children}
    </>
  );
}
