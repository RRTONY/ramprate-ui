import { bearerFromRequest, isMcpAuthConfigured } from "@/lib/admin/mcp-auth";
import { jsonError, respondToMcp } from "@/lib/admin/mcp-handler";
import {
  authenticateMcpBearer,
  wwwAuthenticateHeader,
} from "@/lib/admin/mcp-oauth";

export const dynamic = "force-dynamic";

// Header-auth entry point, used by every client that can send an
// Authorization header: ChatGPT and Claude after signing in on
// /oauth/authorize (OAuth access token), or Claude Code / the Claude.ai org
// connector with a personal token from MCP_ADMIN_USERS. The 401 carries a
// WWW-Authenticate pointer to our OAuth metadata - that is how ChatGPT and
// Claude discover they should open the RampRate sign-in page.
async function handle(req: Request): Promise<Response> {
  if (!isMcpAuthConfigured()) {
    return jsonError(500, "MCP_ADMIN_USERS is not configured");
  }
  const user = authenticateMcpBearer(bearerFromRequest(req));
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "content-type": "application/json",
        "www-authenticate": wwwAuthenticateHeader(new URL(req.url).origin),
      },
    });
  }
  return respondToMcp(req, user);
}

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
