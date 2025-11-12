"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      getResponse?: (id?: string | number) => string;
      reset?: (id?: string | number) => void;
    };
  }
}

export default function ContactForm() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
  const hasTurnstile = Boolean(siteKey);
  const [sdkReady, setSdkReady] = useState(false);
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const tokenInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Keep hidden input in sync with the current token
  useEffect(() => {
    if (!hasTurnstile || !sdkReady) return;

    let timer: number | undefined;

    const tick = () => {
      try {
        const v = window.turnstile?.getResponse?.() || "";
        if (v && v !== token) {
          setToken(v);
          if (tokenInputRef.current) tokenInputRef.current.value = v;
        }
      } catch {}
      timer = window.setTimeout(tick, 800);
    };

    tick();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [hasTurnstile, sdkReady, token]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    const form = e.currentTarget;

    // Ensure token exists if Turnstile is enabled
    if (hasTurnstile) {
      const v = tokenInputRef.current?.value || window.turnstile?.getResponse?.() || "";
      if (!v) {
        setErrors({ form: "Please complete the security check." });
        setSubmitting(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(form),
      });

      const json = await res.json();

      if (json?.success || json?.ok) {
        // Success → reset form and redirect
        form.reset();
        setToken("");
        if (tokenInputRef.current) tokenInputRef.current.value = "";
        try {
          window.turnstile?.reset?.();
        } catch {}
        // Redirect to thanks page
        window.location.href = "/thanks?src=contact";
        return;
      } else {
        console.warn("[contact] failed", json);
        setErrors({ form: json?.error || "Verification failed. Please try again." });
        setSubmitting(false);
      }
    } catch (err) {
      console.error("[contact] error", err);
      setErrors({ form: "Something went wrong. Please try again." });
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
          <input
            name="name"
            required
            className="mt-2 w-full rounded-md border border-wood-300 p-2"
            placeholder="John Doe"
          />
          {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name}</p> : null}
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-md border border-wood-300 p-2"
            placeholder="you@email.com"
          />
          {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
        </div>
        <div>
          <label className="block text-sm font-medium">Phone (optional)</label>
          <input
            name="phone"
            className="mt-2 w-full rounded-md border border-wood-300 p-2"
            placeholder="941-111-1111"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Message</label>
          <textarea
            name="message"
            required
            rows={5}
            className="mt-2 w-full rounded-md border border-wood-300 p-2"
            placeholder="Tell us about your project..."
          />
          {errors.message ? <p className="mt-1 text-sm text-red-600">{errors.message}</p> : null}
        </div>

        {/* Honeypot field (hidden from users) */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="sr-only"
          aria-hidden="true"
        />

        {/* Dev banner (non-production only) */}
        {process.env.NODE_ENV !== "production" && (
          <div className="md:col-span-2 text-xs text-gray-500 p-2 bg-gray-100 rounded">
            Captcha: <b>{hasTurnstile ? "turnstile" : "honeypot"}</b> · SDK: <b>{sdkReady ? "ready" : "loading"}</b> · token:{" "}
            <b>{token ? token.slice(0, 10) + "…" : "(none)"}</b>
          </div>
        )}

        {/* Turnstile widget */}
        {hasTurnstile && (
          <div className="md:col-span-2">
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js"
              async
              defer
              onReady={() => setSdkReady(true)}
            />
            <div
              id="cf-turnstile"
              className="cf-turnstile mt-2 min-h-[70px]"
              data-sitekey={siteKey}
              data-theme="light"
            />
            <input ref={tokenInputRef} type="hidden" name="cf-turnstile-response" value="" readOnly />
          </div>
        )}
      </div>

      {errors.form ? <p className="mt-4 text-sm text-red-600">{errors.form}</p> : null}

      <button type="submit" disabled={submitting} className="btn-primary mt-6">
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
