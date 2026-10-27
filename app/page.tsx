import Link from "next/link";
import Image from "next/image";
import VideoHero from "@/components/VideoHero";
import GalleryGrid from "@/components/GalleryGrid";
import CtaBand from "@/components/CtaBand";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";
import { business } from "@/lib/business";

export const metadata = {
  title: { absolute: "Cabinet Refacing & Custom Cabinetry | Bradenton, Sarasota, St. Pete | Rite Kitchen & Bath" },
  description:
    "Get a brand-new kitchen look in days with cabinet refacing, refinishing, and custom cabinetry from Rite Kitchen & Bath. Serving Bradenton, Sarasota, St. Petersburg & Parrish, FL. Free in-home consultation.",
  alternates: { canonical: "/" },
};

const highlights = [
  { title: "Days, not months", text: "Most refacing projects wrap up in about 3–5 working days." },
  { title: "Save vs. replacement", text: "Keep your solid cabinet boxes and spend on what you see." },
  { title: "Built for Florida", text: "Finishes and materials chosen for Gulf Coast humidity." },
  { title: "Licensed & insured", text: "Clean, protected job sites and a written estimate up front." },
];

const steps = [
  { n: "1", title: "Free in-home consultation", text: "We measure, talk through how you use your space, and bring door styles, finishes, and hardware to see in your own light." },
  { n: "2", title: "Design & written estimate", text: "You get a clear, itemized quote and a schedule. No surprises, no pressure." },
  { n: "3", title: "Clean, on-time install", text: "We protect your home, work efficiently, and walk the finished job with you before we call it done." },
];

export default function HomePage() {
  return (
    <>
      <VideoHero />

      <section className="container py-10">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <li key={h.title} className="section-card p-5">
              <p className="font-semibold">{h.title}</p>
              <p className="mt-1 text-sm text-gray-600">{h.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container py-12">
        <div className="max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl">Kitchen &amp; Bath Cabinet Services</h2>
          <p className="mt-3 text-gray-700">
            Whether you want a fresh color, a whole new door style, or cabinetry built around a new layout,
            {" "}{business.name} handles the full job—design, finishing, hardware, and installation—with one local team.
          </p>
        </div>
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.id} className="section-card p-6 flex flex-col">
              <h3 className="font-semibold text-lg">{s.title}</h3>
              <p className="mt-2 text-gray-600 flex-1">{s.summary}</p>
              <Link href={"/services#" + s.id} className="mt-4 text-sm font-semibold text-wood-700 hover:underline">
                Learn more →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-soft">
            <Image
              src="/images/install-soft-close-hinge.webp"
              alt="Installer adjusting a soft-close hinge on a new white shaker cabinet door"
              fill
              className="object-cover"
              sizes="(min-width:1024px) 50vw, 100vw"
            />
          </div>
          <div>
            <h2 className="font-serif text-2xl md:text-3xl">Refacing vs. Replacing: Why Many Homeowners Reface</h2>
            <p className="mt-3 text-gray-700">
              If your cabinet boxes are solid, tearing them out often means paying for demolition, new countertops,
              plumbing, and weeks without a kitchen. Refacing replaces the parts you see—doors, drawer fronts, and
              hardware—and refinishes the frames to match.
            </p>
            <ul className="mt-5 space-y-2 text-gray-700">
              <li>✓ Typically a fraction of the cost of new cabinets</li>
              <li>✓ Countertops, backsplash, and plumbing usually stay put</li>
              <li>✓ Less dust, less waste, and you can keep cooking</li>
              <li>✓ Add soft-close hinges, pull-outs, and crown while we&apos;re there</li>
            </ul>
            <Link href="/faq" className="mt-6 inline-block text-sm font-semibold text-wood-700 hover:underline">
              Read our FAQ →
            </Link>
          </div>
        </div>
      </section>

      <GalleryGrid title="Recent Work" />

      <section className="container py-12">
        <h2 className="font-serif text-2xl md:text-3xl">How It Works</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="section-card p-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-wood-700 font-semibold text-white">{s.n}</span>
              <h3 className="mt-4 font-semibold text-lg">{s.title}</h3>
              <p className="mt-2 text-gray-600">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container py-12">
        <h2 className="font-serif text-2xl md:text-3xl">Proudly Serving the Gulf Coast</h2>
        <p className="mt-3 max-w-3xl text-gray-700">
          Based in Bradenton, we work throughout Manatee, Sarasota, and Pinellas counties.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((a) => (
            <li key={a.slug}>
              <Link href={"/areas/" + a.slug} className="section-card block p-5 hover:border-wood-400">
                <p className="font-semibold">{a.name}, FL</p>
                <p className="mt-1 text-sm text-gray-600">{a.county}</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-gray-600">Also serving {business.alsoServing.join(", ")}.</p>
      </section>

      <CtaBand />
    </>
  );
}
