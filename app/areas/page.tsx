import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import { areas } from "@/lib/areas";
import { business } from "@/lib/business";

export const metadata = {
  title: "Service Areas: Bradenton, Sarasota, St. Petersburg & Parrish, FL",
  description:
    "Rite Kitchen & Bath provides cabinet refacing, refinishing, and custom cabinetry in Bradenton, Sarasota, St. Petersburg, Parrish, Palmetto, Lakewood Ranch, and nearby Gulf Coast communities.",
  alternates: { canonical: "/areas" },
};

export default function AreasPage() {
  return (
    <div className="container py-12">
      <h1 className="font-serif text-3xl md:text-4xl">Service Areas</h1>
      <p className="mt-3 max-w-3xl text-gray-700">
        We&apos;re based in Bradenton and bring cabinet refacing, refinishing, and custom cabinetry to homeowners
        across Manatee, Sarasota, and Pinellas counties.
      </p>

      <ul className="mt-8 grid gap-6 md:grid-cols-2">
        {areas.map((a) => (
          <li key={a.slug}>
            <Link href={"/areas/" + a.slug} className="section-card block p-6 hover:border-wood-400">
              <h2 className="font-serif text-2xl">{a.name}, FL</h2>
              <p className="mt-1 text-sm text-gray-500">{a.county}</p>
              <p className="mt-3 text-gray-700">{a.intro}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-wood-700">
                Cabinet services in {a.name} →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 font-serif text-2xl">Also Serving</h2>
      <ul className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-gray-700">
        {business.alsoServing.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-gray-600">
        Don&apos;t see your town? Call {business.phone}—if we can get there, we&apos;ll be happy to help.
      </p>

      <div className="-mx-4">
        <CtaBand />
      </div>
    </div>
  );
}
