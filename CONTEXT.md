# Rite Kitchen & Bath — site handoff

Read this file first before changing anything. Status notes: [PLAN.md](./PLAN.md).

This is the public website for **Rite Kitchen & Bath** (cabinet refacing, refinishing, custom cabinetry, and vanities on Florida’s Gulf Coast). It is a small Next.js / TypeScript site on Vercel. Most edits are text, photos, or the homepage video.

Live site: https://ritekitchenbath.com  
Repo: `ritekitchenbath-hub/rite-kitchen-bath-site`

## How to ask an AI to change something

Be specific. Examples:

- “Swap the placeholder phone for the real 941 number in lib/business.tsx.”
- “Replace the homepage hero video with this new MP4.”
- “Add this photo to Recent Work, after the island shot, with this caption.”

Do **not** ask it to rebuild the site, add a CMS, add a blog, or add a test/agent framework unless you really want that.

---

## Where everyday content lives

### Phone, hours, company name, service-area lists

**File:** `lib/business.tsx`

Current phone (placeholder): **(941) 555-0148**  
Change `phone`, `phoneHref`, and `phoneE164` together so the click-to-call link stays correct.

Hours: Mon–Fri 9am–5pm · Sat by appointment (footer and JSON-LD).  
Primary areas: Bradenton, Sarasota, St. Petersburg, Parrish.

### Homepage / services / cities / FAQ

- Homepage story: `app/page.tsx`
- Hero headline: `components/VideoHero.tsx`
- Services: `lib/services.ts`
- City pages: `lib/areas.ts` → `/areas/[slug]`
- FAQ: `lib/faqs.ts`

CTA copy everywhere: **Free in-home consultation**.

### Photos

**Folder:** `public/images/gallery/`  
**Order/captions:** `public/images/gallery/gallery.json`

Only files listed in `gallery.json` appear. `kitchen-dark-shaker-range.webp` stays unpublished (open outlet boxes).

Hero video: `public/videos/hero.mp4`  
Poster: `public/images/hero.jpg`

---

## Contact form (current)

**UI:** `components/ContactForm.tsx`  
**API:** `app/api/contact/route.ts` (Turnstile → Resend + HubSpot → `/thanks?src=contact`)

Fields:

| Field | Required | Notes |
|-------|----------|--------|
| Name | yes | |
| Email | yes | Kept so HubSpot and reply-to email still work |
| Phone | no | Optional, to keep completion high |
| Project type | yes | Kitchen / Bath / Both / Other (large tap buttons) |
| Timeline | yes | ASAP / 1-3 months / Just researching |
| Note | no | Short, max 500 characters. Replaces the old long message box |

Project type and timeline are packed into HubSpot’s existing `message` property (see `formatLeadMessage` in `lib/validators.ts`). Do not add extra HubSpot form fields unless you change `lib/hubspot.ts` too.

---

## What not to touch (unless you are fixing a real bug)

- Turnstile / honeypot / rate-limit / testMode in `app/api/contact/route.ts`
- `lib/env.ts` and `next.config.js`
- `.github/workflows/e2e.yml`, `playwright.config.ts`, `.env.e2e`
- `pnpm-lock.yaml`

Do not add a blog, CMS, extra agent folders, or a second test framework.

---

## Deploy and local run

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm test:e2e     # contact form smoke test
```

Use **pnpm 9** and **Node 20+**. Real secrets go in Vercel or `.env.local` (git-ignored).  
Env cheat sheet: [docs/env-matrix.md](./docs/env-matrix.md).
