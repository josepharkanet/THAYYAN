"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn, whatsappLink } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/works", label: "Works" },
  { href: "/blog", label: "Blog" },
  { href: "/feedback", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Header({
  siteName = "Stonic",
  whatsappNumber = "919544982471",
}: {
  siteName?: string;
  whatsappNumber?: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const transparentOnTop = pathname === "/";
  const light = transparentOnTop && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-500",
        light
          ? "border-white/15 bg-transparent"
          : "glass border-line/70",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setOpen(false)}
          aria-label={siteName}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Stonic Marble & Granite"
            className={cn(
              "h-8 w-auto transition-all sm:h-9",
              light && "brightness-0 invert",
            )}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "link-underline text-[0.78rem] font-medium uppercase tracking-[0.14em] transition-colors",
                light
                  ? "text-white/85 hover:text-white"
                  : isActive(item.href)
                    ? "text-ink"
                    : "text-ink-2 hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href={whatsappLink(
              whatsappNumber,
              "Hello Stonic Export! I'm interested in your natural stones.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "hidden items-center gap-2 rounded-xs px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] transition-all sm:inline-flex",
              light
                ? "bg-white text-ink hover:bg-white/90"
                : "bg-ink text-paper hover:bg-sage",
            )}
          >
            Enquire
          </a>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "-mr-2 inline-flex h-10 w-10 items-center justify-center transition-colors md:hidden",
              light ? "text-white" : "text-ink",
            )}
          >
            {open ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-line bg-paper transition-[max-height] duration-500 ease-out md:hidden",
          open ? "max-h-[80vh] border-b" : "max-h-0",
        )}
      >
        <nav className="flex flex-col px-5 py-4 sm:px-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "border-b border-line/60 py-4 font-serif text-2xl transition-colors last:border-0",
                isActive(item.href) ? "text-sage" : "text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={whatsappLink(whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center gap-2 bg-ink px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-paper"
          >
            Enquire on WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
