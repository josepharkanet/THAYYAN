import "server-only";
import { prisma } from "./db";

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
    "Direct from the quarries to the global market — uncompromising quality for over 12 years.",
  // Marketing hero uses polished stock imagery; real product photos live on the
  // product pages. Replaceable from the dashboard.
  heroImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000",

  // About
  aboutHeading: "Built on trust, quality and rigorous selection",
  aboutParagraphs: [
    "Under the visionary leadership of proprietor Shijo Thayyil, Stonic Marbles & Granites was built on a foundation of trust, quality and rigorous material selection. With over 12 years of hands-on experience, we have mastered the art of identifying top-tier natural stone directly from the source — eliminating middlemen to ensure premium quality and competitive pricing.",
    "We have established a strong, reliable export network across the Middle East, successfully supplying premium projects in Bahrain, Saudi Arabia, Kuwait and Qatar. Driven by a vision for global expansion, we are extending our operations to introduce our premium stone to markets in China and Canada.",
    "True quality control begins at the source. Based in India's key stone hubs, including Kishangarh, our team handpicks the finest raw blocks and finishes them in state-of-the-art factories to strict international export standards.",
  ].join("\n\n"),
  aboutImage: "https://images.unsplash.com/photo-1694378061058-bb6532de3bba?q=80&w=1200",

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
