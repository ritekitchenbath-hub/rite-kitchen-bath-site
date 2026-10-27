# Rite Kitchen & Bath — Website

Next.js (App Router) + TypeScript + Tailwind, deployed on Vercel. Use **pnpm 9** and **Node 20+**.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm test:e2e     # Playwright, uses .env.e2e
```

- Business details (phone, service areas, hours) live in `lib/business.ts`.
- City landing pages are generated from `lib/areas.ts` at `/areas/[slug]`.
- Gallery images and captions: `public/images/gallery/` + `gallery.json`.
- Contact form posts to `app/api/contact/route.ts` (Turnstile → Resend email + HubSpot).

Environment variables and secret rotation: see [docs/env-matrix.md](./docs/env-matrix.md).
