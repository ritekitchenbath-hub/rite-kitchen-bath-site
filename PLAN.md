# Plan / status

## Just completed

Contact form lead-quality pass on branch `cursor/contact-lead-fields-cf42`.

- Added required **project type** and **timeline** as large mobile tap buttons.
- Replaced the long required message box with a short optional **note**.
- Form still posts to `/api/contact`. Turnstile, honeypot, rate limit, testMode, and `/thanks?src=contact` are unchanged.
- Resend email lists project type, timeline, and note as their own lines.
- HubSpot still uses the existing form fields only. Project type, timeline, and note are written into `message` so they show on the contact without new CRM properties.
- Email is still required (HubSpot form + Resend reply-to). Phone stays optional.

This branch also includes the owner copy pass from `cursor/owner-copy-updates-cf42`: placeholder phone, St. Petersburg titles, CTA wording, FAQ Pinellas Park, dead `hero.web.mp4` source removed.

## Current form fields

1. Name (required)
2. Email (required)
3. Phone (optional)
4. Project type — Kitchen / Bath / Both / Other (required)
5. Timeline — ASAP / 1-3 months / Just researching (required)
6. Note (optional, max 500 characters)

## Branch + commit

**Branch:** `cursor/contact-lead-fields-cf42`  
**Commit:** `da02eb8`

## Still open

- **Real phone number** — site still uses placeholder **(941) 555-0148** in `lib/business.tsx`. Swap `phone`, `phoneHref`, and `phoneE164` together.
- **Meta conversion setup** — not started. Thanks page fires GA `lead_contact_submit` only if `NEXT_PUBLIC_GA_ID` is set (`components/TrackLead.tsx`). No Meta Pixel, no HubSpot → Meta offline conversion, no dedicated conversion event for ads. Next step is a product decision: browser pixel on `/thanks`, HubSpot native Meta integration, or both.
- **HubSpot custom properties** (optional) — if you later want Project type / Timeline as real HubSpot fields, create the properties, add them to the HubSpot form, then send them from `lib/hubspot.ts`. Until then, keep them in `message`.
- **`.gitignore` env tightening** — lives on `cursor/gitignore-env-files-cf42` (`/.env*` except `.env.e2e`). Not merged into this branch.
