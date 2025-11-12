import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const host = req.headers.get("host") || "unknown";
  const env = process.env.VERCEL_ENV || process.env.NODE_ENV || "development";

  return NextResponse.json({
    env,
    host,
    turnstileSiteKeyPresent: !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    recaptchaSiteKeyPresent: !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    timestamp: new Date().toISOString(),
  });
}
