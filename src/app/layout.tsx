import type { Metadata } from "next";
import { Montserrat, Manrope } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/settings";

// Geometric sans for headings (matches the brand collage; flat & modern).
const display = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.stonicexport.com";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  // Admin-controlled social share image; falls back to the built-in default.
  const share = settings.ogImage || "/hero-poster.jpg";
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Stonic Export · India's Finest Natural Stones",
      template: "%s · Stonic Export",
    },
    description:
      "Stonic Export (Stonic Marbles & Granites) supplies premium Indian marble, granite, Kota, Tandoor and natural stone worldwide, with 12+ years of quarry-direct export excellence.",
    keywords: [
      "Indian marble",
      "Kishangarh marble",
      "granite export India",
      "Black Galaxy granite",
      "Kota stone",
      "natural stone exporter",
      "marble exporter",
      "Stonic Export",
    ],
    openGraph: {
      type: "website",
      siteName: "Stonic Export",
      title: "Stonic Export · India's Finest Natural Stones",
      description:
        "Premium Indian marble, granite & natural stone, direct from the quarries to the global market.",
      url: siteUrl,
      images: [share],
    },
    twitter: {
      card: "summary_large_image",
      images: [share],
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
