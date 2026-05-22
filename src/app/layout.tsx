import type {Metadata} from 'next'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {sanityFetch} from '@/lib/sanity/client'
import {siteSettingsQuery} from '@/lib/sanity/queries'
import JsonLd, {organizationJsonLd} from '@/components/shared/JsonLd'
import ExitSurvey from '@/components/shared/ExitSurvey'
import ScrollToTop from '@/components/shared/ScrollToTop'

export const metadata: Metadata = {
  title: {
    default: 'RampRate - IT Infrastructure Advisory',
    template: '%s | RampRate',
  },
  description:
    'RampRate is a B-Corp certified IT infrastructure advisory firm helping enterprises optimize technology sourcing, reduce costs, and drive impact.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og.png'],
  },
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const settings = await sanityFetch<{
    companyName?: string
    address?: {street?: string; city?: string; state?: string; zip?: string}
    phone?: string
    email?: string
    socialLinks?: {platform: string; url: string}[]
    googleAnalyticsId?: string
  }>({query: siteSettingsQuery, tags: ['siteSettings'], revalidate: 3600})

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased" suppressHydrationWarning>
        <JsonLd
          data={organizationJsonLd({
            name: settings?.companyName,
            description:
              'RampRate is a B-Corp certified IT infrastructure advisory firm helping enterprises optimize technology sourcing, reduce costs, and drive impact.',
            address: settings?.address,
            phone: settings?.phone,
            email: settings?.email,
            socialLinks: settings?.socialLinks,
          })}
        />
        <Header />
        <main className="min-h-screen">{children}</main>
        {settings?.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
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
  )
}
