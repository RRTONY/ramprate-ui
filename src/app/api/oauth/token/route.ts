import { CORS_HEADERS, exchangeToken } from "@/lib/admin/mcp-oauth";

async function readForm(req: Request): Promise<Record<string, string>> {
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    return Object.fromEntries(
      Object.entries(body ?? {}).map(([k, v]) => [k, String(v)]),
    );
  }
  const form = new URLSearchParams(await req.text());
  return Object.fromEntries(form.entries());
}

// Exchanges a sign-in code (with its PKCE verifier) or a refresh token for
// a fresh access token.
export async function POST(req: Request): Promise<Response> {
  const result = exchangeToken(await readForm(req));
  const headers = {
    ...CORS_HEADERS,
    "cache-control": "no-store",
    pragma: "no-cache",
  };
  if (!result.ok) {
    return Response.json(
      { error: result.error, error_description: result.description },
      { status: result.error === "invalid_client" ? 401 : 400, headers },
    );
  }
  return Response.json(result.body, { headers });
}

export function OPTIONS(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
