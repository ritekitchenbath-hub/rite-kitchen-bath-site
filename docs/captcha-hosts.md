# CAPTCHA Domain Allowlists

This document tracks which domains are authorized for Turnstile and reCAPTCHA verification.

## Domain Lists

### Development
- **localhost:3000** (local development)
- **127.0.0.1** (local development)

### Preview (Vercel)
- **feat-xxx-rite-kitchen-bath-site.vercel.app** (Preview deployments)
- **preview-xxx-rite-kitchen-bath-site.vercel.app** (Preview deployments)
- _Update with actual Preview hostname after first deployment_

### Production
- **ritekitchenbath.com**
- **www.ritekitchenbath.com**

---

## Configuration Checklist

### Turnstile (Cloudflare)

- [ ] **Development**: Add `localhost:3000` and `127.0.0.1` to allowed domains
- [ ] **Preview**: Add Preview hostname (e.g., `feat-xxx-rite-kitchen-bath-site.vercel.app`) to allowed domains
- [ ] **Production**: Add `ritekitchenbath.com` and `www.ritekitchenbath.com` to allowed domains

**Location**: Cloudflare Dashboard → Turnstile → Site Key Settings → Allowed Websites

### reCAPTCHA (Google)

- [ ] **Development**: Add `localhost` and `127.0.0.1` to domain list
- [ ] **Preview**: Add Preview hostname (e.g., `feat-xxx-rite-kitchen-bath-site.vercel.app`) to domain list
- [ ] **Production**: Add `ritekitchenbath.com` and `www.ritekitchenbath.com` to domain list

**Location**: Google reCAPTCHA Admin Console → Site Settings → Domains

---

## Runbook: Adding Preview Hostname

When a new Preview deployment is created:

1. **Get the Preview URL** from Vercel deployment page (e.g., `feat-final-deployment-abc123.vercel.app`)

2. **Add to Turnstile**:
   - Go to Cloudflare Dashboard → Turnstile
   - Select your site key
   - Under "Allowed Websites", add the Preview hostname
   - Save changes

3. **Add to reCAPTCHA** (if using reCAPTCHA as fallback):
   - Go to Google reCAPTCHA Admin Console
   - Select your site key
   - Under "Domains", add the Preview hostname
   - Save changes

4. **Update this file** with the actual Preview hostname in the checklist above

5. **Test**: Submit a form on the Preview URL to verify both providers work

---

## Current Preview Hostname

_To be updated after first Preview deployment:_

**Preview Hostname**: `feat-final-deployment-[hash].vercel.app`

**Added to Turnstile**: [ ] Yes [ ] No

**Added to reCAPTCHA**: [ ] Yes [ ] No

**Date Added**: _[Date]_

**Tested**: [ ] Yes [ ] No

