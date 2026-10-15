import PhaseOneGate from "./PhaseOneGate";

export default function PhaseOneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PhaseOneGate>{children}</PhaseOneGate>;
}
