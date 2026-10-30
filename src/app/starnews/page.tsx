import type { Metadata } from "next";
import StarNewsGate from "./StarNewsGate";

export const metadata: Metadata = {
  title: "StarNews × RampRate | Partnership Discussion",
  robots: { index: false, follow: false, nocache: true },
};

export default function StarNewsPage() {
  return <StarNewsGate />;
}
