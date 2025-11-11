import Link from "next/link";

export const metadata = {
  title: "Page Not Found | Rite Kitchen & Bath",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="container py-16">
      <div className="section-card p-8 md:p-12 text-center max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl">Page Not Found</h1>
        <p className="mt-4 text-ink-900/80">
          Sorry, we couldn't find the page you're looking for. It may have been moved or doesn't exist.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
        <p className="mt-6 text-sm text-ink-900/60">
          Need help? Call us at <a href="tel:+19411111111" className="text-wood-700 hover:underline">(941) 111-1111</a>
        </p>
      </div>
    </section>
  );
}

