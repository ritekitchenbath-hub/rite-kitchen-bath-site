import { siteUrl } from "@/lib/site";

export const business = {
  name: "Rite Kitchen & Bath",
  phone: "(941) 555-0148",
  phoneHref: "tel:+19415550148",
  phoneE164: "+1-941-555-0148",
  city: "Bradenton",
  region: "FL",
  hours: "Mon–Fri 9am–5pm · Sat by appointment",
  tagline: "Cabinet refacing, refinishing & custom cabinetry on Florida's Gulf Coast.",
  primaryAreas: ["Bradenton", "Sarasota", "St. Petersburg", "Parrish"],
  alsoServing: [
    "Palmetto",
    "Ellenton",
    "Lakewood Ranch",
    "Anna Maria Island",
    "Longboat Key",
    "Gulfport",
    "Pinellas Park",
  ],
} as const;

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": siteUrl + "/#business",
    name: business.name,
    url: siteUrl,
    image: siteUrl + "/og.jpg",
    telephone: business.phoneE164,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: business.city,
      addressRegion: business.region,
      addressCountry: "US",
    },
    areaServed: [...business.primaryAreas, ...business.alsoServing].map((name) => ({
      "@type": "City",
      name: name + ", FL",
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "17:00",
        description: "By appointment",
      },
    ],
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
