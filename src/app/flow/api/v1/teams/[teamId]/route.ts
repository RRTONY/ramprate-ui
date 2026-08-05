const UPSTREAM = "https://flow.tonygreenberg.com";
const SKIP_REQUEST_HEADERS = new Set(["host", "content-length", "connection"]);

async function proxy(req: Request, { params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const target = new URL(`${UPSTREAM}/api/v1/teams/${teamId}`);
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
  });
  const headers = new Headers(upstream.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  return new Response(upstream.body, { status: upstream.status, headers });
}

export { proxy as GET };
