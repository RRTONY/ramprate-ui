import localFont from "next/font/local";

// The brief's fonts, self-hosted (latin files from Google Fonts, SIL Open Font
// License) so the build never depends on fetching them from Google; that
// broke Netlify builds for Space Grotesk on Nov 24, 2026. brief.css reads
// them through --font-cato-serif / --font-cato-mono.
export const catoSerif = localFont({
  src: "./fonts/fraunces-latin.woff2",
  weight: "500 700",
  variable: "--font-cato-serif",
  display: "swap",
});

export const catoMono = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-400-latin.woff2", weight: "400" },
    { path: "./fonts/ibm-plex-mono-500-latin.woff2", weight: "500" },
  ],
  variable: "--font-cato-mono",
  display: "swap",
});
