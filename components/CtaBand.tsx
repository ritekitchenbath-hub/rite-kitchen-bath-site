import Link from "next/link";
import { business } from "@/lib/business";

export default function CtaBand({
  title = "Ready for a kitchen you love?",
  text = "Book a free in-home consultation. We'll measure, show you door styles and finishes, and leave you with a written estimate.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="container py-12">
      <div className="rounded-3xl bg-wood-800 text-white px-6 py-10 md:px-12 md:flex md:items-center md:justify-between gap-8">
        <div className="max-w-2xl">
          <h2 className="font-serif text-2xl md:text-3xl">{title}</h2>
          <p className="mt-3 text-white/80">{text}</p>
        </div>
        <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3 shrink-0">
          <Link href="/contact" className="inline-flex justify-center rounded-full bg-white px-5 py-3 font-semibold text-wood-800 hover:bg-wood-50">
            Get a Free Consultation
          </Link>
          <a href={business.phoneHref} className="inline-flex justify-center rounded-full border border-white/40 px-5 py-3 font-semibold hover:bg-white/10">
            Call {business.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
