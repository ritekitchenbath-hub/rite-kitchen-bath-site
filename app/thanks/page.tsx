"use client";

import { useEffect } from "react";

export const metadata = {
  robots: { index: false, follow: false }, // keep "Thanks" out of search
};

export default function ThanksPage() {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "lead_submit", { event_category: "lead", event_label: "contact_form" });
      }
    } catch {}
  }, []);

  return (
    <section className="container py-16">
      <div className="section-card p-8 text-center">
        <h1 className="font-serif text-3xl">Thanks! We received your message.</h1>
        <p className="mt-3 text-ink-900/80">We’ll reach out shortly. If it’s urgent, call 941-111-1111.</p>
      </div>
    </section>
  );
}
