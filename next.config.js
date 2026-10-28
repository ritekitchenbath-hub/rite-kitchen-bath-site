/** @type {import('next').NextConfig} */
const hubspotScript = [
  "https://js.hs-scripts.com",
  "https://js-na1.hs-scripts.com",
  "https://js.hs-analytics.net",
  "https://js.hs-banner.com",
  "https://js.hsadspixel.net",
  "https://js.hscollectedforms.net",
  "https://js.hubspot.com",
  "https://js.hsforms.net",
].join(" ");

const hubspotConnect = [
  "https://*.hubspot.com",
  "https://*.hubapi.com",
  "https://*.hs-analytics.net",
  "https://forms.hubspot.com",
  "https://api.hubspot.com",
  "https://perf-na1.hscollectedforms.net",
].join(" ");

const hubspotImg = [
  "https://track.hubspot.com",
  "https://*.hubspot.com",
  "https://*.hsforms.com",
  "https://forms.hsforms.com",
  "https://perf-na1.hscollectedforms.net",
].join(" ");

const ContentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com " +
    hubspotScript,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com " +
    hubspotImg,
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com " +
    hubspotConnect,
  "frame-src https://challenges.cloudflare.com",
  "child-src https://challenges.cloudflare.com",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
