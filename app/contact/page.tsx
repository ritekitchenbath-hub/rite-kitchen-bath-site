import ContactForm from "@/components/ContactForm";
import { siteUrl } from "@/lib/site";

export const metadata = {
  title: "Contact Us | Rite Kitchen & Bath | Free Consultation",
  description: "Get a free consultation for your kitchen or bath project in Bradenton and Palmetto, FL. We'll respond within one business day."
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

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <section className="container py-12">
        <ContactForm />
      </section>
    </>
  );
}

// reCAPTCHA key test 11/11/2025 09:24:31
