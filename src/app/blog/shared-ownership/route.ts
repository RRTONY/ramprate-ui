import article from "@/content/shared-ownership.json";

export const dynamic = "force-static";

export function GET() {
  return new Response(article.html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
