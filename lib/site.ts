/**
 * Resolve the public base URL for metadata/robots/sitemap.
 * Set NEXT_PUBLIC_SITE_URL in Vercel (https://yourdomain.com, no trailing slash).
 */
const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://ritekitchenbath.com";
export const siteUrl = raw.endsWith("/") ? raw.slice(0, -1) : raw;
