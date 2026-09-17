import type { Metadata, Viewport } from "next";
import "./kumbaya.css";
import { KumbayaStaticIntro } from "./KumbayaStaticIntro";
import { KumbayaForm } from "./KumbayaForm";

// Kept private per explicit instruction: this is an internal sponsor/event
// vetting tool with its own scoring rubric, not public marketing content.
// The typed `robots` field is used (not `other`) specifically because the
// root layout already sets its own typed `robots: {index:true,...}` -
// putting this in `other` instead produced two separate, conflicting
// <meta name="robots"> tags (confirmed via a real build), since Next only
// replaces a parent's *typed* robots field, not an `other`-keyed one.
// GPTBot/ClaudeBot have no typed field of their own, so those stay in
// `other`, where they don't collide with anything. The original's
// non-standard "noai,noimageai" tokens on the same tag aren't expressible
// through the typed API and are dropped here - noindex/nofollow plus the
// explicit GPTBot/ClaudeBot blocks below cover the actual privacy intent.
export const metadata: Metadata = {
  title: { absolute: "Kumbaya · The Shared Upside Protocol" },
  description:
    "Kumbaya is RampRate and ImpactSoul’s shared-upside intake for meaningful events, partnerships, participation, and distribution.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
  },
  other: {
    GPTBot: "noindex,nofollow,noarchive,nosnippet,noimageindex",
    ClaudeBot: "noindex,nofollow,noarchive,nosnippet,noimageindex",
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%237d5cff'/%3E%3Cpath d='M17 46 31 14h8L25 46h-8Zm17 0 13-32h-8L26 46h8Z' fill='white'/%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4efeb",
};

// Own design system, kept scoped to `.kumbaya-page` (see kumbaya.css) so
// none of it leaks into the rest of the site via the shared root layout -
// this page still goes through that layout (for ConditionalChrome to hide
// the site Header/Footer, see src/components/shared/ConditionalChrome.tsx),
// it just never touches globals.css's own element-level resets.
export default function KumbayaPage() {
  return (
    <div className="kumbaya-page">
      <main className="shell">
        <KumbayaStaticIntro />
        <KumbayaForm />
        <div className="footer">
          Kumbaya · The Shared Upside Protocol · RampRate × ImpactSoul · B Lab Certified
        </div>
      </main>
    </div>
  );
}
