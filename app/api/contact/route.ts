import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = leadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }
    const { name, email, phone, message, turnstileToken, recaptchaToken, honeypot } = parsed.data;

    // Spam protection priority ladder: Turnstile → reCAPTCHA → Honeypot
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    const forwardedFor = req.headers.get("x-forwarded-for") || "";
    const remoteip = forwardedFor.split(",")[0]?.trim(); // optional for verification

    type CheckResult = { ok: boolean; reason: string; payload?: any };

    async function verifyTurnstile(token?: string): Promise<CheckResult> {
      if (!turnstileSecret) return { ok: false, reason: "turnstile-not-configured" };
      if (!token) return { ok: false, reason: "turnstile-missing-token" };

      const body = new URLSearchParams({ secret: turnstileSecret, response: token });
      if (remoteip) body.set("remoteip", remoteip);

      const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      const j = await resp.json().catch(() => ({}));
      const ok = !!j.success;
      if (!ok) console.warn("[Turnstile verify fail]", { status: resp.status, remoteip, j });
      return { ok, reason: ok ? "turnstile-pass" : "turnstile-fail", payload: j };
    }

    async function verifyRecaptcha(token?: string): Promise<CheckResult> {
      if (!recaptchaSecret || !recaptchaSiteKey) return { ok: false, reason: "recaptcha-not-configured" };
      if (!token) return { ok: false, reason: "recaptcha-missing-token" };

      const body = new URLSearchParams({ secret: recaptchaSecret, response: token });
      if (remoteip) body.set("remoteip", remoteip);

      const resp = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      const j = await resp.json().catch(() => ({}));
      const ok = !!j.success;
      if (!ok) console.warn("[reCAPTCHA verify fail]", { status: resp.status, remoteip, j });
      return { ok, reason: ok ? "recaptcha-pass" : "recaptcha-fail", payload: j };
    }

    let passed = false;
    const reasons: string[] = [];

    // 1) Try Turnstile first (do not hard-fail if missing/invalid yet)
    const t = await verifyTurnstile(turnstileToken);
    reasons.push(t.reason);
    if (t.ok) {
      passed = true;
    } else {
      // 2) Fallback: reCAPTCHA (if configured)
      const r = await verifyRecaptcha(recaptchaToken);
      reasons.push(r.reason);
      if (r.ok) {
        passed = true;
      } else {
        // 3) Last resort: Honeypot
        if (honeypot && honeypot.trim() !== "") {
          reasons.push("honeypot-hit");
          return NextResponse.json({ error: "Spam detected." }, { status: 400 });
        }
      }
    }

    if (!passed) {
      // Keep generic; details recorded in server logs
      return NextResponse.json({ error: "Verification failed." }, { status: 400 });
    }

    const from = String(process.env.RESEND_FROM_EMAIL || "");
    const to = String(process.env.RESEND_TO_EMAIL || "");
    if (!from || !to) {
      return NextResponse.json({ error: "Email not configured." }, { status: 500 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const subject = "New website lead from " + name;
    const textLines = [
      "Name: " + name,
      "Email: " + email,
      "Phone: " + (phone || "—"),
      "",
      "Message:",
      String(message)
    ];

    await resend.emails.send({
      from,
      to,
      subject,
      replyTo: email,
      text: textLines.join("\n")
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
