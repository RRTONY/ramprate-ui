import { KUMBAYA_PAGE_HTML } from "./kumbaya-html";

// Served as a raw Route Handler (not page.tsx) so the prototype's own full
// <html>/<head>/<style>/<script> document renders exactly as designed,
// completely outside the site's root layout/header/footer - the same
// reason global-error.tsx is the one other page in this repo that renders
// its own document. The prototype's own <meta name="robots"
// content="noindex,nofollow,noarchive,..."> tags (already present in the
// stored HTML) are what keep this out of search results; nothing here
// needs to duplicate that via generateMetadata.
export async function GET() {
  return new Response(KUMBAYA_PAGE_HTML, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}
