import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const host = req.headers.get("host") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  const forwardedFor = req.headers.get("x-forwarded-for") || "";
  const remoteip = forwardedFor.split(",")[0]?.trim();

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

    type CheckResult = { 
      ok: boolean; 
      reason: string; 
      errorCodes?: string[];
      payload?: any;
    };

    // Map error codes to human-readable messages
    function mapErrorCodes(codes: string[], provider: "turnstile" | "recaptcha"): string {
      for (const code of codes) {
        // Turnstile error codes
        if (code === "invalid-domain") {
          return `Invalid domain for ${provider} site key (${host} not whitelisted)`;
        }
        if (code === "invalid-sitekey") {
          return `Invalid ${provider} site key`;
        }
        // reCAPTCHA error codes
        if (code === "invalid-input-response") {
          return `Invalid domain for ${provider} site key (${host} not whitelisted)`;
        }
        if (code === "invalid-input-secret") {
          return `Invalid ${provider} secret key`;
        }
        if (code === "timeout-or-duplicate" || code === "timeout-or-duplicate-response") {
          return `${provider} token expired or already used`;
        }
        if (code === "missing-input-response") {
          return `Missing ${provider} token`;
        }
        if (code === "missing-input-secret") {
          return `Missing ${provider} secret key`;
        }
        if (code === "bad-request") {
          return `${provider} verification request invalid`;
        }
      }
      return `${provider} verification failed`;
    }

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
      const errorCodes = j["error-codes"] || [];

      if (!ok) {
        const errorMsg = mapErrorCodes(errorCodes, "turnstile");
        console.warn("[CAPTCHA] Turnstile verify fail", {
          provider: "turnstile",
          host,
          success: false,
          errorCodes,
          errorMsg,
          remoteip,
          userAgent: userAgent.substring(0, 100), // Truncate for logs
          payload: j
        });
      } else {
        console.log("[CAPTCHA] Turnstile verify success", {
          provider: "turnstile",
          host,
          success: true,
          remoteip,
          userAgent: userAgent.substring(0, 100)
        });
      }

      return { 
        ok, 
        reason: ok ? "turnstile-pass" : "turnstile-fail", 
        errorCodes,
        payload: j 
      };
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
      const errorCodes = j["error-codes"] || [];

      if (!ok) {
        const errorMsg = mapErrorCodes(errorCodes, "recaptcha");
        console.warn("[CAPTCHA] reCAPTCHA verify fail", {
          provider: "recaptcha",
          host,
          success: false,
          errorCodes,
          errorMsg,
          remoteip,
          userAgent: userAgent.substring(0, 100),
          payload: j
        });
      } else {
        console.log("[CAPTCHA] reCAPTCHA verify success", {
          provider: "recaptcha",
          host,
          success: true,
          remoteip,
          userAgent: userAgent.substring(0, 100)
        });
      }

      return { 
        ok, 
        reason: ok ? "recaptcha-pass" : "recaptcha-fail",
        errorCodes,
        payload: j 
      };
    }

    let passed = false;
    let provider: string = "none";
    let errorCodes: string[] = [];
    const reasons: string[] = [];

    // 1) Try Turnstile first (do not hard-fail if missing/invalid yet)
    const t = await verifyTurnstile(turnstileToken);
    reasons.push(t.reason);
    if (t.ok) {
      passed = true;
      provider = "turnstile";
    } else {
      errorCodes.push(...(t.errorCodes || []));
      // 2) Fallback: reCAPTCHA (if configured)
      const r = await verifyRecaptcha(recaptchaToken);
      reasons.push(r.reason);
      if (r.ok) {
        passed = true;
        provider = "recaptcha";
      } else {
        errorCodes.push(...(r.errorCodes || []));
        // 3) Last resort: Honeypot
        if (honeypot && honeypot.trim() !== "") {
          reasons.push("honeypot-hit");
          console.warn("[CAPTCHA] Honeypot triggered", { host, remoteip, userAgent: userAgent.substring(0, 100) });
          return NextResponse.json({ error: "Spam detected." }, { status: 400 });
        }
      }
    }

    if (!passed) {
      // Return error codes for client-side handling
      console.warn("[CAPTCHA] Verification failed", {
        provider: "none",
        host,
        success: false,
        errorCodes,
        reasons,
        remoteip,
        userAgent: userAgent.substring(0, 100)
      });
      return NextResponse.json({ 
        error: "Verification failed.",
        errorCodes,
        provider: "none"
      }, { status: 400 });
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

    // Log successful submission
    console.log("[CAPTCHA] Form submitted successfully", {
      provider,
      host,
      success: true,
      remoteip,
      userAgent: userAgent.substring(0, 100)
    });

    return NextResponse.json({ 
      ok: true,
      provider,
      success: true
    });
  } catch (err) {
    console.error("[CAPTCHA] Server error", {
      host,
      remoteip,
      userAgent: userAgent.substring(0, 100),
      error: err
    });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
