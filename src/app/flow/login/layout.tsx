import type { Metadata } from "next";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Log In | The Flow Circuit",
  description: "Log in to your Flow Circuit account.",
  alternates: { canonical: "https://ramprate.com/flow/login" },
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Log In", url: "https://ramprate.com/flow/login" },
        ])}
      />
      {children}
    </>
  );
}
