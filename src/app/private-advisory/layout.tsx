import PrivateAdvisorySubNav from "@/components/private-advisory/PrivateAdvisorySubNav";

export default function PrivateAdvisoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PrivateAdvisorySubNav />
      {children}
    </>
  );
}
