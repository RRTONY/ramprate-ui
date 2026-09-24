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

// Some clients send their client_id as HTTP Basic credentials instead of a
// form field (allowed by OAuth even for public clients, with an empty
// secret). Accept either, preferring the form field.
function basicClientId(req: Request): string | undefined {
  const header = req.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return undefined;
  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const id = decodeURIComponent(decoded.split(":")[0] ?? "");
    return id || undefined;
  } catch {
    return undefined;
  }
}

// Exchanges a sign-in code (with its PKCE verifier) or a refresh token for
// a fresh access token.
export async function POST(req: Request): Promise<Response> {
  const form = await readForm(req);
  if (!form.client_id) {
    const fromBasic = basicClientId(req);
    if (fromBasic) form.client_id = fromBasic;
  }
  const result = exchangeToken(form);
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
