# ramprate.com SSL error, November 2026

**Found 2026-11-17.** Visitors got an expired-certificate warning on `https://ramprate.com`
(`www.ramprate.com` was fine). The MCP server failed to connect from Claude Code with
`CERT_HAS_EXPIRED` for the same reason.

## Where DNS really lives

- Registrar: **GoDaddy**. Name servers: **Hostinger** (`ns1/ns2.dns-parking.com`).
- Netlify's domain panel shows "Netlify DNS" with a green check, but the registrar does **not**
  point at Netlify's name servers, so the Netlify DNS zone is not used. Edit records in
  **Hostinger**, not Netlify.
- Email (Google Workspace MX), SPF and Google site-verification TXT records are in the Hostinger
  zone. Don't lose them if the name servers are ever moved to Netlify.

## What broke

The Hostinger zone was changed on 2026-11-15 (SOA serial `2026111501`). The root domain's records
were switched from Netlify (`75.2.60.5`) to Hostinger's servers (`88.222.243.254`,
`147.79.69.154`, plus two IPv6 AAAA records). Those servers present an old Let's Encrypt
certificate that expired 2026-06-22 and redirect to `legacy.ramprate.com`. This was most likely a
side effect of setting up `legacy.ramprate.com` on Hostinger. `www` still pointed at
`ramprate.netlify.app`, so it kept working.

The Netlify certificate itself was fine (valid until 2027-01-03). "Renew certificate" in Netlify
does not fix this.

## Fix

The Hostinger zone had **two** `ALIAS @` records: `apex-loadbalancer.netlify.com` (correct) and
`ramprate.com.cdn.hstgr.net` (Hostinger's CDN, the cause). Resolvers got a mix of both. Fix:
delete the `ramprate.com.cdn.hstgr.net` ALIAS only, keep the Netlify one, leave `www`, `legacy`,
MX and TXT untouched, and turn off Hostinger's CDN for ramprate.com (hPanel, Performance → CDN)
so it isn't re-added.

## How to check

```
dig +short A ramprate.com @ns1.dns-parking.com      # must be 75.2.60.5 only
dig +short AAAA ramprate.com @ns1.dns-parking.com   # must be empty
echo | openssl s_client -connect ramprate.com:443 -servername ramprate.com 2>/dev/null | openssl x509 -noout -enddate
```

Your own computer may keep the old answer for a while after the fix. To see what the name servers
really say, query them directly (as above).
