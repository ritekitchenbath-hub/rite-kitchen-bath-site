export default function VideoHero() {
  return (
    <section className="relative bg-white">
      <div className="container py-8">
        <div className="relative overflow-hidden rounded-xl2 shadow-soft">
          {/* Video */}
          <video
            className="w-full h-[38vh] min-h-[220px] object-cover md:h-[56vh]"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero.jpg"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>

          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="p-6 md:p-10">
              <h1 className="font-serif text-3xl md:text-5xl text-brand-900">
                Cabinetry, Refacing &amp; Finishing—Done Right.
              </h1>
              <p className="mt-3 text-gray-700 max-w-2xl">
                Local craft. Clean installs. On time. Serving Bradenton &amp; Palmetto.
              </p>
              <a
                href="/contact"
                className="mt-5 inline-flex items-center rounded-md bg-brand-500 px-5 py-2.5 text-white hover:opacity-95"
              >
                Get a Free Consultation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
