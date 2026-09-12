import {
  Mountain,
  Factory,
  Ship,
  Award,
  Globe2,
  Gem,
  Leaf,
  Wrench,
  Truck,
  Package,
  ShieldCheck,
} from "lucide-react";

// Icons available for Services & Values (selectable in the dashboard).
export const ICONS = {
  mountain: Mountain,
  factory: Factory,
  ship: Ship,
  award: Award,
  globe: Globe2,
  gem: Gem,
  leaf: Leaf,
  wrench: Wrench,
  truck: Truck,
  package: Package,
  shield: ShieldCheck,
} as const;
export type IconKey = keyof typeof ICONS;
export const ICON_KEYS = Object.keys(ICONS) as IconKey[];

export type ServiceItem = {
  id?: string;
  icon: string;
  subtitle: string;
  title: string;
  description: string;
  imageUrl: string;
  highlights: string[];
};

// Defaults ship with the site; the dashboard overrides these once edited.
export const SERVICE_DEFAULTS: ServiceItem[] = [
  {
    icon: "mountain",
    subtitle: "From the Source",
    title: "Quarry-Direct Sourcing",
    imageUrl: "/product-images/katni-marble/main.jpg",
    description:
      "True quality control begins at the source. Based in India's key stone hubs, including Kishangarh, our team regularly visits renowned quarries to handpick the finest raw blocks, eliminating middlemen to ensure premium quality and competitive pricing.",
    highlights: ["Kishangarh, India", "Handpicked Raw Blocks", "No Middlemen", "Competitive Pricing"],
  },
  {
    icon: "factory",
    subtitle: "State-of-the-Art Factories",
    title: "Precision Processing & Finishing",
    imageUrl: "/product-images/morwad-white-marble/main.jpg",
    description:
      "Carefully selected materials are brought to state-of-the-art factories, where they undergo precise cutting, polishing and finishing processes, every slab prepared to meet strict international export standards.",
    highlights: ["Precision Cutting", "Polishing & Finishing", "Export Standards", "Strict Quality Control"],
  },
  {
    icon: "ship",
    subtitle: "End-to-End Delivery",
    title: "Global Export & Logistics",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1400",
    description:
      "Delivering heavy natural stone across continents requires unparalleled logistics expertise. We adhere to robust wooden packaging protocols and international shipping standards, guaranteeing safe, secure and timely delivery to the Middle East and our new routes to China and Canada.",
    highlights: ["Wooden-Crate Packaging", "International Shipping", "Middle East & Beyond", "Safe, Timely Delivery"],
  },
];

export type ValueItem = {
  id?: string;
  icon: string;
  title: string;
  description: string;
};

export const VALUE_DEFAULTS: ValueItem[] = [
  { icon: "mountain", title: "Quarry-Direct", description: "Handpicked at the source across India, no middlemen, better value." },
  { icon: "globe", title: "Global Export Network", description: "Trusted supply across the Middle East, expanding to China & Canada." },
  { icon: "gem", title: "Export-Grade Quality", description: "Every slab finished to strict international standards." },
  { icon: "award", title: "12 Years of Expertise", description: "Over a decade sourcing and finishing the finest natural stone." },
];
