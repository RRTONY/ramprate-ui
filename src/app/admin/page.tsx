import type { Metadata } from "next";
import { isPortalUnlocked } from "@/lib/portal-auth";
import PortalGate from "@/components/portal/PortalGate";
import AdminChatClient from "@/components/admin/AdminChatClient";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const unlocked = await isPortalUnlocked("admin");

  if (!unlocked) {
    return (
      <PortalGate
        portalId="admin"
        title="RampRate Admin"
        subtitle="Owner access only. Enter the admin password to continue."
      />
    );
  }

  return <AdminChatClient />;
}
