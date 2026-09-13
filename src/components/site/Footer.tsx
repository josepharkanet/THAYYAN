import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";
import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from "./icons";

type FooterProps = {
  settings: SiteSettings;
  categories: { id: string; name: string }[];
};

export default function Footer({ settings, categories }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-paper/10 bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-20 sm:px-8 sm:pt-24 lg:px-12">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 lg:grid-cols-12 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Stonic Marble & Granite"
              className="h-9 w-auto brightness-0 invert"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/55">
              {settings.tagline}. Over 12 years of export excellence delivering
              premium marble, granite &amp; natural stone from India.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={whatsappLink(settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/15 text-paper/70 transition-colors hover:border-whatsapp hover:text-whatsapp"
              >
                <WhatsAppIcon size={18} />
              </a>
              {settings.instagramUrl ? (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/15 text-paper/70 transition-colors hover:border-paper hover:text-paper"
                >
                  <InstagramIcon size={18} />
                </a>
              ) : null}
              {settings.facebookUrl ? (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/15 text-paper/70 transition-colors hover:border-paper hover:text-paper"
                >
                  <FacebookIcon size={18} />
                </a>
              ) : null}
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1" />

          {/* Explore */}
          <div className="lg:col-span-2">
            <h4 className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-paper/40">
              Explore
            </h4>
            <ul className="mt-5 space-y-3.5 text-sm">
              {[
                { href: "/products", label: "Products" },
                { href: "/services", label: "Services" },
                { href: "/works", label: "Works" },
                { href: "/blog", label: "Blog" },
                { href: "/feedback", label: "Reviews" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-paper/60 transition-colors hover:text-paper"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collection */}
          <div className="lg:col-span-2">
            <h4 className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-paper/40">
              Collection
            </h4>
            <ul className="mt-5 space-y-3.5 text-sm">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/products?category=${c.id}`}
                    className="text-paper/60 transition-colors hover:text-paper"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-2 lg:col-span-3">
            <h4 className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-paper/40">
              Get in Touch
            </h4>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={17} strokeWidth={1.5} className="mt-0.5 shrink-0 text-sage" />
                <span className="text-paper/70">
                  <a href={`tel:${settings.contactPhone1.replace(/\s/g, "")}`} className="block transition-colors hover:text-paper">
                    {settings.contactPhone1}
                  </a>
                  {settings.contactPhone2 ? (
                    <a href={`tel:${settings.contactPhone2.replace(/\s/g, "")}`} className="block transition-colors hover:text-paper">
                      {settings.contactPhone2}
                    </a>
                  ) : null}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={17} strokeWidth={1.5} className="mt-0.5 shrink-0 text-sage" />
                <a href={`mailto:${settings.contactEmail}`} className="text-paper/70 transition-colors hover:text-paper">
                  {settings.contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={17} strokeWidth={1.5} className="mt-0.5 shrink-0 text-sage" />
                <span className="text-paper/70">{settings.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom credit bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-paper/10 pt-8 text-xs text-paper/40 sm:flex-row sm:items-center">
          <p>© {year} {settings.siteName} (Stonic Marbles &amp; Granites). All rights reserved.</p>
          <a
            href="https://arkanet.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-paper/40 transition-colors hover:text-paper/70"
          >
            Developed by : Arkanet Technologies <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}
