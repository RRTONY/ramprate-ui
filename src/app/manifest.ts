import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RampRate | Technology Advisory",
    short_name: "RampRate",
    description:
      "Technology sourcing and product strategy that turns relationships into revenue.",
    start_url: "/",
    display: "standalone",
    background_color: "#071426",
    theme_color: "#0B3B91",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
