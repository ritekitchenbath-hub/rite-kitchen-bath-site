# Environment Variables Matrix

This document tracks all environment variables required for the Rite Kitchen & Bath website across different environments.

## Environment Matrix

| Variable | Client/Server | Dev | Preview | Prod | Service/Usage |
|----------|---------------|-----|---------|------|---------------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Client | `dev_turnstile_sitekey` | `preview_turnstile_sitekey` | `prod_turnstile_sitekey` | Cloudflare Turnstile (public site key) |
| `TURNSTILE_SECRET_KEY` | Server | `dev_turnstile_secret` | `preview_turnstile_secret` | `prod_turnstile_secret` | Cloudflare Turnstile (private secret key) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Client | `dev_recaptcha_sitekey` | `preview_recaptcha_sitekey` | `prod_recaptcha_sitekey` | Google reCAPTCHA (public site key, fallback) |
| `RECAPTCHA_SECRET_KEY` | Server | `dev_recaptcha_secret` | `preview_recaptcha_secret` | `prod_recaptcha_secret` | Google reCAPTCHA (private secret key, fallback) |
| `RESEND_API_KEY` | Server | `re_...` | `re_...` | `re_...` | Resend (email service) |
| `RESEND_FROM_EMAIL` | Server | `noreply@...` | `noreply@...` | `noreply@ritekitchenbath.com` | Resend (sender email) |
| `RESEND_TO_EMAIL` | Server | `test@...` | `test@...` | `info@ritekitchenbath.com` | Resend (recipient email) |
| `NEXT_PUBLIC_SITE_URL` | Client | `http://localhost:3000` | `https://feat-xxx.vercel.app` | `https://ritekitchenbath.com` | Site metadata/SEO |
| `NEXT_PUBLIC_GA_ID` | Client | `G-XXXXXX` | `G-XXXXXX` | `G-XXXXXX` | Google Analytics |
| `CAPTCHA_TEST_MODE` | Server | `pass` (E2E only) | - | - | E2E test mode (skip verification) |

## Environment-Specific Configuration

### Development
- **Host**: `localhost:3000`, `127.0.0.1`
- **Turnstile**: Uses dev site key (must allow `localhost:3000` and `127.0.0.1`)
- **reCAPTCHA**: Uses dev site key (must allow `localhost` and `127.0.0.1`)
- **Email**: Uses test recipient (optional, can be same as prod for testing)

### Preview (Vercel)
- **Host**: `feat-xxx-rite-kitchen-bath-site.vercel.app` (varies per branch)
- **Turnstile**: Uses preview site key (must allow Preview hostname)
- **reCAPTCHA**: Uses preview site key (must allow Preview hostname)
- **Email**: Uses test recipient (optional)

### Production
- **Host**: `ritekitchenbath.com`, `www.ritekitchenbath.com`
- **Turnstile**: Uses production site key (must allow production domains)
- **reCAPTCHA**: Uses production site key (must allow production domains)
- **Email**: Uses production recipient

## Domain Allowlist Requirements

### Cloudflare Turnstile
Each environment requires domain allowlist configuration:
- **Dev**: `localhost:3000`, `127.0.0.1`
- **Preview**: `feat-xxx-rite-kitchen-bath-site.vercel.app` (per deployment)
- **Prod**: `ritekitchenbath.com`, `www.ritekitchenbath.com`

**Location**: Cloudflare Dashboard → Turnstile → Site Key Settings → Allowed Websites

### Google reCAPTCHA
Each environment requires domain allowlist configuration:
- **Dev**: `localhost`, `127.0.0.1`
- **Preview**: `feat-xxx-rite-kitchen-bath-site.vercel.app` (per deployment)
- **Prod**: `ritekitchenbath.com`, `www.ritekitchenbath.com`

**Location**: Google reCAPTCHA Admin Console → Site Settings → Domains

## Test Mode (E2E Only)

When `CAPTCHA_TEST_MODE=pass` and `NODE_ENV !== "production"`:
- Turnstile verification is skipped
- Form submissions proceed directly to email send
- Used only for E2E testing in CI/local development

## Required for Production

**Minimum required variables for production deployment**:
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (PROD)
- `TURNSTILE_SECRET_KEY` (PROD)
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_TO_EMAIL`
- `NEXT_PUBLIC_SITE_URL=https://ritekitchenbath.com`

**Optional (fallback)**:
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (PROD)
- `RECAPTCHA_SECRET_KEY` (PROD)

## Verification

Use `/api/captcha-debug` endpoint to verify environment variables are present:
```bash
curl https://your-domain.com/api/captcha-debug
```

Expected response:
```json
{
  "env": "production",
  "host": "ritekitchenbath.com",
  "turnstileSiteKeyPresent": true,
  "recaptchaSiteKeyPresent": true,
  "timestamp": "2025-01-XX..."
}
```

