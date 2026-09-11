// Static marketing content shared between the Home and Services pages.
// (Products & categories are dynamic / DB-managed; this is editorial copy.)

export type ServiceItem = {
  id: string;
  icon: "mountain" | "factory" | "ship";
  title: string;
  subtitle: string;
  image: string;
  description: string;
  highlights: string[];
};

export const SERVICES: ServiceItem[] = [
  {
    id: "sourcing",
    icon: "mountain",
    title: "Quarry-Direct Sourcing",
    subtitle: "From the Source",
    image: "/product-images/katni-marble/main.jpg",
    description:
      "True quality control begins at the source. Based in India's key stone hubs, including Kishangarh, our team regularly visits renowned quarries to handpick the finest raw blocks — eliminating middlemen to ensure premium quality and competitive pricing.",
    highlights: [
      "Kishangarh, India",
      "Handpicked Raw Blocks",
      "No Middlemen",
      "Competitive Pricing",
    ],
  },
  {
    id: "processing",
    icon: "factory",
    title: "Precision Processing & Finishing",
    subtitle: "State-of-the-Art Factories",
    image: "/product-images/morwad-white-marble/main.jpg",
    description:
      "Carefully selected materials are brought to state-of-the-art factories, where they undergo precise cutting, polishing and finishing processes — every slab prepared to meet strict international export standards.",
    highlights: [
      "Precision Cutting",
      "Polishing & Finishing",
      "Export Standards",
      "Strict Quality Control",
    ],
  },
  {
    id: "logistics",
    icon: "ship",
    title: "Global Export & Logistics",
    subtitle: "End-to-End Delivery",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1400",
    description:
      "Delivering heavy natural stone across continents requires unparalleled logistics expertise. We adhere to robust wooden packaging protocols and international shipping standards — guaranteeing safe, secure and timely delivery to the Middle East and our new routes to China and Canada.",
    highlights: [
      "Wooden-Crate Packaging",
      "International Shipping",
      "Middle East & Beyond",
      "Safe, Timely Delivery",
    ],
  },
];

export type ValueItem = {
  icon: "mountain" | "globe" | "gem" | "award";
  title: string;
  description: string;
};

export const VALUES: ValueItem[] = [
  { icon: "mountain", title: "Quarry-Direct", description: "Handpicked at the source across India — no middlemen, better value." },
  { icon: "globe", title: "Global Export Network", description: "Trusted supply across the Middle East, expanding to China & Canada." },
  { icon: "gem", title: "Export-Grade Quality", description: "Every slab finished to strict international standards." },
  { icon: "award", title: "12 Years of Expertise", description: "Over a decade sourcing and finishing the finest natural stone." },
];
