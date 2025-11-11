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
      remove: (widgetId: string) => void;
    };
  }
}

export default function ContactForm() {
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState<string | null>(null);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | null>(null);
  const [useRecaptcha, setUseRecaptcha] = useState(false); // Switch to reCAPTCHA if Turnstile fails
  const [recaptchaWidgetId, setRecaptchaWidgetId] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetKeyRef = useRef(0); // Defensive key to prevent duplicate mounts

  // Initialize: Load scripts and set keys only if env vars are present
  useEffect(() => {
    // Guard: Only mount Turnstile if site key is present
    const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || null;
    if (turnstileKey) {
      setTurnstileSiteKey(turnstileKey);
      // Load Turnstile script once
      if (typeof window !== "undefined" && !document.getElementById("turnstile-script")) {
        const s = document.createElement("script");
        s.id = "turnstile-script";
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
        console.log("[ContactForm] Turnstile script loaded");
      }
    }

    // Guard: Only mount reCAPTCHA if site key is present (for fallback)
    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() || null;
    if (recaptchaKey) {
      setRecaptchaSiteKey(recaptchaKey);
      // Load reCAPTCHA script only when needed (lazy load on fallback)
      // Script will be loaded when useRecaptcha becomes true
    }
  }, []);

  // Render Turnstile widget (single instance, defensive key)
  useEffect(() => {
    // Only render if Turnstile is preferred and not using reCAPTCHA fallback
    if (useRecaptcha || !turnstileSiteKey || !turnstileRef.current || turnstileWidgetId) return;

    const renderTurnstile = () => {
      if (window.turnstile && turnstileRef.current && !turnstileWidgetId) {
        try {
          const widgetId = window.turnstile.render(turnstileRef.current, {
            sitekey: turnstileSiteKey,
            callback: (token: string) => {
              console.log("[ContactForm] Turnstile token received");
              setTurnstileToken(token);
              setErrors((prev) => {
                const next = { ...prev };
                delete next.turnstile;
                return next;
              });
            },
            'error-callback': () => {
              console.warn("[ContactForm] Turnstile client-side error");
              setTurnstileToken(null);
              // Note: Domain errors are typically detected server-side, not client-side
              // Server will return error codes which trigger fallback in onSubmit
              setErrors((prev) => ({ ...prev, turnstile: "Turnstile verification failed. Please try again." }));
            },
            'expired-callback': () => {
              console.log("[ContactForm] Turnstile token expired");
              setTurnstileToken(null);
              setErrors((prev) => ({ ...prev, turnstile: "Turnstile challenge expired. Please try again." }));
            },
          });
          setTurnstileWidgetId(widgetId);
          widgetKeyRef.current += 1; // Increment defensive key
          console.log("[ContactForm] Turnstile widget rendered", widgetId);
        } catch (err) {
          console.error("[ContactForm] Turnstile render error", err);
        }
      }
    };

    if (window.turnstile) {
      renderTurnstile();
    } else {
      // Wait for script to load (max 10 seconds)
      const checkTurnstile = setInterval(() => {
        if (window.turnstile) {
          renderTurnstile();
          clearInterval(checkTurnstile);
        }
      }, 100);
      setTimeout(() => clearInterval(checkTurnstile), 10000);
    }

    // Cleanup: remove widget on unmount or when switching to reCAPTCHA
    return () => {
      if (turnstileWidgetId && window.turnstile?.remove) {
        try {
          window.turnstile.remove(turnstileWidgetId);
          console.log("[ContactForm] Turnstile widget removed");
        } catch (err) {
          console.warn("[ContactForm] Turnstile cleanup error", err);
        }
      }
    };
  }, [turnstileSiteKey, turnstileWidgetId, useRecaptcha]);

  // Load and render reCAPTCHA when fallback is needed
  useEffect(() => {
    if (!useRecaptcha || !recaptchaSiteKey || !recaptchaRef.current || recaptchaWidgetId !== null) return;

    // Load reCAPTCHA script if not already loaded
    if (!document.getElementById("recaptcha-script")) {
      const s = document.createElement("script");
      s.id = "recaptcha-script";
      s.src = "https://www.google.com/recaptcha/api.js";
      s.async = true;
      s.defer = true;
      s.onload = () => {
        console.log("[ContactForm] reCAPTCHA script loaded");
        renderRecaptcha();
      };
      document.head.appendChild(s);
    } else if (window.grecaptcha) {
      renderRecaptcha();
    } else {
      // Wait for existing script to load
      const checkRecaptcha = setInterval(() => {
        if (window.grecaptcha) {
          renderRecaptcha();
          clearInterval(checkRecaptcha);
        }
      }, 100);
      setTimeout(() => clearInterval(checkRecaptcha), 10000);
    }

    function renderRecaptcha() {
      if (window.grecaptcha && recaptchaRef.current && recaptchaWidgetId === null) {
        try {
          const widgetId = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: recaptchaSiteKey,
            callback: () => {
              console.log("[ContactForm] reCAPTCHA token received");
            },
          });
          setRecaptchaWidgetId(widgetId);
          console.log("[ContactForm] reCAPTCHA widget rendered", widgetId);
        } catch (err) {
          console.error("[ContactForm] reCAPTCHA render error", err);
        }
      }
    }
  }, [useRecaptcha, recaptchaSiteKey, recaptchaWidgetId]);

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

      // Collect tokens based on active widget (single widget rendering)
      if (useRecaptcha) {
        // Using reCAPTCHA fallback
        if (window.grecaptcha) {
          const recaptchaResp = window.grecaptcha.getResponse(recaptchaWidgetId || undefined);
          if (recaptchaResp) {
            data.recaptchaToken = recaptchaResp;
            data.turnstileToken = undefined; // Clear Turnstile token
          }
        }
        if (!data.recaptchaToken) {
          setErrors({ recaptcha: "Please confirm you are not a robot." });
          setSubmitting(false);
          return;
        }
      } else if (turnstileSiteKey) {
        // Using Turnstile (preferred)
        if (!turnstileToken) {
          setErrors({ turnstile: "Please complete the security challenge." });
          setSubmitting(false);
          return;
        }
        data.turnstileToken = turnstileToken;
        data.recaptchaToken = undefined; // Clear reCAPTCHA token
      }

      console.log("[ContactForm] Submitting form", { 
        provider: useRecaptcha ? "recaptcha" : "turnstile",
        hasTurnstileToken: !!data.turnstileToken,
        hasRecaptchaToken: !!data.recaptchaToken
      });

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Check if server returned domain/sitekey error for Turnstile
        const errorMsg = responseData.error || "Something went wrong. Please try again.";
        const errorCodes = responseData.errorCodes || [];
        
        // If Turnstile fails with domain error and reCAPTCHA is available, switch to reCAPTCHA
        if (
          !useRecaptcha &&
          turnstileSiteKey &&
          recaptchaSiteKey &&
          (errorCodes.includes("invalid-domain") || 
           errorCodes.includes("invalid-sitekey") ||
           errorMsg.toLowerCase().includes("domain") ||
           errorMsg.toLowerCase().includes("sitekey") ||
           errorCodes.some((code: string) => code.includes("domain") || code.includes("sitekey")))
        ) {
          console.log("[ContactForm] Server returned domain error, switching to reCAPTCHA");
          setUseRecaptcha(true);
          // Reset Turnstile widget
          if (turnstileWidgetId && window.turnstile?.remove) {
            window.turnstile.remove(turnstileWidgetId);
            setTurnstileWidgetId(null);
            setTurnstileToken(null);
          }
          setErrors({ recaptcha: "Switching to alternative verification. Please complete the challenge." });
        } else {
          setErrors({ form: errorMsg });
        }
        setSubmitting(false);
        return;
      }

      // Success → log provider used and redirect
      console.log("[ContactForm] Form submitted successfully", { 
        provider: useRecaptcha ? "recaptcha" : "turnstile",
        response: responseData
      });
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

        {/* Single widget rendering: Turnstile preferred, reCAPTCHA as fallback */}
        {!useRecaptcha && turnstileSiteKey ? (
          <div className="md:col-span-2" key={`turnstile-${widgetKeyRef.current}`}>
            <div
              ref={turnstileRef}
              className="cf-turnstile"
              data-sitekey={turnstileSiteKey}
              id="cf-turnstile"
            ></div>
            {errors.turnstile ? <p className="mt-1 text-sm text-red-600">{errors.turnstile}</p> : null}
          </div>
        ) : null}

        {useRecaptcha && recaptchaSiteKey ? (
          <div className="md:col-span-2" key="recaptcha-widget">
            <div ref={recaptchaRef} id="g-recaptcha-container"></div>
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
