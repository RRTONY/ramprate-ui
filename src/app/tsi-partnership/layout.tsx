import { Fraunces, Public_Sans } from "next/font/google";

// Route-scoped fonts for the TSI partnership page only. This page's design
// (ivory/plum/sage palette, Fraunces display serif) deliberately departs from
// the rest of the site's Playfair/DM Sans + gold/dark system, matching the
// bespoke HTML design artifact this page was built from. Scoping the fonts
// here, rather than touching the root layout, keeps that departure contained
// to this one confidential page.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-public-sans",
  display: "swap",
});

export default function TsiPartnershipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${fraunces.variable} ${publicSans.variable}`}>
      {children}
    </div>
  );
}
