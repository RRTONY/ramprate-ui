# Relationship Profile form (/onboarding)

Built 2026-10-23 for Satya (Sam Patnayak). A universal onboarding form for prospects, clients, partners, advisors and strategic relationships. Tony asked for one lightweight way to capture how each important person likes to work.

## Where things live

| Piece                                         | File                                                    |
| --------------------------------------------- | ------------------------------------------------------- |
| Page (noindex, not in nav, search or sitemap) | `src/app/onboarding/page.tsx`                           |
| Form (client component, 6 steps)              | `src/components/onboarding/RelationshipProfileForm.tsx` |
| Fields, validation, email text                | `src/lib/relationship-profile-fields.ts`                |
| City to time zone list, zone menus            | `src/lib/relationship-profile-cities.ts`                |
| Submit endpoint                               | `src/app/api/relationship-profile/route.ts`             |
| Tests                                         | `tests/relationship-profile.test.ts`                    |

## Behaviour to keep

- Required (starred): full name, company, work email, phone or messaging number, how we are connected, city, and the consent box. Everything else is optional.
- City is a plain text box. No dropdown, because people can be from any city. Time zone is an optional menu ordered North America, then Europe, then everywhere else.
- If time zone is skipped, it is worked out from the city list. If the city is not in the list, the visitor's device time zone is used and the email says so ("from their device, to confirm").
- Every submission is checked again on the server, then emailed to `admin@ramprate.com` and `business@ramprate.com` as two separate sends. The visitor sees success if at least one send worked. A failure in both returns an error so the person can retry.
- Spam: a hidden `website_url` field (bots fill it, people do not), a 60,000 character body cap, and a best-effort limit of 5 submissions per IP per 10 minutes.
- Prefill: a link ending `#p-<token>` fills known answers. The token is base64url of a JSON object keyed by the field keys in the fields file. Only known keys with valid values are used.
- Not stored anywhere except email. No ClickUp task or CRM record is created yet.

## Open follow-ups

- Create a ClickUp task per submission (same pattern as `src/app/api/champions-intake/route.ts`).
- Decide whether the page should ever be linked from the site.
- The visibility choice for personal details is captured and emailed. Nothing enforces it yet.
