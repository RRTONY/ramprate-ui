import TorqueSubNav from "@/components/torque/TorqueSubNav";

export default function TorqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TorqueSubNav />
      {children}
    </>
  );
}
