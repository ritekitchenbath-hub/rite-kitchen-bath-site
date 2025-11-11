## Rite Kitchen & Bath — Website (Next.js + TypeScript + Tailwind)

Preview seed for feat/final-deployment 11/11/2025 09:44:10

Redeploy 11/11/2025 09:48:31

---

## CAPTCHA Environment Variables

### Captcha Env Matrix

| ENV        | HOST EXAMPLE                                       | TURNSTILE SITE KEY        | RECAPTCHA SITE KEY        |
| ---------- | -------------------------------------------------- | ------------------------- | ------------------------- |
| Development| localhost:3000 / 127.0.0.1                         | dev_turnstile_sitekey     | dev_recaptcha_sitekey     |
| Preview    | feat-xxx-rite-kitchen-bath-site.vercel.app         | preview_turnstile_sitekey | preview_recaptcha_sitekey |
| Prod       | ritekitchenbath.com / www.ritekitchenbath.com       | prod_turnstile_sitekey    | prod_recaptcha_sitekey    |

### Required Environment Variables

**Client-side (NEXT_PUBLIC_*)**:
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` - Turnstile site key (public)
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - reCAPTCHA site key (public, fallback)

**Server-side**:
- `TURNSTILE_SECRET_KEY` - Turnstile secret key (private)
- `RECAPTCHA_SECRET_KEY` - reCAPTCHA secret key (private, fallback)

**Email**:
- `RESEND_API_KEY` - Resend API key
- `RESEND_FROM_EMAIL` - Sender email address
- `RESEND_TO_EMAIL` - Recipient email address

### Domain Configuration

See [docs/captcha-hosts.md](./docs/captcha-hosts.md) for domain allowlist configuration.

**Important**: Each environment (Development, Preview, Production) requires domain allowlist configuration in:
- Cloudflare Turnstile dashboard (allowed websites)
- Google reCAPTCHA console (domain list)