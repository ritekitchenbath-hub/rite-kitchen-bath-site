import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadSchema } from "@/lib/validators";

async function clientIp(h: Headers) {
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    null
  );
}

async function verifyTurnstile(token: string, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: false, codes: ["missing-secret"] };

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });

  const j = await r.json();
  return { ok: !!j.success, codes: j["error-codes"] || [] };
}

export async function POST(req: Request) {
  const host = req.headers.get("host") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  const ip = await clientIp(req.headers);

  try {
    // Handle FormData (from new form) or JSON (fallback)
    const contentType = req.headers.get("content-type") || "";
    let name: string;
    let email: string;
    let phone: string;
    let message: string;
    let tsToken: string = "";
    let recaptchaToken: string = "";
    let honeypot: string = "";

    if (contentType.includes("multipart/form-data")) {
      // FormData submission (new Turnstile form)
      const fd = await req.formData();
      name = String(fd.get("name") || "");
      email = String(fd.get("email") || "");
      phone = String(fd.get("phone") || "");
      message = String(fd.get("message") || "");
      tsToken = String(fd.get("cf-turnstile-response") || "");
      honeypot = String(fd.get("website") || "");
    } else {
      // JSON submission (fallback/reCAPTCHA)
      const json = await req.json();
      const parsed = leadSchema.safeParse(json);
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
      }
      name = parsed.data.name;
      email = parsed.data.email;
      phone = parsed.data.phone || "";
      message = parsed.data.message;
      tsToken = parsed.data.turnstileToken || "";
      recaptchaToken = parsed.data.recaptchaToken || "";
      honeypot = parsed.data.honeypot || "";
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Spam protection priority ladder: Turnstile → reCAPTCHA → Honeypot
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    // Priority 1: Try Turnstile if token is present
    if (tsToken) {
      const vr = await verifyTurnstile(tsToken, ip);
      if (vr.ok) {
        // Turnstile verified successfully → send email
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

        console.log("[CAPTCHA] Form submitted successfully", {
          provider: "turnstile",
          host,
          success: true,
          remoteip: ip,
          userAgent: userAgent.substring(0, 100)
        });

        return NextResponse.json({ provider: "turnstile", success: true });
      }

      // Turnstile verification failed
      console.warn("[CAPTCHA] Turnstile verify fail", {
        provider: "turnstile",
        host,
        success: false,
        errorCodes: vr.codes,
        remoteip: ip,
        userAgent: userAgent.substring(0, 100)
      });

      return NextResponse.json(
        { provider: "turnstile", success: false, errorCodes: vr.codes },
        { status: 400 }
      );
    }

    // Fallback ladder: reCAPTCHA → Honeypot (keep existing logic)
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

    async function verifyTurnstileFallback(token?: string): Promise<CheckResult> {
      if (!turnstileSecret) return { ok: false, reason: "turnstile-not-configured" };
      if (!token) return { ok: false, reason: "turnstile-missing-token" };

      const body = new URLSearchParams({ secret: turnstileSecret, response: token });
      if (ip) body.set("remoteip", ip);

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
          remoteip: ip,
          userAgent: userAgent.substring(0, 100),
          payload: j
        });
      } else {
        console.log("[CAPTCHA] Turnstile verify success", {
          provider: "turnstile",
          host,
          success: true,
          remoteip: ip,
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
      if (ip) body.set("remoteip", ip);

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
          remoteip: ip,
          userAgent: userAgent.substring(0, 100),
          payload: j
        });
      } else {
        console.log("[CAPTCHA] reCAPTCHA verify success", {
          provider: "recaptcha",
          host,
          success: true,
          remoteip: ip,
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

    // Fallback: reCAPTCHA → Honeypot (only if no Turnstile token)
    let passed = false;
    let provider: string = "none";
    let errorCodes: string[] = [];
    const reasons: string[] = [];

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
        console.warn("[CAPTCHA] Honeypot triggered", { host, remoteip: ip, userAgent: userAgent.substring(0, 100) });
        return NextResponse.json({ error: "Spam detected." }, { status: 400 });
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
        remoteip: ip,
        userAgent: userAgent.substring(0, 100)
      });
      return NextResponse.json({ 
        error: "Please complete the security challenge.",
        errorCodes,
        provider: "none"
      }, { status: 400 });
    }

    // Send email for reCAPTCHA/honeypot path
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
      remoteip: ip,
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
      remoteip: ip,
      userAgent: userAgent.substring(0, 100),
      error: err
    });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
