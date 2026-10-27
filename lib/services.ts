export type Service = {
  id: string;
  title: string;
  summary: string;
  details: string[];
};

export const services: Service[] = [
  {
    id: "cabinet-refacing",
    title: "Cabinet Refacing",
    summary:
      "Keep your sturdy cabinet boxes and get a brand-new look. We replace doors and drawer fronts, cover the frames to match, and upgrade the hardware—typically for a fraction of the cost of full replacement.",
    details: [
      "New solid-wood or painted shaker, slab, and raised-panel doors",
      "Matching veneer or factory-style finish on exposed frames",
      "Most kitchens completed in about 3–5 working days",
      "No demolition, no countertop removal in most cases",
    ],
  },
  {
    id: "cabinet-refinishing",
    title: "Cabinet Refinishing & Painting",
    summary:
      "Love your layout but not the color? We clean, degloss, prime, and spray a durable catalyzed finish built to stand up to Florida humidity and daily use.",
    details: [
      "Spray-applied, furniture-grade finish—no brush marks",
      "Careful masking and protection of floors and counters",
      "Color matching and two-tone island options",
    ],
  },
  {
    id: "custom-cabinetry",
    title: "Custom Cabinetry",
    summary:
      "When the layout needs to change, we design and install new cabinetry sized to your space—kitchens, pantries, laundry rooms, built-ins, and entertainment walls.",
    details: [
      "Measured, designed, and installed by one team",
      "Pull-out organizers, pantry systems, and appliance garages",
      "Crown, light rail, scribe, and finished end panels",
    ],
  },
  {
    id: "bathroom-vanities",
    title: "Bathroom Vanities",
    summary:
      "Replace a dated vanity with a custom or semi-custom unit—double vanities, floating vanities, linen towers, and makeup stations—finished to match the rest of your home.",
    details: [
      "Standard, double, and wall-mounted (floating) vanities",
      "Coordinated mirrors, lighting, and hardware",
      "Moisture-resistant materials for Florida bathrooms",
    ],
  },
  {
    id: "hardware-upgrades",
    title: "Hardware & Soft-Close Upgrades",
    summary:
      "Small changes, big difference. New pulls and knobs, soft-close hinges, and full-extension drawer slides make older cabinets feel new.",
    details: [
      "Pulls and knobs in brass, matte black, nickel, and more",
      "Soft-close hinge and drawer slide retrofits",
      "Precise layout with jigs so every pull lines up",
    ],
  },
  {
    id: "repairs",
    title: "Repairs & Adjustments",
    summary:
      "Sagging doors, sticking drawers, water-damaged sink bases, and touch-ups—we fix the problems so your cabinets work the way they should.",
    details: [
      "Hinge, slide, and alignment adjustments",
      "Sink base and toe-kick repairs after leaks",
      "Finish touch-ups and color matching",
    ],
  },
];
