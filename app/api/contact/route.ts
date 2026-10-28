import { NextResponse } from "next/server";
import { Resend } from "resend";
import { TURNSTILE_SECRET_KEY } from "@/lib/env";
import { leadSchema, type LeadInput } from "@/lib/validators";

function clientIp(h: Headers) {
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    null
  );
}

function rateLimitIp(h: Headers) {
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

// In-memory limiter: 5 POSTs / hour / IP. On Vercel this is per isolate, not a global limit.
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 5;
const rateHits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (rateHits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    rateHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateHits.set(ip, recent);
  return false;
}

async function verifyTurnstile(secret: string, token: string, ip: string | null) {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const j = await r.json().catch(() => ({}));
  return { ok: !!j.success, codes: (j["error-codes"] as string[]) || [] };
}

async function sendEmail(lead: LeadInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.RESEND_TO_EMAIL;
  if (!apiKey || !from || !to) return false;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject: "New website lead from " + lead.name,
    replyTo: lead.email,
    text: [
      "Name: " + lead.name,
      "Email: " + lead.email,
      "Phone: " + (lead.phone || "—"),
      "",
      "Message:",
      lead.message,
    ].join("\n"),
  });
  if (error) throw new Error(error.message);
  return true;
}

// HubSpot Forms API: https://legacydocs.hubspot.com/docs/methods/forms/submit_form
async function sendToHubSpot(lead: LeadInput, req: Request, ip: string | null) {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formId = process.env.HUBSPOT_FORM_ID;
  if (!portalId || !formId) return false;

  const [firstname, ...rest] = lead.name.trim().split(/\s+/);
  const hutk = /(?:^|;\s*)hubspotutk=([^;]+)/.exec(req.headers.get("cookie") || "")?.[1];

  const r = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: [
          { name: "firstname", value: firstname },
          { name: "lastname", value: rest.join(" ") },
          { name: "email", value: lead.email },
          { name: "phone", value: lead.phone || "" },
          { name: "message", value: lead.message },
        ],
        context: {
          pageUri: req.headers.get("referer") || undefined,
          pageName: "Contact",
          ipAddress: ip || undefined,
          hutk,
        },
      }),
    }
  );
  if (!r.ok) throw new Error("HubSpot " + r.status + ": " + (await r.text()).slice(0, 300));
  return true;
}

export async function POST(req: Request) {
  const host = req.headers.get("host") || "unknown";
  const ip = clientIp(req.headers);

  try {
    // Production only. CAPTCHA_TEST_MODE does not bypass this.
    if (process.env.NODE_ENV === "production" && isRateLimited(rateLimitIp(req.headers))) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const fd = await req.formData();
    const honeypot = String(fd.get("website") || "");
    const token = String(fd.get("cf-turnstile-response") || "");

    // Bots that fill the hidden field get a fake success so they don't retry.
    if (honeypot.trim()) {
      console.warn("[contact] honeypot hit", { host, ip });
      return NextResponse.json({ success: true });
    }

    const parsed = leadSchema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone") || undefined,
      message: fd.get("message"),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid form data." },
        { status: 400 }
      );
    }
    const lead = parsed.data;

    const testMode =
      process.env.CAPTCHA_TEST_MODE === "pass" && process.env.NODE_ENV !== "production";
    const secret = TURNSTILE_SECRET_KEY;

    if (!testMode) {
      if (!secret) {
        if (process.env.NODE_ENV === "production") {
          console.error("[contact] TURNSTILE_SECRET_KEY missing", { host });
          return NextResponse.json({ error: "Form temporarily unavailable." }, { status: 500 });
        }
      } else {
        if (!token) {
          return NextResponse.json({ error: "Please complete the security check." }, { status: 400 });
        }
        const vr = await verifyTurnstile(secret, token, ip);
        if (!vr.ok) {
          console.warn("[contact] turnstile failed", { host, ip, codes: vr.codes });
          return NextResponse.json(
            { error: "Security check failed. Please try again.", errorCodes: vr.codes },
            { status: 400 }
          );
        }
      }
    }

    const results = await Promise.allSettled([sendEmail(lead), sendToHubSpot(lead, req, ip)]);
    const delivered = results.some((r) => r.status === "fulfilled" && r.value);
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error("[contact] " + (i === 0 ? "email" : "hubspot") + " failed", r.reason);
      }
    });

    if (!delivered && !testMode) {
      return NextResponse.json(
        { error: "We couldn't send your message. Please call us instead." },
        { status: 500 }
      );
    }

    return NextResponse.json({ provider: "turnstile", success: true });
  } catch (err) {
    console.error("[contact] server error", { host, ip, err });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
