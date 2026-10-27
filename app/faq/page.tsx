import CtaBand from "@/components/CtaBand";
import { JsonLd } from "@/lib/business";
import { faqs, faqJsonLd } from "@/lib/faqs";

export const metadata = {
  title: "Cabinet Refacing FAQ: Cost, Timeline & Options",
  description:
    "Answers to common questions about cabinet refacing, refinishing, and replacement—cost, timelines, Florida humidity, condos, licensing, and service areas.",
  alternates: { canonical: "/faq" },
};

export default function FAQPage() {
  return (
    <div className="container py-12">
      <JsonLd data={faqJsonLd(faqs)} />
      <h1 className="font-serif text-3xl md:text-4xl">Frequently Asked Questions</h1>
      <div className="mt-8 max-w-3xl divide-y divide-wood-200 section-card">
        {faqs.map((f) => (
          <details key={f.q} className="group p-6">
            <summary className="cursor-pointer list-none font-semibold flex justify-between gap-4">
              {f.q}
              <span className="text-wood-700 transition-transform group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <p className="mt-3 text-gray-600">{f.a}</p>
          </details>
        ))}
      </div>
      <div className="-mx-4">
        <CtaBand title="Still have questions?" text="Call or send us a message—we usually respond within one business day." />
      </div>
    </div>
  );
}
