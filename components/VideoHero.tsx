"use client";

export default function VideoHero() {
  // NOTE: We rely on the browser to pick the first <source> that exists.
  // If you only have /videos/hero.mp4, that will be used automatically.
  return (
    <section className="container pt-8">
      <div className="relative overflow-hidden rounded-3xl shadow-soft h-[46vh] md:h-[60vh] lg:h-[72vh]">
        {/* Background video */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster="/images/hero-placeholder.svg"
          muted
          playsInline
          autoPlay
          loop
          preload="metadata"
        >
          <source src="/videos/hero.web.mp4" type="video/mp4" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Warm wood tint + subtle top/bottom fade for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(245,239,231,0.65)_0%,rgba(245,239,231,0.25)_40%,rgba(245,239,231,0.25)_60%,rgba(245,239,231,0.65)_100%)]" />

        {/* Hero copy */}
        <div className="relative z-10 flex h-full items-center px-6 md:px-10">
          <div className="max-w-3xl">
            <p className="font-serif text-2xl md:text-3xl text-[#9a7356]">Rite Kitchen & Bath</p>
            <h1 className="mt-2 font-serif text-3xl md:text-5xl lg:text-6xl leading-tight text-[#2b2018]">
              Cabinetry, Refacing & Finishing—Done Right.
            </h1>
            <p className="mt-3 text-[#3e2f25]/80">
              Local craft. Clean installs. On time. Serving Bradenton & Palmetto.
            </p>
            <a href="/contact" className="btn-primary mt-6 inline-block">Get a Free Consultation</a>
          </div>
        </div>
      </div>
    </section>
  );
}
