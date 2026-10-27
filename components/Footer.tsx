import Link from "next/link";
import { business } from "@/lib/business";
import { areas } from "@/lib/areas";
import { services } from "@/lib/services";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-wood-200 bg-white">
      <div className="container py-12 grid gap-10 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-lg text-ink-900">{business.name}</p>
          <p className="mt-2">{business.tagline}</p>
          <p className="mt-4">
            <a className="font-semibold text-wood-700 hover:underline" href={business.phoneHref}>
              {business.phone}
            </a>
          </p>
          <p className="mt-1">{business.hours}</p>
          <p className="mt-1">Licensed &amp; insured in Florida</p>
        </div>

        <nav aria-label="Services">
          <p className="font-semibold text-ink-900">Services</p>
          <ul className="mt-3 space-y-2">
            {services.map((s) => (
              <li key={s.id}>
                <Link className="hover:text-wood-700" href={"/services#" + s.id}>{s.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Service areas">
          <p className="font-semibold text-ink-900">Service Areas</p>
          <ul className="mt-3 space-y-2">
            {areas.map((a) => (
              <li key={a.slug}>
                <Link className="hover:text-wood-700" href={"/areas/" + a.slug}>{a.name}, FL</Link>
              </li>
            ))}
            <li>
              <Link className="hover:text-wood-700" href="/areas">All areas</Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company">
          <p className="font-semibold text-ink-900">Company</p>
          <ul className="mt-3 space-y-2">
            <li><Link className="hover:text-wood-700" href="/gallery">Gallery</Link></li>
            <li><Link className="hover:text-wood-700" href="/faq">FAQ</Link></li>
            <li><Link className="hover:text-wood-700" href="/contact">Free Consultation</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-wood-100">
        <p className="container py-5 text-xs text-gray-500">
          © {new Date().getFullYear()} {business.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
