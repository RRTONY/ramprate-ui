import article from "@/content/the-cloud-gets-rich.json";

export const dynamic = "force-static";

export function GET() {
  return new Response(article.html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
