import type { Metadata } from "next";
import AdminDashboardClient from "./AdminDashboardClient";
import { ClientOnly } from "@/components/flow/ClientOnly";
import JsonLd, { breadcrumbJsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Admin Dashboard | The Flow Circuit",
  description:
    "Internal admin dashboard for Flow Circuit adoption metrics, team management, and email drip campaigns. Admin access required.",
  alternates: { canonical: "https://flow.tonygreenberg.com/admin" },
};

export default function AdminPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "https://ramprate.com" },
          { name: "Flow", url: "https://ramprate.com/flow" },
          { name: "Admin", url: "https://ramprate.com/flow/admin" },
        ])}
      />
      <ClientOnly>
        <AdminDashboardClient />
      </ClientOnly>
    </>
  );
}
