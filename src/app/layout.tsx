import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.stonicexport.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Stonic Export — India's Finest Natural Stones",
    template: "%s — Stonic Export",
  },
  description:
    "Stonic Export (Stonic Marbles & Granites) supplies premium Indian marble, granite, Kota, Tandoor and natural stone worldwide — 12+ years of quarry-direct export excellence.",
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
    title: "Stonic Export — India's Finest Natural Stones",
    description:
      "Premium Indian marble, granite & natural stone — direct from the quarries to the global market.",
    url: siteUrl,
    images: ["/hero.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
