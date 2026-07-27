import BioChainSubNav from "@/components/biochain/BioChainSubNav";

export default function BioChainRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BioChainSubNav />
      {children}
    </>
  );
}
