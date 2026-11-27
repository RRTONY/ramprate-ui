import type { Metadata } from "next";
import ValueExperience from "./ValueExperience";

export const metadata: Metadata = {
  title: "What Becomes Possible With Us | RampRate",
  description:
    "Choose an outcome, see how RampRate builds durable value, explore an illustrative case, and start a private conversation.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function WeValuePage() {
  return <ValueExperience />;
}
