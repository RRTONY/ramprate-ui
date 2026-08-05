const UPSTREAM = "https://flow.tonygreenberg.com";

async function proxy(req: Request, { params }: { params: Promise<{ nextauth: string[] }> }) {
  const { nextauth } = await params;
  const target = new URL(`${UPSTREAM}/api/auth/${nextauth.join("/")}`);
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

  const location = headers.get("location");
  if (location?.startsWith(UPSTREAM)) {
    const rewritten = new URL(location);
    rewritten.protocol = new URL(req.url).protocol;
    rewritten.host = new URL(req.url).host;
    if (!rewritten.pathname.startsWith("/flow")) {
      rewritten.pathname = `/flow${rewritten.pathname}`;
    }
    headers.set("location", rewritten.toString());
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}

export { proxy as GET, proxy as POST };
