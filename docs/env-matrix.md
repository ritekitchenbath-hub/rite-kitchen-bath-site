# Environment Variables

Set these in Vercel → Project → Settings → Environment Variables.

**Type** column: store anything marked *Secret* as Vercel's **Secret** type (write-only). Everything else can be **Config**. `NEXT_PUBLIC_*` values are shipped to the browser, so never put a credential in one.

| Variable | Type | Environments | Purpose |
|----------|------|--------------|---------|
| `NEXT_PUBLIC_ENV_NAME` | Config | Production = `production`, Preview = `preview` | Picks Turnstile keys; hides the dev banner in prod |
| `NEXT_PUBLIC_SITE_URL` | Config | Production (`https://ritekitchenbath.com`) | Canonical URLs, sitemap, OG tags |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Config | Production | Cloudflare Turnstile widget (prod widget) |
| `TURNSTILE_SECRET_KEY` | **Secret** | Production | Turnstile server verification (prod widget) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY_PREVIEW` | Config | Preview | Turnstile widget for `*.vercel.app` previews |
| `TURNSTILE_SECRET_KEY_PREVIEW` | **Secret** | Preview | Turnstile verification for previews |
| `RESEND_API_KEY` | **Secret** | Production, Preview | Lead notification email |
| `RESEND_FROM_EMAIL` | Config | Production, Preview | Sender, must be on a Resend-verified domain |
| `RESEND_TO_EMAIL` | Config | Production, Preview | Where lead emails go |
| `HUBSPOT_PORTAL_ID` | Config | Production, Preview | HubSpot account ID (optional, enables CRM sync) |
| `HUBSPOT_FORM_ID` | Config | Production, Preview | HubSpot form GUID that leads are submitted to |
| `NEXT_PUBLIC_GA_ID` | Config | Production | Google Analytics 4 measurement ID |

Leads are delivered to email (Resend) and HubSpot in parallel. A submission succeeds if at least one of them is configured and accepts it.

## HubSpot setup

1. HubSpot → Marketing → Forms → create a form with fields `firstname`, `lastname`, `email`, `phone`, `message`.
2. Copy the portal ID and form GUID from the form's embed code into `HUBSPOT_PORTAL_ID` / `HUBSPOT_FORM_ID`.
3. Redeploy and submit a test lead; it should appear under Contacts.

## Turnstile allowed hostnames

Cloudflare Dashboard → Turnstile → widget → Hostnames:

- Production widget: `ritekitchenbath.com`, `www.ritekitchenbath.com`
- Preview widget: `vercel.app` (covers every preview URL), `localhost`

## Rotating a secret

1. Generate a new value at the provider (Resend → API Keys; Cloudflare → Turnstile → widget → Rotate secret key).
2. In Vercel, edit the Secret and paste the new value (Config variables must be deleted and re-added as Secret).
3. Redeploy, send a test lead, then revoke the old value at the provider.

## Local / E2E

`.env.e2e` holds Cloudflare's public test keys and `CAPTCHA_TEST_MODE=pass`, which skips verification outside production. For local dev, copy real values into `.env.local` (git-ignored).
