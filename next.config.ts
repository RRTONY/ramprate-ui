import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixes Lighthouse's "Missing source maps for large first-party JavaScript"
  // Best Practices check. Trade-off is more readable client source in devtools
  // for anyone who looks - acceptable for a public marketing site with no
  // server secrets in client code, in exchange for real stack traces in any
  // error-tracking tool.
  productionBrowserSourceMaps: true,
  // The MCP server's check_code_quality tool runs ESLint programmatically
  // (src/lib/admin/code-check.ts). ESLint's flat-config system resolves some
  // of its own internals (e.g. eslint/lib/config-api.js) via a dynamic
  // require Next's build-time output-file tracing doesn't follow statically,
  // so without this the deployed function 500s with "Cannot find module
  // .../eslint/lib/config-api.js" the moment it's invoked - confirmed live
  // in production, not just suspected. Pulling in the whole eslint* /
  // @eslint / @typescript-eslint tree (not just the one missing file) since
  // there could be other dynamically-required internals beyond this one and
  // each guess costs a full deploy cycle to verify.
  outputFileTracingIncludes: {
    "/api/mcp": [
      "./node_modules/eslint*/**/*",
      "./node_modules/@eslint/**/*",
      "./node_modules/@typescript-eslint/**/*",
      "./node_modules/@next/eslint-plugin-next/**/*",
    ],
    "/api/mcp/\\[token\\]": [
      "./node_modules/eslint*/**/*",
      "./node_modules/@eslint/**/*",
      "./node_modules/@typescript-eslint/**/*",
      "./node_modules/@next/eslint-plugin-next/**/*",
    ],
  },
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
  async redirects() {
    return [
      {
        source: "/bio",
        destination: "/biochain",
        permanent: true,
      },
      {
        source: "/nda",
        destination: "https://ramprate.s.gy/nda-sign",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
