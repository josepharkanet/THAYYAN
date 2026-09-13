import "server-only";
import { prisma } from "./db";
import { parseApplications } from "./utils";
import {
  SERVICE_DEFAULTS,
  VALUE_DEFAULTS,
  WORK_DEFAULTS,
  type ServiceItem,
  type ValueItem,
  type WorkItem,
} from "./content";

/**
 * Editable site content. Every value here can be overridden by Shijo from the
 * dashboard (Settings). Defaults ship with the site so it looks complete on
 * first run.
 */
export const SETTING_DEFAULTS = {
  siteName: "Stonic Export",
  tagline: "India's Finest Natural Stones",

  // Hero
  heroTitle: "Excellence in Indian Natural Stones",
  heroSubtitle:
    "Direct from the quarries to the global market, uncompromising quality for over 12 years.",
  // Marketing hero. If heroVideo is set it plays as the background; otherwise
  // heroImage shows. heroPoster is the still shown before the video loads.
  heroVideo: "/hero.mp4",
  heroPoster: "/hero-poster.jpg",
  heroImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000",

  // About
  aboutHeading: "Built on trust, quality and rigorous selection",
  aboutParagraphs: [
    "Under the visionary leadership of proprietor Shijo Thayyil, Stonic Marbles & Granites was built on a foundation of trust, quality and rigorous material selection. With over 12 years of hands-on experience, we have mastered the art of identifying top-tier natural stone directly from the source, eliminating middlemen to ensure premium quality and competitive pricing.",
    "We have established a strong, reliable export network across the Middle East, successfully supplying premium projects in Bahrain, Saudi Arabia, Kuwait and Qatar. Driven by a vision for global expansion, we are extending our operations to introduce our premium stone to markets in China and Canada.",
    "True quality control begins at the source. Based in India's key stone hubs, including Kishangarh, our team handpicks the finest raw blocks and finishes them in state-of-the-art factories to strict international export standards.",
  ].join("\n\n"),
  aboutImage: "/about/shijo-thayyil.jpg",

  proprietorName: "Shijo Thayyil",
  proprietorRole: "Proprietor",
  foundedYear: "2013",

  // Stats
  statYears: "12+",
  statProducts: "40+",
  statCountries: "4+",
  statQuality: "100%",

  // Contact
  contactPhone1: "+91 9544982471",
  contactPhone2: "+91 7559912233",
  contactEmail: "info@stonicexport.com",
  whatsappNumber: "919544982471",
  address: "Kishangarh, India",

  // Social
  instagramUrl: "",
  facebookUrl: "",

  // Social sharing — preview image used when links are shared (Open Graph).
  // Empty = fall back to the built-in default (/hero-poster.jpg).
  ogImage: "",
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;
export type SiteSettings = Record<SettingKey, string>;

/** Load all settings, layering DB overrides on top of the defaults. */
export async function getSettings(): Promise<SiteSettings> {
  const rows = await prisma.setting.findMany().catch(() => []);
  const overrides = new Map(rows.map((r) => [r.key, r.value]));

  const result = {} as SiteSettings;
  for (const key of Object.keys(SETTING_DEFAULTS) as SettingKey[]) {
    const dbValue = overrides.get(key);
    result[key] =
      dbValue !== undefined && dbValue !== null && dbValue !== ""
        ? dbValue
        : String(SETTING_DEFAULTS[key]);
  }
  return result;
}

/** Homepage/Services "Services", from the DB (falls back to defaults). */
export async function getServices(): Promise<ServiceItem[]> {
  const rows = await prisma.service
    .findMany({ orderBy: { sortOrder: "asc" } })
    .catch(() => []);
  if (rows.length === 0) return SERVICE_DEFAULTS;
  return rows.map((r) => ({
    id: r.id,
    icon: r.icon,
    subtitle: r.subtitle,
    title: r.title,
    description: r.description,
    imageUrl: r.imageUrl,
    highlights: parseApplications(r.highlights),
  }));
}

/** "Why choose us" value props, from the DB (falls back to defaults). */
export async function getValues(): Promise<ValueItem[]> {
  const rows = await prisma.value
    .findMany({ orderBy: { sortOrder: "asc" } })
    .catch(() => []);
  if (rows.length === 0) return VALUE_DEFAULTS;
  return rows.map((r) => ({
    id: r.id,
    icon: r.icon,
    title: r.title,
    description: r.description,
  }));
}

/** Completed projects for /works, from the DB (falls back to defaults). */
export async function getWorks(): Promise<WorkItem[]> {
  const rows = await prisma.work
    .findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] })
    .catch(() => []);
  if (rows.length === 0) return WORK_DEFAULTS;
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    location: r.location ?? "",
    year: r.year ?? "",
    description: r.description ?? "",
    imageUrl: r.imageUrl,
    gallery: parseApplications(r.gallery),
    featured: r.featured,
  }));
}
