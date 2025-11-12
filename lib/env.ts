// lib/env.ts
// Environment selector for Turnstile (Preview vs Production)

export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_ENV_NAME === 'preview'
    ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY_PREVIEW
    : process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export const TURNSTILE_SECRET_KEY =
  process.env.NEXT_PUBLIC_ENV_NAME === 'preview'
    ? process.env.TURNSTILE_SECRET_KEY_PREVIEW
    : process.env.TURNSTILE_SECRET_KEY;
