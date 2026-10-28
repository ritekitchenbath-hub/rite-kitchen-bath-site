# Rite Kitchen & Bath — site handoff

Read this file first before changing anything.

This is the public website for **Rite Kitchen & Bath** (cabinet refacing, refinishing, custom cabinetry, and vanities on Florida’s Gulf Coast). It is a small Next.js / TypeScript site on Vercel. Most edits are text, photos, or the homepage video.

Live site: https://ritekitchenbath.com  
Repo: `ritekitchenbath-hub/rite-kitchen-bath-site`

## How to ask an AI to change something

Be specific. Examples:

- “Change the phone number everywhere to (941) 555-0100.”
- “Replace the homepage hero video with this new MP4.”
- “Add this photo to Recent Work, after the island shot, with this caption.”
- “Update the Bradenton page intro to mention Lakewood Ranch.”

Do **not** ask it to rebuild the site, add a CMS, add a blog, or add a test/agent framework unless you really want that.

---

## Where everyday content lives

### Phone, hours, company name, service-area lists

**File:** `lib/business.tsx`

Current phone: **(478) 334-2038**  
That one file feeds the header, footer, homepage, contact page, thanks page, mobile “Call” bar, and Google structured data. Change `phone`, `phoneHref`, and `phoneE164` together so the click-to-call link stays correct.

Hours, tagline, and the “also serving” towns are in the same file.

### Homepage headline and story copy

**File:** `app/page.tsx` (homepage layout and most of the words)  
**File:** `components/VideoHero.tsx` (the big headline over the video: “Cabinet Refacing & Custom Cabinetry—Done Rite.”)

### Services

**File:** `lib/services.ts`  
Used on the homepage cards, `/services`, and the footer. Each service has an `id` (used in URLs like `/services#cabinet-refacing`). Do not rename an `id` unless you also want the old link to break.

### City pages (Bradenton, Sarasota, St. Petersburg, Parrish)

**File:** `lib/areas.ts`  
Each city is a block with `slug`, `name`, `intro`, `body`, `neighborhoods`, and `nearby`. The site builds `/areas/bradenton` (and the others) from this list. Add or edit cities here, not by creating new page files.

### FAQ

**File:** `lib/faqs.ts`  
Questions and answers for `/faq`.

### Photos (gallery / Recent Work)

**Folder:** `public/images/gallery/`  
**Captions and order:** `public/images/gallery/gallery.json`

Only files listed in `gallery.json` appear on the site. Extra images in the folder are kept off the page on purpose.

Right now the gallery is six photos of a **dark shaker kitchen**. There is a seventh file, `kitchen-dark-shaker-range.webp`, that is **not** listed — leave it out unless you decide the outlet box in that shot is acceptable.

To add a photo:

1. Put a `.webp` (or `.jpg` / `.png`) in `public/images/gallery/`.
2. Add a row to `gallery.json` with `file`, `caption`, and `alt`.
3. Order in that JSON file is the order on the page.

Other images:

| File | Used as |
|------|---------|
| `public/images/hero.jpg` | Still frame behind / before the homepage video |
| `public/images/install-soft-close-hinge.webp` | Homepage “refacing vs replacing” photo |
| `public/og.jpg` | Image when the site is shared on Facebook / iMessage / etc. |
| `app/icon.svg` | Browser tab icon |

### Homepage video

**File:** `public/videos/hero.mp4`

Replace this file with a new MP4 of the same name (muted, looping, no need for sound). Keep a matching still at `public/images/hero.jpg`.

There is an extra unused path in `components/VideoHero.tsx` pointing at `/videos/hero.web.mp4`. That file does **not** exist. Ignore it unless you are cleaning that line up.

---

## How the contact form works (plain English)

1. Visitor fills out **Name, Email, optional Phone, Message** on `/contact`.
2. Cloudflare Turnstile (the “I’m not a robot” checkbox) runs in the browser.
3. The form posts to `app/api/contact/route.ts`.
4. The server checks the message, ignores obvious spam (hidden “website” field), then tries to:
   - email the lead through **Resend**, and
   - send the same lead to **HubSpot**.
5. If at least one of those works (or we are in a local test), the visitor is sent to `/thanks`.

You do **not** need to edit the form to change phone number, photos, or copy.

Secrets (Turnstile, Resend, HubSpot, Google Analytics) live in **Vercel → Project → Environment Variables**, not in this repo. The cheat sheet is `docs/env-matrix.md`.

---

## What not to touch (unless you are fixing a real bug)

Leave these alone for a normal text/photo/video change:

- `app/api/contact/route.ts` — lead delivery
- `components/ContactForm.tsx` — captcha + submit
- `lib/hubspot.ts`, `lib/env.ts`, `lib/validators.ts`
- `next.config.js` — security headers / Cloudflare / HubSpot / Analytics allow-lists
- `app/layout.tsx` — site-wide header/footer and tracking scripts
- `.github/workflows/e2e.yml`, `tests/`, `playwright.config.ts`, `.env.e2e` — existing form smoke test
- `pnpm-lock.yaml`

Do not add: a blog, WordPress, a page builder, extra “agent” or “experiments” folders, or a second test framework.

---

## Pages on the site

| URL | What it is |
|-----|------------|
| `/` | Home |
| `/services` | Service details |
| `/areas` | Area index |
| `/areas/bradenton` (and sarasota, st-petersburg, parrish) | City pages |
| `/gallery` | Full photo gallery |
| `/faq` | FAQ |
| `/contact` | Form |
| `/thanks` | After a successful submit (kept out of Google) |

---

## Deploy and local run

Deploy is automatic on Vercel when `main` updates.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm test:e2e     # optional; contact form smoke test
```

Use **pnpm 9** and **Node 20+**. Copy real secrets into `.env.local` (git-ignored) for local work. `.env.e2e` is committed on purpose and only has Cloudflare’s public test keys.

More on env vars: [docs/env-matrix.md](./docs/env-matrix.md).
