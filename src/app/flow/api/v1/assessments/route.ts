const UPSTREAM = "https://flow.tonygreenberg.com";

async function proxy(req: Request) {
  const upstream = await fetch(`${UPSTREAM}/api/v1/assessments`, {
    method: req.method,
    headers: {
      "x-api-key": req.headers.get("x-api-key") ?? "",
      authorization: req.headers.get("authorization") ?? "",
      "content-type": req.headers.get("content-type") ?? "",
    },
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
  });
  const headers = new Headers(upstream.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  return new Response(upstream.body, { status: upstream.status, headers });
}

export { proxy as POST };
