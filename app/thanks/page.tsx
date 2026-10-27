import TrackLead from "@/components/TrackLead";
import { business } from "@/lib/business";

export const metadata = {
  title: "Thanks",
  robots: { index: false, follow: false }, // keep this page out of search
};

export default function ThanksPage() {
  return (
    <section className="container py-16">
      <div className="section-card p-8 text-center">
        <h1 className="font-serif text-3xl">Thanks! We received your message.</h1>
        <p className="mt-3 text-ink-900/80">
          We’ll reach out within one business day. If it’s urgent, call{" "}
          <a className="font-semibold text-wood-700 hover:underline" href={business.phoneHref}>{business.phone}</a>.
        </p>
      </div>
      {/* Client-only tracker */}
      <TrackLead />
    </section>
  );
}
