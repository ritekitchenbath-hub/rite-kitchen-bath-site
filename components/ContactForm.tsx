"use client";

import { useEffect, useRef, useState } from "react";
import { leadSchema, LeadInput } from "@/lib/validators";

declare global {
  interface Window {
    grecaptcha?: any;
    turnstile?: {
      render: (element: HTMLElement, options: {
        sitekey: string;
        callback?: (token: string) => void;
        'error-callback'?: () => void;
        'expired-callback'?: () => void;
      }) => string;
      reset: (widgetId: string) => void;
    };
  }
}

export default function ContactForm() {
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [siteKey, setSiteKey] = useState<string | null>(null);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Turnstile if site key is present
    const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || null;
    if (turnstileKey) {
      setTurnstileSiteKey(turnstileKey);
      // Load Turnstile script once
      if (typeof window !== "undefined" && !document.getElementById("turnstile-script")) {
        const s = document.createElement("script");
        s.id = "turnstile-script";
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        s.async = true;
        s.defer = true;
        // Note: Manual render is handled by useEffect below; auto-render attributes on element provide backup
        document.head.appendChild(s);
      }
    }

    // Load reCAPTCHA if site key is present (existing logic)
    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || null;
    if (recaptchaKey) {
      setSiteKey(recaptchaKey);
      // Load script once
      if (typeof window !== "undefined" && !document.getElementById("recaptcha-script")) {
        const s = document.createElement("script");
        s.id = "recaptcha-script";
        s.src = "https://www.google.com/recaptcha/api.js";
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
      }
    }
  }, []);

  // Render Turnstile widget when script is loaded
  useEffect(() => {
    if (!turnstileSiteKey || !turnstileRef.current || turnstileWidgetId) return;

    // Check if Turnstile is already loaded
    if (window.turnstile) {
      const widgetId = window.turnstile.render(turnstileRef.current, {
        sitekey: turnstileSiteKey,
        callback: (token: string) => {
          setTurnstileToken(token);
        },
        'error-callback': () => {
          setTurnstileToken(null);
          setErrors({ turnstile: "Turnstile verification failed. Please try again." });
        },
        'expired-callback': () => {
          setTurnstileToken(null);
          setErrors({ turnstile: "Turnstile challenge expired. Please try again." });
        },
      });
      setTurnstileWidgetId(widgetId);
    } else {
      // Wait for script to load
      const checkTurnstile = setInterval(() => {
        if (window.turnstile && turnstileRef.current) {
          const widgetId = window.turnstile.render(turnstileRef.current, {
            sitekey: turnstileSiteKey,
            callback: (token: string) => {
              setTurnstileToken(token);
            },
            'error-callback': () => {
              setTurnstileToken(null);
              setErrors({ turnstile: "Turnstile verification failed. Please try again." });
            },
            'expired-callback': () => {
              setTurnstileToken(null);
              setErrors({ turnstile: "Turnstile challenge expired. Please try again." });
            },
          });
          setTurnstileWidgetId(widgetId);
          clearInterval(checkTurnstile);
        }
      }, 100);

      // Cleanup after 10 seconds
      setTimeout(() => clearInterval(checkTurnstile), 10000);
    }
  }, [turnstileSiteKey, turnstileWidgetId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const fd = new FormData(formRef.current!);
      const data: LeadInput = {
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        message: String(fd.get("message") || ""),
        turnstileToken: turnstileToken || undefined,
        recaptchaToken: undefined,
        honeypot: String(fd.get("website") || "")
      };

      // Validate client-side
      const parsed = leadSchema.safeParse(data);
      if (!parsed.success) {
        const es: Record<string,string> = {};
        parsed.error.issues.forEach(i => { es[i.path.join(".")] = i.message; });
        setErrors(es);
        setSubmitting(false);
        return;
      }

      // Collect tokens for server-side fallback verification
      // Server will try Turnstile first, then reCAPTCHA, then honeypot
      
      // Get reCAPTCHA token if widget is present
      if (siteKey && window.grecaptcha) {
        const recaptchaResp = window.grecaptcha.getResponse();
        if (recaptchaResp) {
          data.recaptchaToken = recaptchaResp;
        }
      }

      // Client-side validation: require at least one token if widgets are visible
      // (Server will handle fallback logic, but we provide immediate feedback)
      if (turnstileSiteKey && !turnstileToken) {
        // Turnstile widget is visible but no token
        // If reCAPTCHA is also visible and has token, allow (server will use reCAPTCHA)
        if (!data.recaptchaToken) {
          setErrors({ turnstile: "Please complete the security challenge." });
          setSubmitting(false);
          return;
        }
      } else if (siteKey && !turnstileSiteKey && !data.recaptchaToken) {
        // Only reCAPTCHA widget is visible, require token
        setErrors({ recaptcha: "Please confirm you are not a robot." });
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErrors({ form: j.error || "Something went wrong. Please try again." });
        setSubmitting(false);
        return;
      }

      // Success → go to thanks (fires GA event there)
      window.location.href = "/thanks?src=contact";
    } catch (err) {
      setErrors({ form: "Network error. Please try again." });
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="section-card p-6 md:p-8">
      <h1 className="font-serif text-2xl">Get a Free Consultation</h1>
      <p className="mt-2 text-sm text-ink-900/70">We will get back to you within one business day.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input name="name" className="mt-2 w-full rounded-md border border-wood-300 p-2" placeholder="John Doe" />
          {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name}</p> : null}
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" type="email" className="mt-2 w-full rounded-md border border-wood-300 p-2" placeholder="you@email.com" />
          {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
        </div>
        <div>
          <label className="block text-sm font-medium">Phone (optional)</label>
          <input name="phone" className="mt-2 w-full rounded-md border border-wood-300 p-2" placeholder="941-111-1111" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Message</label>
          <textarea name="message" rows={5} className="mt-2 w-full rounded-md border border-wood-300 p-2" placeholder="Tell us about your project..." />
          {errors.message ? <p className="mt-1 text-sm text-red-600">{errors.message}</p> : null}
        </div>

        {turnstileSiteKey ? (
          <div className="md:col-span-2">
            <div
              ref={turnstileRef}
              className="cf-turnstile"
              data-sitekey={turnstileSiteKey}
              id="cf-turnstile"
            ></div>
            {errors.turnstile ? <p className="mt-1 text-sm text-red-600">{errors.turnstile}</p> : null}
          </div>
        ) : null}

        {siteKey ? (
          <div className="md:col-span-2">
            <div className="g-recaptcha" data-sitekey={siteKey}></div>
            {errors.recaptcha ? <p className="mt-1 text-sm text-red-600">{errors.recaptcha}</p> : null}
          </div>
        ) : null}

        {/* Honeypot field (hidden from users) */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="sr-only"
          aria-hidden="true"
        />
      </div>

      {errors.form ? <p className="mt-4 text-sm text-red-600">{errors.form}</p> : null}

      <button disabled={submitting} className="btn-primary mt-6">
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
