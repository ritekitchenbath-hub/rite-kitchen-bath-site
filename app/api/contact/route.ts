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
    
    if (turnstileSecret) {
      // Priority A: Turnstile is configured - require token
      if (!turnstileToken) {
        return NextResponse.json({ error: "Turnstile required." }, { status: 400 });
      }
      // Verify Turnstile token with Cloudflare
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "secret=" + encodeURIComponent(turnstileSecret) + "&response=" + encodeURIComponent(turnstileToken)
      });
      const verifyJson = await verifyRes.json();
      if (!verifyJson.success) {
        return NextResponse.json({ error: "Turnstile failed." }, { status: 400 });
      }
    } else if (recaptchaSecret && recaptchaSiteKey) {
      // Priority B: reCAPTCHA is configured - require token
      if (!recaptchaToken) {
        return NextResponse.json({ error: "reCAPTCHA required." }, { status: 400 });
      }
      // Verify reCAPTCHA token with Google
      const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "secret=" + encodeURIComponent(recaptchaSecret) + "&response=" + encodeURIComponent(recaptchaToken)
      });
      const verifyJson = await verifyRes.json();
      if (!verifyJson.success) {
        return NextResponse.json({ error: "reCAPTCHA failed." }, { status: 400 });
      }
    } else {
      // Priority C: Neither configured - use honeypot fallback
      if (honeypot && honeypot.trim() !== "") {
        return NextResponse.json({ error: "Spam detected." }, { status: 400 });
      }
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
