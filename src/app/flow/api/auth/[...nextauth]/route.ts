const UPSTREAM = "https://flow.tonygreenberg.com";

// These must not be forwarded verbatim: host/content-length need to match
// the outgoing request to flow.tonygreenberg.com, not the incoming one, and
// fetch() recomputes them itself. Everything else - including
// x-auth-return-redirect, the header Auth.js's client uses to ask for a JSON
// response instead of a redirect - gets forwarded as-is.
const SKIP_REQUEST_HEADERS = new Set(["host", "content-length", "connection"]);

async function proxy(req: Request, { params }: { params: Promise<{ nextauth: string[] }> }) {
  const { nextauth } = await params;
  const target = new URL(`${UPSTREAM}/api/auth/${nextauth.join("/")}`);
  target.search = new URL(req.url).search;

  const forwardHeaders = new Headers();
  req.headers.forEach((value, key) => {
    if (!SKIP_REQUEST_HEADERS.has(key.toLowerCase())) {
      forwardHeaders.set(key, value);
    }
  });

  const upstream = await fetch(target, {
    method: req.method,
    headers: forwardHeaders,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
    redirect: "manual",
  });

  const headers = new Headers(upstream.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");

  const location = headers.get("location");
  if (location?.startsWith(UPSTREAM)) {
    // Use the actual request headers, not new URL(req.url) - the latter can
    // resolve to a different hostname (e.g. "localhost" vs "127.0.0.1", or
    // an internal host behind a proxy) than what the browser's address bar
    // shows, which turns this redirect into a cross-origin one the browser
    // then blocks entirely (this is what broke login end-to-end).
    const forwardedHost = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    const forwardedProto = req.headers.get("x-forwarded-proto") ?? new URL(req.url).protocol.replace(":", "");
    const rewritten = new URL(location);
    if (forwardedHost) {
      rewritten.protocol = `${forwardedProto}:`;
      rewritten.host = forwardedHost;
    } else {
      rewritten.protocol = new URL(req.url).protocol;
      rewritten.host = new URL(req.url).host;
    }
    if (!rewritten.pathname.startsWith("/flow")) {
      // Avoid producing "/flow/" when the original path is bare "/" - an
      // extra trailing slash triggers Next.js's own 308 normalization
      // redirect, and that second hop is what broke signIn()'s handling
      // of this response (it ends up trying to parse the final HTML page
      // as JSON instead of reading the single redirect it expects).
      rewritten.pathname = `/flow${rewritten.pathname}`.replace(/\/$/, "") || "/flow";
    }
    headers.set("location", rewritten.toString());
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}

export { proxy as GET, proxy as POST };
