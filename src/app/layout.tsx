import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { sanityFetch } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import JsonLd, {
  organizationJsonLd,
  webSiteJsonLd,
} from "@/components/shared/JsonLd";
import { urlFor } from "@/lib/sanity/image";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { ConditionalChrome } from "@/components/shared/ConditionalChrome";

export const metadata: Metadata = {
  metadataBase: new URL("https://ramprate.com"),
  title: {
    default: "RampRate | Data Center, Telecom & Cloud Advisory",
    template: "%s | RampRate",
  },
  description:
    "RampRate: B Lab-certified advisory turning relationships into revenue via technology sourcing and product strategy — $10B+ managed since 2000.",
  keywords: [
    "technology advisory",
    "enterprise IT sourcing",
    "data center procurement",
    "supplier negotiation",
    "B Lab certified advisory",
    "RampRate",
  ],
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
    logo?:
      | (Parameters<typeof urlFor>[0] & { asset?: { _ref?: string } })
      | undefined;
    address?: string;
    phone?: string;
    email?: string;
    socialLinks?: { platform: string; url: string }[];
    googleAnalyticsId?: string;
  }>({ query: siteSettingsQuery, tags: ["siteSettings"], revalidate: 60 });

  // Sanity asset refs encode intrinsic dimensions as `image-<id>-<w>x<h>-<ext>`,
  // letting us give the Organization JSON-LD logo a real ImageObject width/height
  // (Google's Knowledge Panel guidance) without an extra query.
  const logoRefDims = settings?.logo?.asset?._ref?.match(/-(\d+)x(\d+)-/);
  const logoWidth = logoRefDims ? 512 : undefined;
  const logoHeight = logoRefDims
    ? Math.round(512 * (Number(logoRefDims[2]) / Number(logoRefDims[1])))
    : undefined;

  // Resolve GA ID: Sanity value wins, but treat an empty/whitespace value as
  // unset so it falls back to the env var (?? would keep an empty string).
  const gaId =
    settings?.googleAnalyticsId?.trim() || process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${playfairDisplay.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Google Analytics - only render when an ID exists (avoids id=undefined) */}
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
        <JsonLd data={webSiteJsonLd({ name: settings?.companyName })} />
        <JsonLd
          data={organizationJsonLd({
            name: settings?.companyName,
            logo: settings?.logo
              ? urlFor(settings.logo).width(512).url()
              : undefined,
            logoWidth,
            logoHeight,
            description:
              "RampRate is a B Lab certified technology advisory firm helping enterprises optimize technology sourcing, reduce costs, and drive impact.",
            address: settings?.address,
            phone: settings?.phone,
            email: settings?.email,
            socialLinks: settings?.socialLinks,
          })}
        />
        <ConditionalChrome
          header={<Header />}
          footer={
            <Footer
              companyName={settings?.companyName}
              phone={settings?.phone}
              email={settings?.email}
              socialLinks={settings?.socialLinks}
            />
          }
        >
          {children}
        </ConditionalChrome>
        <ScrollToTop />
      </body>
    </html>
  );
}
