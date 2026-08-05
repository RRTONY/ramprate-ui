import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          // sonner portals its container to document.body, outside .flow-scope,
          // so var(--popover) etc never resolve there - literal values travel
          // with the element regardless of where it renders.
          "--normal-bg": "oklch(0.98 0.005 260)",
          "--normal-text": "oklch(0.15 0.02 260)",
          "--normal-border": "oklch(0.85 0.02 260)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
