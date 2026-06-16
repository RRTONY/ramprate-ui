import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { sanityFetch } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import JsonLd, { organizationJsonLd, webSiteJsonLd } from "@/components/shared/JsonLd";
import ExitSurvey from "@/components/shared/ExitSurvey";
import ScrollToTop from "@/components/shared/ScrollToTop";

export const metadata: Metadata = {
  metadataBase: new URL("https://ramprate.com"),
  title: {
    default: "RampRate - IT Infrastructure Advisory",
    template: "%s | RampRate",
  },
  description:
    "RampRate is a B-Corp certified IT infrastructure advisory firm helping enterprises optimize technology sourcing, reduce costs, and drive impact.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    siteName: "RampRate",
    url: "https://ramprate.com",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await sanityFetch<{
    companyName?: string;
    address?: { street?: string; city?: string; state?: string; zip?: string };
    phone?: string;
    email?: string;
    socialLinks?: { platform: string; url: string }[];
    googleAnalyticsId?: string;
  }>({ query: siteSettingsQuery, tags: ["siteSettings"], revalidate: 60 });

  // Resolve GA ID: Sanity value wins, but treat an empty/whitespace value as
  // unset so it falls back to the env var (?? would keep an empty string).
  const gaId =
    settings?.googleAnalyticsId?.trim() || process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Google Analytics — only render when an ID exists (avoids id=undefined) */}
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
            </Script>
          </>
        )}

        {/* Plausible Analytics */}
        <Script
          id="plausible-init"
          strategy="afterInteractive"
          src="https://plausible.io/js/pa-M6v6diZ7bHkyH4N7zI23W.js"
        />
        <Script id="plausible-setup" strategy="afterInteractive">
          {`
            window.plausible = window.plausible || function() {
              (plausible.q = plausible.q || []).push(arguments)
            };
            plausible.init = plausible.init || function(i) {
              plausible.o = i || {}
            };
            plausible.init();
          `}
        </Script>
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <JsonLd data={webSiteJsonLd({name: settings?.companyName})} />
        <JsonLd
          data={organizationJsonLd({
            name: settings?.companyName,
            description:
              "RampRate is a B-Corp certified IT infrastructure advisory firm helping enterprises optimize technology sourcing, reduce costs, and drive impact.",
            address: settings?.address,
            phone: settings?.phone,
            email: settings?.email,
            socialLinks: settings?.socialLinks,
          })}
        />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer
          companyName={settings?.companyName}
          phone={settings?.phone}
          email={settings?.email}
          socialLinks={settings?.socialLinks}
        />
        <ExitSurvey />
        <ScrollToTop />
      </body>
    </html>
  );
}
