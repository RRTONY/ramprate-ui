import type { Metadata } from "next";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Forgot Password | The Flow Circuit",
  description: "Request a password reset link for your Flow Circuit account.",
  alternates: { canonical: "https://ramprate.com/flow/forgot-password" },
  robots: { index: false, follow: false },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Forgot Password", url: "https://ramprate.com/flow/forgot-password" },
        ])}
      />
      {children}
    </>
  );
}
