import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixes Lighthouse's "Missing source maps for large first-party JavaScript"
  // Best Practices check. Trade-off is more readable client source in devtools
  // for anyone who looks - acceptable for a public marketing site with no
  // server secrets in client code, in exchange for real stack traces in any
  // error-tracking tool.
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Netlify's netlify.toml [[headers]] block only applies to files served
  // directly from the publish directory - Next-rendered routes go through
  // @netlify/plugin-nextjs functions/edge and never see those headers, so
  // they have to be set here instead. CSP is deliberately still not set -
  // this app loads inline analytics-init scripts that need nonces/hashes
  // done carefully, not bundled into a headers cleanup.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
