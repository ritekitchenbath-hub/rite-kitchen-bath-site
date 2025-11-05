import VideoHero from '@/components/VideoHero';
import GalleryGrid from '@/components/GalleryGrid';
import { siteUrl } from '@/lib/site';

export const metadata = {
  title: "Rite Kitchen & Bath | Premium Cabinetry & Refacing | Bradenton, FL",
  description: "Expert kitchen and bath cabinetry, refacing, and finishing in Bradenton and Palmetto, FL. Licensed, insured, on-time installations. Free consultations."
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Rite Kitchen & Bath",
  "url": siteUrl,
  "telephone": "tel:+1-000-000-0000",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bradenton",
    "addressRegion": "FL",
    "addressCountry": "US"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Bradenton"
    },
    {
      "@type": "City",
      "name": "Palmetto"
    }
  ],
  "sameAs": [],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ]
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <VideoHero />
      <section className='container py-12'>
        <h2 className='font-serif text-2xl'>What We Do</h2>
        <p className='mt-3 text-gray-700 max-w-2xl'>
          We specialize in cabinetry, cabinet refacing, and professional finishing. We handle hardware, trim, and clean installs with careful prep and protection.
        </p>
      </section>
      <GalleryGrid />
    </>
  );
}
