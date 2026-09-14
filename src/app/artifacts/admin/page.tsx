import { isArtifactAdminUnlocked } from "@/lib/artifact-auth";
import ArtifactAdminGate from "@/components/artifacts/ArtifactAdminGate";
import ArtifactAdminDashboard from "@/components/artifacts/ArtifactAdminDashboard";

export default async function ArtifactAdminPage() {
  const unlocked = await isArtifactAdminUnlocked();
  if (!unlocked) {
    return <ArtifactAdminGate />;
  }
  return (
    <div style={{ background: "var(--dark)", minHeight: "100vh" }}>
      <ArtifactAdminDashboard />
    </div>
  );
}
