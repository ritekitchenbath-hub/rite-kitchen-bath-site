export default function VideoHero() {
  return (
    <section className="relative">
      <div className="container py-8">
        <div className="relative overflow-hidden rounded-xl shadow-soft bg-white">
          <video
            className="w-full h-[38vh] min-h-[220px] object-cover md:h-[56vh]"
            // These are required for autoplay on iOS & desktop:
            autoPlay
            muted
            playsInline
            loop
            preload="metadata"
            poster="/images/hero.jpg"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
            {/* Optional alternate: <source src="/videos/hero.web.mp4" type="video/mp4" /> */}
          </video>

          {/* warm gradient to improve legibility */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wood-50/95 via-wood-50/40 to-transparent" />

          {/* content overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="p-6 md:p-10">
              <h1 className="font-serif text-3xl md:text-5xl text-ink-900">
                Cabinetry, Refacing &amp; Finishing—Done Right.
              </h1>
              <p className="mt-3 text-ink-900/80 max-w-2xl">
                Local craft. Clean installs. On time. Serving Bradenton &amp; Palmetto.
              </p>
              <a href="/contact" className="btn-primary mt-5">Get a Free Consultation</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
