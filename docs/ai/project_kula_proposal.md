# Kula proposal

Added 2026-10-29 at `/kula-proposal` following the standalone StarNews proposal pattern. Private, noindex, excluded from navigation and site search.

The original Kula-Proposal-V1_3.html is stored unchanged as `src/app/kula-proposal/private/proposal.txt`, outside public files. The MCP write tool autoformats .html, so the .txt suffix is intentional. The authenticated content route returns it as HTML; its SHA-256 is checked in `tests/kula-proposal-access.test.ts`.

Access is checked on the server against a password digest. Sessions are signed with the existing `PORTAL_AUTH_SECRET`, scoped to this route, and expire after eight hours. Missing signing configuration fails closed. Never put the password or signing secret in code or documentation.

The ConditionalChrome addition matches only the Kula route segment. Other website pages are unaffected. Desktop/mobile authenticated visual verification must be completed before publishing; automated credential submission was blocked by approval review in the initial session.
