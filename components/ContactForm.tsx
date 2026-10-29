"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { TURNSTILE_SITE_KEY } from "@/lib/env";
import { PROJECT_TYPES, TIMELINES } from "@/lib/lead-options";
declare global {
  interface Window {
    turnstile?: {
      render?: (container: string | HTMLElement, options: { sitekey: string; theme?: string }) => string;
      getResponse?: (id?: string | number) => string;
      reset?: (id?: string | number) => void;
      remove?: (id?: string | number) => void;
    };
  }
}

export default function ContactForm() {
  const siteKey = TURNSTILE_SITE_KEY || "";
  const hasTurnstile = Boolean(siteKey);
  const [sdkReady, setSdkReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!hasTurnstile || !sdkReady || !widgetRef.current || !window.turnstile?.render) return;
    if (widgetIdRef.current != null) return;

    try {
      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: siteKey,
        theme: "light",
      });
    } catch {
      widgetIdRef.current = null;
    }

    return () => {
      try {
        if (widgetIdRef.current != null) window.turnstile?.remove?.(widgetIdRef.current);
      } catch {}
      widgetIdRef.current = null;
    };
  }, [hasTurnstile, sdkReady, siteKey]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    const form = e.currentTarget;
    const body = new FormData(form);

    if (hasTurnstile) {
      const widgetId = widgetIdRef.current ?? undefined;
      let v = "";
      try {
        v = window.turnstile?.getResponse?.(widgetId) || "";
      } catch {
        v = "";
      }
      if (!v) {
        setErrors({ form: "Please complete the security check." });
        setSubmitting(false);
        return;
      }
      body.set("cf-turnstile-response", v);
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body,
      });

      const json = await res.json();

      if (json?.success || json?.ok) {
        form.reset();
        try {
          if (widgetIdRef.current != null) window.turnstile?.reset?.(widgetIdRef.current);
        } catch {}
        window.location.href = "/thanks?src=contact";
        return;
      } else {
        console.warn("[contact] failed", json?.error || "verification failed");
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
      <h1 className="font-serif text-2xl">Free in-home consultation</h1>
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
            type="tel"
            autoComplete="tel"
            placeholder="(941) 555-0123"
          />
        </div>

        <fieldset className="md:col-span-2">
          <legend className="text-sm font-medium">Project</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PROJECT_TYPES.map((value) => (
              <label
                key={value}
                className="flex min-h-12 cursor-pointer items-center justify-center rounded-md border border-wood-300 bg-white px-3 py-3 text-center text-sm font-medium has-[:checked]:border-wood-700 has-[:checked]:bg-wood-700 has-[:checked]:text-white"
              >
                <input type="radio" name="projectType" value={value} required className="sr-only" />
                {value}
              </label>
            ))}
          </div>
          {errors.projectType ? <p className="mt-1 text-sm text-red-600">{errors.projectType}</p> : null}
        </fieldset>

        <fieldset className="md:col-span-2">
          <legend className="text-sm font-medium">Timeline</legend>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {TIMELINES.map((value) => (
              <label
                key={value}
                className="flex min-h-12 cursor-pointer items-center justify-center rounded-md border border-wood-300 bg-white px-3 py-3 text-center text-sm font-medium has-[:checked]:border-wood-700 has-[:checked]:bg-wood-700 has-[:checked]:text-white"
              >
                <input type="radio" name="timeline" value={value} required className="sr-only" />
                {value}
              </label>
            ))}
          </div>
          {errors.timeline ? <p className="mt-1 text-sm text-red-600">{errors.timeline}</p> : null}
        </fieldset>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Note (optional)</label>
          <textarea
            name="note"
            rows={2}
            maxLength={500}
            className="mt-2 w-full rounded-md border border-wood-300 p-2"
            placeholder="Anything we should know? City, style, or a good time to call."
          />
          {errors.note ? <p className="mt-1 text-sm text-red-600">{errors.note}</p> : null}
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
        {process.env.NEXT_PUBLIC_ENV_NAME !== "production" && (
          <div className="md:col-span-2 text-xs text-gray-500 p-2 bg-gray-100 rounded">
            Captcha: <b>{hasTurnstile ? "turnstile" : "honeypot"}</b> · SDK: <b>{sdkReady ? "ready" : "loading"}</b>
          </div>
        )}

        {hasTurnstile && (
          <div className="md:col-span-2">
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
              async
              defer
              onReady={() => setSdkReady(true)}
            />
            <div ref={widgetRef} id="cf-turnstile" className="mt-2 min-h-[70px]" />
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
