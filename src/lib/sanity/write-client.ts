import { createClient } from "@sanity/client";

// Server-only, write-capable Sanity client. Distinct from the read-only
// client in `./client.ts` — never import this from a client component or
// anything reachable outside src/app/api/admin/*.
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xdo1fb5d",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-05",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});
