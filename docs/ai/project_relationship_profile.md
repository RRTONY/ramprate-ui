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
- City is a plain text box. No dropdown, because people can be from any city. In the Group D preview, time zone stays optional and the picker is closed until “Not right? Change” is pressed.
- If time zone is skipped, it is worked out from the city list. If the city is not in the list, the visitor's device time zone is used and the email says so ("from their device, to confirm").
- Every submission is checked again on the server, then emailed to `admin@ramprate.com` and `business@ramprate.com` as two separate sends. The visitor sees success if at least one send worked. A failure in both returns an error so the person can retry.
- Spam: a hidden `website_url` field (bots fill it, people do not), a 60,000 character body cap, and a best-effort limit of 5 submissions per IP per 10 minutes.
- Prefill: a link ending `#p-<token>` fills known answers. The token is base64url of a JSON object keyed by the field keys in the fields file. Only known keys with valid values are used.
- Not stored anywhere except email. No ClickUp task or CRM record is created yet.

## Approved onboarding fixes (2026-10-29)

- Draft storage: `src/lib/relationship-profile-draft.ts` uses the versioned localStorage key
  `ramprate.relationship-profile.draft.v1`. Save is debounced 300ms and flushed on pagehide.
  Restore preserves partial input and the step, never consent or `website_url`. All storage
  access is guarded. Clear on successful submission or after seven days of inactivity.
  Stored `expiresAt` is checked on load; expired drafts and legacy drafts without expiry are
  deleted. An open-tab timer also removes an idle draft and prevents pagehide from reviving it. Drafts are tied to the prefill link: refresh
  restores edited answers, while a different prefill link starts fresh at the first step.
- Shared validation rejects end times at or before start, unsafe scheduling-link schemes,
  malformed email domains/local parts, and invalid or all-zero phone numbers. Scheduling
  links gain HTTPS when missing. Both email fields are trimmed and support plus-addressing.
  The primary phone label asks for a country code; `channelHandle` remains free text.
- Review keeps escaped full text, with three-line previews and Show more/Show less for overflow.
  Privacy and Terms links sit outside the checkbox labels so following a link never changes consent.
- Honeypot stays off-screen, aria-hidden, untabbable and autocomplete-off, without a visible label.
- Error descriptions include chip buttons and consent; blocked submission focuses consent if it
  is the first remaining error. Existing Continue focus behavior remains in place.
- Group D preview: `RelationshipTimeZonePicker.tsx` shows the city-derived zone and current
  local time first. “Not right? Change” opens the 13 requested common choices, followed by
  country/city/zone search capped at eight results. No new dependency. The field is still `tzPick`.
- Manual choices win over city edits, and legacy IDs restore and submit unchanged. Only labels
  modernize Kolkata, Ho Chi Minh City, Yangon and Kyiv. An unknown city keeps the existing device
  fallback, visibly marked “Not sure, or skip”. Choosing skip clears only the manual override.
- Search country metadata comes from IANA tzdata 2025b zone.tab/iso3166.tab (public domain).
  The browser supplies the full supported zone inventory; Antarctic stations and small territories
  are omitted from visible choices, without invalidating stored values. Offsets and local times
  use Intl and the current date, refreshed each minute, with winter/summer regression tests.
- Both common choices and search work with arrow keys and Enter. Search results stay in the page,
  with a scroll area sized to the visual viewport and scrolled into view when the keyboard opens.
  Physical iOS/Android keyboard and spoken screen-reader testing still need device verification.
- Endpoint, payload keys, recipients, spam-trap field name and backend behavior are unchanged.
  Test submission with networking intercepted and `ZZ TEST` data only. Never send test email
  or create real records as part of this change.

## Group D preview QA

- 63 unit tests pass, including winter/summer offsets, search by city/country/zone,
  result cap, omitted stations/territories, and legacy stored IDs.
- 13 browser scenarios pass on preview 91. Las Vegas resolves automatically; manual Eastern
  survives a city edit; search supports keyboard selection; legacy Asia/Calcutta restores
  across refresh, displays Kolkata, and submits its original ID unchanged.
- Axe WCAG A/AA checks report no violations in the closed picker, common list, or search results.
  Layout and 44px targets pass at 375px, including a reduced 400px viewport for keyboard simulation.
- One ZZ TEST preview submission was intercepted and answered locally. No real endpoint call,
  email, or record was created. Physical phone keyboards and spoken screen readers were not tested.

## Open follow-ups

- Create a ClickUp task per submission (same pattern as `src/app/api/champions-intake/route.ts`).
- Decide whether the page should ever be linked from the site.
- The visibility choice for personal details is captured and emailed. Nothing enforces it yet.
