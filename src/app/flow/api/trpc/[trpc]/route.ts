const UPSTREAM = "https://flow.tonygreenberg.com";

async function proxy(req: Request, { params }: { params: Promise<{ trpc: string }> }) {
  const { trpc } = await params;
  const target = new URL(`${UPSTREAM}/api/trpc/${trpc}`);
  target.search = new URL(req.url).search;

  const upstream = await fetch(target, {
    method: req.method,
    headers: {
      cookie: req.headers.get("cookie") ?? "",
      "content-type": req.headers.get("content-type") ?? "",
    },
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
    redirect: "manual",
  });

  const headers = new Headers(upstream.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");

  return new Response(upstream.body, { status: upstream.status, headers });
}

export { proxy as GET, proxy as POST };
