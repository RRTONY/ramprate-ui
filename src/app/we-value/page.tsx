import type { Metadata } from "next";
import ValueExperience from "./ValueExperience";

export const metadata: Metadata = {
  title: "From Me to We | The Glasshouse",
  description:
    "A transparent working model for evaluating durable value, project fit, and shared upside.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function WeValuePage() {
  return <ValueExperience />;
}
