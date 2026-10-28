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
| `HUBSPOT_PORTAL_ID` | Config | Production, Preview | HubSpot Hub ID (digits only). Optional. Enables tracking script + CRM submit. |
| `HUBSPOT_FORM_ID` | Config | Production, Preview | HubSpot form GUID. Optional. Contact POSTs to this form via the Forms API. |
| `NEXT_PUBLIC_GA_ID` | Config | Production | Google Analytics 4 measurement ID |

Leads are delivered to email (Resend) and HubSpot in parallel. A submission succeeds if at least one of them is configured and accepts it. If HubSpot IDs are missing, the site still emails via Resend and does not load tracking.

Do not invent HubSpot IDs. Create the form in HubSpot, then paste the real values into Vercel.

## HubSpot setup (click by click)

The website already has a contact form. Do **not** paste HubSpot's embed snippet onto the site. We submit through HubSpot's Forms API, and (once `HUBSPOT_PORTAL_ID` is set) load HubSpot's tracking script so the `hubspotutk` cookie can stitch the browsing session to the contact.

### A. Hub ID (this becomes `HUBSPOT_PORTAL_ID`)

1. Sign in at [https://app.hubspot.com](https://app.hubspot.com).
2. Click the **account name** in the top-right.
3. The **Hub ID** is the number under the account name. Copy digits only (example shape: `12345678`).
4. Alternate: open **Settings** (gear) → look at the URL. It contains `/settings/<Hub ID>/`.

### B. Allow the live domain for tracking

Submissions from domains HubSpot does not know can be marked as spam.

1. Settings (gear) → **Tracking & Analytics** → **Tracking Code**.
2. Add both `ritekitchenbath.com` and `www.ritekitchenbath.com`.
3. Save.

### C. Contact property for the message body

HubSpot ships First name, Last name, Email, and Phone. It does **not** always ship a `message` property.

1. Settings (gear) → **Data Management** → **Properties**.
2. Object: **Contact**. Search for `message`.
3. If it is missing: **Create property**.
   - Label: `Message`
   - Internal name: `message` (must be exactly `message`, lowercase)
   - Field type: **Multi-line text**
   - Group: Contact information
4. Create.

### D. Create the form (this becomes `HUBSPOT_FORM_ID`)

1. Top nav: **Marketing** → **Forms**. If you see **More** instead of Marketing, click **More** → **Marketing** → **Forms**.
2. Top right: **Create form**.
3. Choose **Form Editor** → **Next**.
4. **Start from blank**.
5. Name it `Website contact`.
6. Add these fields. Internal names must match exactly:

   | Field on the form | Internal name | Required on the form? |
   |-------------------|---------------|------------------------|
   | First name | `firstname` | Yes |
   | Last name | `lastname` | No (single-word names reuse the first name) |
   | Email | `email` | Yes |
   | Phone number | `phone` | No |
   | Message | `message` | Yes |

7. Top right: **Review and update** → **Update** (publish).
8. Click **Get embed code**.
9. In the snippet, copy:
   - `portalId` / `data-portal-id` → `HUBSPOT_PORTAL_ID` (same Hub ID from step A)
   - `formId` / `data-form-id` → `HUBSPOT_FORM_ID` (GUID with hyphens)
10. Close the embed dialog. Do **not** paste that snippet into the website.

### E. Paste IDs in Vercel, then redeploy

1. Open [https://vercel.com](https://vercel.com) → project **rite-kitchen-bath-site**.
2. **Settings** → **Environment Variables**.
3. **Add**:
   - Key: `HUBSPOT_PORTAL_ID`
   - Value: the Hub ID digits
   - Environments: **Production** and **Preview**
   - Type: **Config** (plain). Not Secret. This value is public in the tracking script URL.
4. **Add**:
   - Key: `HUBSPOT_FORM_ID`
   - Value: the form GUID
   - Environments: **Production** and **Preview**
   - Type: **Config** is fine (server-only).
5. **Deployments** → latest Production → **⋯** → **Redeploy** → Redeploy.
   A rebuild is required. Saving the variables alone does not update the live tracking script.

### F. Prove it worked

1. Open `https://www.ritekitchenbath.com`, DevTools → **Network**, reload.
2. You should see `{Hub ID}.js` from `js.hs-scripts.com` (200 or 304).
3. Submit a test lead from `/contact`.
4. HubSpot → **Contacts**: the test person appears.
5. The Resend/Gmail lead email should still arrive as before.

If HubSpot is misconfigured, the form still succeeds through email. Check Vercel → Deployment → **Functions** logs for a line starting `[contact] hubspot failed`.

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
