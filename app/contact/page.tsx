import ContactForm from "@/components/ContactForm";
import { business } from "@/lib/business";

export const metadata = {
  title: "Free Cabinet Consultation & Estimate",
  description:
    "Request a free in-home consultation for cabinet refacing, refinishing, custom cabinetry, or vanities in Bradenton, Sarasota, St. Petersburg & Parrish, FL. We respond within one business day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="container py-12 grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ContactForm />
      </div>
      <aside className="section-card p-6 md:p-8 h-fit">
        <h2 className="font-serif text-xl">Prefer to talk?</h2>
        <p className="mt-2 text-gray-700">
          Call <a className="font-semibold text-wood-700 hover:underline" href={business.phoneHref}>{business.phone}</a>
        </p>
        <p className="mt-1 text-sm text-gray-600">{business.hours}</p>

        <h2 className="mt-6 font-serif text-xl">What happens next</h2>
        <ol className="mt-2 list-decimal pl-5 space-y-1 text-sm text-gray-700">
          <li>We reply within one business day to schedule a visit.</li>
          <li>We measure and show you door styles, colors, and hardware.</li>
          <li>You get a written estimate—no pressure, no obligation.</li>
        </ol>

        <h2 className="mt-6 font-serif text-xl">Service areas</h2>
        <p className="mt-2 text-sm text-gray-700">
          {[...business.primaryAreas, ...business.alsoServing].join(" · ")}
        </p>
      </aside>
    </section>
  );
}
