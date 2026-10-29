import CtaBand from "@/components/CtaBand";
import { services } from "@/lib/services";
import { business, JsonLd } from "@/lib/business";
import { siteUrl } from "@/lib/site";

export const metadata = {
  title: "Cabinet Refacing, Refinishing & Custom Cabinetry Services",
  description:
    "Cabinet refacing, cabinet painting and refinishing, custom cabinetry, bathroom vanities, soft-close hardware upgrades, and repairs in Bradenton, Sarasota, St. Petersburg & Parrish, FL.",
  alternates: { canonical: "/services" },
};

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@graph": services.map((s) => ({
    "@type": "Service",
    name: s.title,
    description: s.summary,
    url: siteUrl + "/services#" + s.id,
    provider: { "@id": siteUrl + "/#business" },
    areaServed: business.primaryAreas.map((a) => a + ", FL"),
  })),
};

export default function ServicesPage() {
  return (
    <div className="container py-12">
      <JsonLd data={servicesJsonLd} />
      <h1 className="font-serif text-3xl md:text-4xl">Kitchen &amp; Bath Cabinet Services</h1>
      <p className="mt-3 max-w-3xl text-gray-700">
        From a simple hardware refresh to fully custom cabinetry, every project is measured, finished, and installed
        by our team. Not sure what you need? Start with a free in-home consultation and we&apos;ll walk you through the options.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <section key={s.id} id={s.id} className="section-card p-6 md:p-8 scroll-mt-24">
            <h2 className="font-serif text-2xl">{s.title}</h2>
            <p className="mt-3 text-gray-700">{s.summary}</p>
            <ul className="mt-4 space-y-2 text-gray-600">
              {s.details.map((d) => (
                <li key={d}>✓ {d}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-8 text-sm text-gray-600">{business.hours} · Licensed &amp; insured in Florida</p>
      <div className="-mx-4">
        <CtaBand />
      </div>
    </div>
  );
}
