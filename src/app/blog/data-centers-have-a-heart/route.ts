import article from "@/content/data-centers-have-a-heart.json";

export const dynamic = "force-static";

export function GET() {
  return new Response(article.html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
