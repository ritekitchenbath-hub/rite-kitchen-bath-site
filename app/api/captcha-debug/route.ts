// app/api/captcha-debug/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    url.host;

  const env =
    process.env.VERCEL_ENV ??
    (process.env.NODE_ENV === "production" ? "production" : "development");

  return NextResponse.json({
    ok: true,
    env,
    host,
    turnstileSiteKeyPresent: Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
    recaptchaSiteKeyPresent: Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
    providerDefault: "turnstile",
    timestamp: new Date().toISOString(),
  });
}
