export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "What's the difference between refacing, refinishing, and replacing cabinets?",
    a: "Refinishing keeps your existing doors and boxes and gives them a new sprayed finish. Refacing replaces the doors and drawer fronts and covers the frames to match, for a completely new style. Replacing tears out the cabinets entirely and installs new ones—best when the layout needs to change or the boxes are damaged.",
  },
  {
    q: "How much does cabinet refacing cost compared to new cabinets?",
    a: "Refacing typically costs significantly less than full replacement because the cabinet boxes, countertops, and plumbing stay in place. Every kitchen is different, so we give you a written, itemized quote after a free in-home consultation.",
  },
  {
    q: "How long does a typical refacing project take?",
    a: "Most kitchens are completed in about 3–5 working days once doors are ready. Bathroom vanities and hardware upgrades are often done in a day.",
  },
  {
    q: "Can I keep using my kitchen during the project?",
    a: "Usually, yes. Because we aren't removing countertops or appliances on a refacing job, most homeowners keep cooking throughout. We protect your floors and counters and clean up at the end of each day.",
  },
  {
    q: "Will the finish hold up to Florida humidity?",
    a: "We use catalyzed, furniture-grade coatings and moisture-resistant materials selected for Gulf Coast homes, and we prep every surface properly so the finish bonds and lasts.",
  },
  {
    q: "Do you work in condos?",
    a: "Yes. We regularly work in condo buildings and plan around HOA work hours, elevator reservations, and parking so the job goes smoothly.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes—we are licensed and insured in Florida. A certificate of insurance is available on request for your HOA or property manager.",
  },
  {
    q: "What areas do you serve?",
    a: "We're based in Bradenton and serve Bradenton, Sarasota, St. Petersburg, and Parrish, plus Palmetto, Ellenton, Lakewood Ranch, Anna Maria Island, Longboat Key, Gulfport, Pinellas Park, and nearby communities.",
  },
  {
    q: "Is the consultation really free?",
    a: "Yes. We come to your home, measure, show door styles and finishes, and leave you with a written estimate. No pressure and no obligation.",
  },
];

export function faqJsonLd(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
