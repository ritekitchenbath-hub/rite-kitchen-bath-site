import Link from "next/link";
import { business } from "@/lib/business";

export default function VideoHero() {
  return (
    <section className="container pt-8">
      <div className="relative overflow-hidden rounded-3xl shadow-soft h-[60vh] min-h-[420px] lg:h-[72vh]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster="/images/hero.jpg"
          muted
          playsInline
          autoPlay
          loop
          preload="none"
          aria-hidden
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Warm wood tint + subtle top/bottom fade for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(245,239,231,0.92)_0%,rgba(245,239,231,0.75)_45%,rgba(245,239,231,0.15)_100%)]" />

        <div className="relative z-10 flex h-full items-center px-6 md:px-10">
          <div className="max-w-2xl">
            <p className="font-serif text-xl md:text-2xl text-[#9a7356]">{business.name}</p>
            <h1 className="mt-2 font-serif text-3xl md:text-5xl lg:text-6xl leading-tight text-[#2b2018]">
              Cabinet Refacing &amp; Custom Cabinetry—Done Rite.
            </h1>
            <p className="mt-4 text-lg text-[#3e2f25]/90">
              A brand-new kitchen look in days, not months. Serving Bradenton, Sarasota,
              St.&nbsp;Petersburg &amp; Parrish.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary px-5 py-3">Free in-home consultation</Link>
              <a href={business.phoneHref} className="inline-flex items-center rounded-full border border-wood-700/40 bg-white/70 px-5 py-3 font-semibold text-wood-800 hover:bg-white">
                Call {business.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
