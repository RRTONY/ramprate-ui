export const dynamic = "force-static";

// Kept offline at the owner’s request. The original copy remains in src/content.
export function GET() {
  return new Response("Not found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  });
}
