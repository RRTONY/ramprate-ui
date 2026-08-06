import type { Metadata } from "next";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Sign Up | The Flow Circuit",
  description: "Create your Flow Circuit account.",
  alternates: { canonical: "https://ramprate.com/flow/signup" },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Sign Up", url: "https://ramprate.com/flow/signup" },
        ])}
      />
      {children}
    </>
  );
}
