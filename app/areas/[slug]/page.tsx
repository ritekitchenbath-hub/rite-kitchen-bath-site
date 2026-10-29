import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import GalleryGrid from "@/components/GalleryGrid";
import { areas, getArea } from "@/lib/areas";
import { services } from "@/lib/services";
import { business, JsonLd } from "@/lib/business";
import { faqs, faqJsonLd } from "@/lib/faqs";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = getArea((await params).slug);
  if (!area) return {};
  return {
    title: { absolute: `Cabinet Refacing ${area.name}, FL | Custom Cabinetry | ${business.name}` },
    description: `Cabinet refacing, refinishing, custom cabinetry, and bathroom vanities in ${area.name}, FL. Serving ${area.neighborhoods.slice(0, 3).join(", ")} and more. Free in-home consultation—call ${business.phone}.`,
    alternates: { canonical: "/areas/" + area.slug },
    openGraph: { title: area.headline, url: siteUrl + "/areas/" + area.slug },
  };
}

export default async function AreaPage({ params }: Props) {
  const area = getArea((await params).slug);
  if (!area) notFound();

  const localFaqs = [
    {
      q: `Do you offer a free in-home consultation in ${area.name}?`,
      a: `Yes. We provide free in-home consultations throughout ${area.name} and ${area.county}, including ${area.neighborhoods.slice(0, 4).join(", ")}.`,
    },
    ...faqs.slice(0, 3),
  ];

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Service Areas", item: siteUrl + "/areas" },
      { "@type": "ListItem", position: 3, name: area.name, item: siteUrl + "/areas/" + area.slug },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={faqJsonLd(localFaqs)} />

      <section className="container py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
          <Link href="/" className="hover:text-wood-700">Home</Link> /{" "}
          <Link href="/areas" className="hover:text-wood-700">Service Areas</Link> / {area.name}
        </nav>
        <h1 className="mt-4 font-serif text-3xl md:text-5xl leading-tight max-w-4xl">{area.headline}</h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-700">{area.intro}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/contact" className="btn-primary px-5 py-3">Free in-home consultation</Link>
          <a href={business.phoneHref} className="inline-flex items-center rounded-full border border-wood-700/40 bg-white px-5 py-3 font-semibold text-wood-800 hover:bg-wood-50">
            Call {business.phone}
          </a>
        </div>
      </section>

      <section className="container py-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4 text-gray-700">
            <h2 className="font-serif text-2xl text-ink-900">Why {area.name} Homeowners Choose Rite</h2>
            {area.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li>✓ Free in-home consultation</li>
              <li>✓ Written, itemized estimates</li>
              <li>✓ Most refacing done in 3–5 days</li>
              <li>✓ Humidity-ready finishes</li>
              <li>✓ Licensed &amp; insured in Florida</li>
              <li>✓ Clean, protected job sites</li>
            </ul>
          </div>
          <aside className="section-card p-6 h-fit">
            <h2 className="font-semibold">Neighborhoods we serve in {area.name}</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
              {area.neighborhoods.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-gray-600">Nearby: {area.nearby.join(", ")}</p>
          </aside>
        </div>
      </section>

      <section className="container py-12">
        <h2 className="font-serif text-2xl md:text-3xl">Cabinet Services in {area.name}</h2>
        <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.id} className="section-card p-6">
              <h3 className="font-semibold text-lg">{s.title}</h3>
              <p className="mt-2 text-gray-600">{s.summary}</p>
              <Link href={"/services#" + s.id} className="mt-3 inline-block text-sm font-semibold text-wood-700 hover:underline">
                Details →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <GalleryGrid title="Recent Styles" limit={3} />

      <section className="container py-12">
        <h2 className="font-serif text-2xl md:text-3xl">{area.name} Cabinet FAQ</h2>
        <div className="mt-6 max-w-3xl divide-y divide-wood-200 section-card">
          {localFaqs.map((f) => (
            <details key={f.q} className="group p-6">
              <summary className="cursor-pointer list-none font-semibold flex justify-between gap-4">
                {f.q}
                <span className="text-wood-700 transition-transform group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="mt-3 text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-sm text-gray-600">
          Other areas:{" "}
          {areas
            .filter((a) => a.slug !== area.slug)
            .map((a, i, arr) => (
              <span key={a.slug}>
                <Link href={"/areas/" + a.slug} className="text-wood-700 hover:underline">{a.name}</Link>
                {i < arr.length - 1 ? ", " : ""}
              </span>
            ))}
        </p>
      </section>

      <CtaBand title={`Ready to update your ${area.name} kitchen?`} />
    </>
  );
}
