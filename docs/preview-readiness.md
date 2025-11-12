# Preview Deployment Readiness Checklist

This document provides a checklist for verifying that a Preview deployment is ready for testing and production cutover.

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set (Preview value)
- [ ] `TURNSTILE_SECRET_KEY` is set (Preview value)
- [ ] `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set (Preview value, optional)
- [ ] `RECAPTCHA_SECRET_KEY` is set (Preview value, optional)
- [ ] `RESEND_API_KEY` is set
- [ ] `RESEND_FROM_EMAIL` is set
- [ ] `RESEND_TO_EMAIL` is set
- [ ] `NEXT_PUBLIC_SITE_URL` is set to Preview URL (optional)

### 2. Domain Allowlist Configuration

#### Cloudflare Turnstile
- [ ] Preview hostname added to Turnstile allowed websites
- [ ] Domain allowlist saved in Cloudflare dashboard

#### Google reCAPTCHA (if using)
- [ ] Preview hostname added to reCAPTCHA domain list
- [ ] Domain allowlist saved in Google reCAPTCHA console

### 3. Code Verification
- [ ] Contact form uses auto-render Turnstile (`.cf-turnstile` div with `data-sitekey`)
- [ ] Hidden input `cf-turnstile-response` is present
- [ ] Form submits via FormData POST to `/api/contact`
- [ ] Dev banner is visible in non-production environments

## Post-Deployment Verification

### 1. Debug Endpoint Check

Visit: `https://[preview-url]/api/captcha-debug`

**Expected Response**:
```json
{
  "env": "preview",
  "host": "feat-xxx-rite-kitchen-bath-site.vercel.app",
  "turnstileSiteKeyPresent": true,
  "recaptchaSiteKeyPresent": true,
  "timestamp": "2025-01-XX..."
}
```

**Verification**:
- [ ] `env` is `preview`
- [ ] `host` matches Preview URL
- [ ] `turnstileSiteKeyPresent` is `true`
- [ ] `recaptchaSiteKeyPresent` is `true` (if configured)

### 2. Contact Form Console Checks

Visit: `https://[preview-url]/contact`

Open browser console and run:

#### Check 1: Turnstile SDK Loaded
```javascript
typeof window.turnstile
```
**Expected**: `"object"`

#### Check 2: Turnstile Script Loaded
```javascript
Array.from(document.scripts).map(s => s.src).filter(u => u.includes('challenges.cloudflare.com')).length
```
**Expected**: `>= 1`

#### Check 3: Turnstile Iframe Rendered
```javascript
document.querySelectorAll('iframe[src*="challenges.cloudflare.com"]').length
```
**Expected**: `>= 1`

#### Check 4: Hidden Input Has Token
```javascript
document.querySelector('input[name="cf-turnstile-response"]')?.value?.length > 0
```
**Expected**: `true` (after ~1-2 seconds, once Turnstile challenge completes)

### 3. Visual Verification

- [ ] Exactly one Turnstile badge is visible on the form
- [ ] Dev banner shows: `Captcha: turnstile · SDK ready: true · token: XXXXX…`
- [ ] No reCAPTCHA scripts are loaded (check Network tab)
- [ ] Form fields are properly styled and functional

### 4. Form Submission Test

1. Fill out the contact form:
   - Name: Test User
   - Email: test@example.com
   - Message: Test message

2. Complete the Turnstile challenge

3. Submit the form

4. Check Network tab → `/api/contact` response:

**Expected Response**:
```json
{
  "provider": "turnstile",
  "success": true
}
```

**Verification**:
- [ ] Response status is `200`
- [ ] Response contains `"provider": "turnstile"`
- [ ] Response contains `"success": true`
- [ ] Redirect to `/thanks?src=contact` occurs

### 5. Server Logs Verification

Check Vercel function logs for:
- [ ] `[CAPTCHA] Turnstile verify success` log entry
- [ ] `[CAPTCHA] Form submitted successfully` log entry
- [ ] No error codes in logs

### 6. Email Verification

- [ ] Email is received at `RESEND_TO_EMAIL`
- [ ] Email contains correct form data
- [ ] Email subject is "New website lead from Test User"

## Troubleshooting

### Turnstile Not Loading
- Check that `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set in Vercel
- Verify Preview hostname is in Turnstile allowed websites
- Check browser console for script loading errors

### Token Not Generated
- Wait 1-2 seconds after page load for Turnstile to initialize
- Check that Turnstile iframe is visible
- Verify domain is in Turnstile allowed websites

### Verification Failing
- Check server logs for error codes
- Verify `TURNSTILE_SECRET_KEY` is set correctly
- Verify domain allowlist configuration

### Form Not Submitting
- Check browser console for JavaScript errors
- Verify FormData is being sent (check Network tab)
- Check that all required fields are filled

## Production Cutover Checklist

Before cutting over to production:

- [ ] All Preview tests pass
- [ ] Production environment variables are set in Vercel
- [ ] Production domains are added to Turnstile allowed websites
- [ ] Production domains are added to reCAPTCHA domain list (if using)
- [ ] `NEXT_PUBLIC_SITE_URL` is set to `https://ritekitchenbath.com`
- [ ] Production email addresses are configured
- [ ] Final smoke test on production domain

## Screenshots

Capture the following for PR documentation:
1. Dev banner on contact form (non-production)
2. Network tab showing `/api/contact` response
3. Browser console showing Turnstile SDK loaded
4. `/api/captcha-debug` response

