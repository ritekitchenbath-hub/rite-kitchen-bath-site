export type Area = {
  slug: string;
  name: string;
  county: string;
  headline: string;
  intro: string;
  body: string[];
  neighborhoods: string[];
  nearby: string[];
};

export const areas: Area[] = [
  {
    slug: "bradenton",
    name: "Bradenton",
    county: "Manatee County",
    headline: "Cabinet Refacing & Custom Cabinetry in Bradenton, FL",
    intro:
      "Rite Kitchen & Bath is based in Bradenton, and most of our work happens right here—from waterfront condos on Perico Bay to family homes in Braden River. If your cabinets are solid but dated, we can make your kitchen or bath look brand new in days, not months.",
    body: [
      "Many Bradenton homes were built in the '80s, '90s, and early 2000s with oak or builder-grade cabinets that are still structurally sound. Refacing or refinishing lets you keep those boxes, skip the demolition, and put your budget toward the parts you actually see and touch every day.",
      "We use finishes and materials chosen for Gulf Coast humidity, protect your floors and counters while we work, and clean up every day before we leave.",
    ],
    neighborhoods: [
      "West Bradenton",
      "Palma Sola",
      "Braden River",
      "Bayshore Gardens",
      "Whitfield",
      "Downtown & Riverwalk",
      "Perico Bay",
      "IMG Academy area",
    ],
    nearby: ["Palmetto", "Ellenton", "Lakewood Ranch", "Anna Maria Island"],
  },
  {
    slug: "sarasota",
    name: "Sarasota",
    county: "Sarasota County",
    headline: "Kitchen Cabinet Refacing & Refinishing in Sarasota, FL",
    intro:
      "From mid-century homes near Southside Village to new construction off University Parkway, Sarasota homeowners call us when they want a kitchen or bath update without the cost and mess of a full remodel.",
    body: [
      "Cabinet refacing replaces your doors, drawer fronts, and hardware and refinishes the frames to match—so the kitchen looks new while your countertops, plumbing, and layout stay put. For condos with HOA work-hour rules, a short install window makes a big difference.",
      "Prefer to change the layout? We also design and install custom cabinetry, pantry systems, and vanities sized to your space.",
    ],
    neighborhoods: [
      "Downtown Sarasota",
      "Southside Village",
      "The Meadows",
      "Palmer Ranch",
      "Gulf Gate",
      "Siesta Key",
      "University Park",
      "Lido & St. Armands",
    ],
    nearby: ["Lakewood Ranch", "Longboat Key", "Osprey", "Bradenton"],
  },
  {
    slug: "st-petersburg",
    name: "St. Petersburg",
    county: "Pinellas County",
    headline: "Cabinet Refacing & Kitchen Cabinet Updates in St. Petersburg, FL",
    intro:
      "St. Petersburg bungalows, mid-century ranches, and downtown condos all have one thing in common: kitchens that deserve better cabinets. We bring refacing, refinishing, and custom cabinetry across the Skyway to homeowners throughout St. Petersburg.",
    body: [
      "Older St. Petersburg homes often have tight or unusual kitchen layouts. Refacing keeps what fits and refreshes what shows, while custom pieces—tall pantries, open shelving, coffee bars—make the most of every inch.",
      "For condo buildings, we plan around elevator reservations, parking, and quiet hours so the project runs smoothly for you and your neighbors.",
    ],
    neighborhoods: [
      "Old Northeast",
      "Kenwood",
      "Crescent Lake",
      "Snell Isle",
      "Downtown St. Pete",
      "Shore Acres",
      "Historic Uptown",
      "Pasadena",
    ],
    nearby: ["Gulfport", "Pinellas Park", "Treasure Island", "St. Pete Beach"],
  },
  {
    slug: "parrish",
    name: "Parrish",
    county: "Manatee County",
    headline: "Custom Cabinetry & Cabinet Upgrades in Parrish, FL",
    intro:
      "Parrish is growing fast, and many newer homes came with basic builder-grade cabinets. We help Parrish homeowners upgrade to the kitchen and baths they actually wanted—without starting over.",
    body: [
      "Common Parrish projects include adding crown molding and taller uppers, converting a builder island into a statement piece, painting or refacing builder oak, and swapping in soft-close hardware throughout.",
      "We also build out pantries, laundry rooms, drop zones, and garage cabinetry so the whole house works better day to day.",
    ],
    neighborhoods: [
      "North River Ranch",
      "Silverleaf",
      "Copperstone",
      "Harrison Ranch",
      "Crosswind Point",
      "Twin Rivers",
      "Kingsfield",
      "Forest Creek",
    ],
    nearby: ["Ellenton", "Palmetto", "Lakewood Ranch", "Bradenton"],
  },
];

export function getArea(slug: string) {
  return areas.find((a) => a.slug === slug);
}
