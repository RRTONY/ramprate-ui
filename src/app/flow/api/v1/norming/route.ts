const UPSTREAM = "https://flow.tonygreenberg.com";

async function proxy(req: Request) {
  const target = new URL(`${UPSTREAM}/api/v1/norming`);
  target.search = new URL(req.url).search;

  const upstream = await fetch(target, {
    method: req.method,
    headers: {
      "x-api-key": req.headers.get("x-api-key") ?? "",
      authorization: req.headers.get("authorization") ?? "",
    },
  });
  const headers = new Headers(upstream.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  return new Response(upstream.body, { status: upstream.status, headers });
}

export { proxy as GET };
