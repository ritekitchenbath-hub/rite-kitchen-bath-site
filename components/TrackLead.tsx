"use client";
import { useEffect } from "react";

export default function TrackLead() {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && (window as any).gtag && process.env.NEXT_PUBLIC_GA_ID) {
        (window as any).gtag("event", "lead_contact_submit", {
          event_category: "lead",
          event_label: "contact_form",
        });
      }
    } catch {}
  }, []);
  return null;
}
