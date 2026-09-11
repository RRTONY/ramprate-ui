import { FlowProviders } from "@/components/flow/FlowProviders";

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return <FlowProviders>{children}</FlowProviders>;
}
