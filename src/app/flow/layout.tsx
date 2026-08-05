import type { Metadata } from "next";
import { Manrope, Space_Mono, Syne } from "next/font/google";
import { FlowProviders } from "@/components/flow/FlowProviders";
import FlowNavbar from "@/components/flow/FlowNavbar";
import { NoScrapeGuard } from "@/components/flow/NoScrapeGuard";
import FloatingCTA from "@/components/flow/FloatingCTA";
import EcosystemFooter from "@/components/flow/EcosystemFooter";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-flow-manrope",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-flow-syne",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-flow-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Flow Circuit | RampRate",
  description:
    "12 questions. 5 minutes. Discover if you're the Spark, Amplifier, Filter, Ground, or Conductor. Map your team's invisible architecture and cut 70% of innovation friction.",
};

export default function FlowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${manrope.variable} ${syne.variable} ${spaceMono.variable} flow-scope`}>
      <FlowProviders>
        <NoScrapeGuard />
        <FlowNavbar />
        {children}
        <FloatingCTA />
        <EcosystemFooter />
      </FlowProviders>
    </div>
  );
}
