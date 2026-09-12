import type { Metadata } from "next";
import Link from "next/link";
import { Mountain, Factory, Gem, Ship, User, MapPin } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { whatsappLink } from "@/lib/utils";
import Reveal from "@/components/site/Reveal";
import SectionHeading from "@/components/site/SectionHeading";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Stonic Export, years of excellence in natural stone exports. Founded by Shijo Thayyil, delivering premium Indian marble, granite and natural stone worldwide.",
};

const OFFERINGS = [
  { icon: Mountain, title: "Quarry-Direct Sourcing", description: "We handpick the finest raw blocks directly from India's quarries, cutting out middlemen for quality and value." },
  { icon: Factory, title: "In-House Processing", description: "Precise cutting, polishing and finishing in state-of-the-art factories, prepared to strict export standards." },
  { icon: Gem, title: "Export-Grade Quality", description: "Rigorous quality control on every slab, so what you order is exactly what arrives." },
  { icon: Ship, title: "Global Logistics", description: "Robust wooden-crate packaging and reliable international shipping across the Middle East and beyond." },
];

export default async function AboutPage() {
  const settings = await getSettings();
  const paragraphs = settings.aboutParagraphs.split("\n\n").filter(Boolean);
  const stats = [
    { k: settings.statYears, v: "Years of Excellence" },
    { k: settings.statProducts, v: "Stone Varieties" },
    { k: settings.statCountries, v: "Export Markets" },
    { k: settings.statQuality, v: "Quality Assured" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-paper-2/40 px-5 pb-16 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">About Us</p>
          <h1 className="mt-5 max-w-4xl font-serif text-[2.2rem] font-light leading-[1.04] text-ink sm:text-[3.1rem]">
            Crafting excellence since {settings.foundedYear}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg">
            {settings.siteName} is a premier source for premium Indian natural
            stone. With over 12 years of hands-on experience, we&rsquo;ve built a
            reputation for delivering exceptional marble, granite and natural stone
            to clients across the Middle East, and, increasingly, worldwide.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-14 sm:px-8 lg:grid-cols-4 lg:px-12">
          {stats.map((s) => (
            <div key={s.v} className="text-center">
              <p className="font-serif text-4xl text-paper sm:text-5xl">{s.k}</p>
              <p className="mt-2 text-[0.7rem] uppercase tracking-[0.16em] text-paper/50">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow">Our Story</p>
            <h2 className="mt-5 font-serif text-[2rem] font-light leading-[1.1] text-ink sm:text-[2.8rem]">
              {settings.aboutHeading}
            </h2>
            <div className="mt-7 space-y-4 text-base leading-relaxed text-ink-2">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.aboutImage}
                alt={settings.proprietorName}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-5 -left-4 bg-sage px-6 py-5 sm:-left-6">
              <p className="font-serif text-2xl text-white sm:text-3xl">{settings.proprietorName}</p>
              <p className="mt-0.5 text-[0.72rem] uppercase tracking-[0.16em] text-white/70">
                {settings.proprietorRole}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Offerings */}
      <section className="border-t border-line bg-paper-2/40">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <Reveal>
            <SectionHeading eyebrow="What We Offer" title="Complete stone solutions" />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {OFFERINGS.map((o, i) => (
              <Reveal key={o.title} delay={(i % 2) * 100}>
                <div className="flex h-full gap-5 bg-paper p-7">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage">
                    <o.icon size={22} strokeWidth={1.4} />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl text-ink">{o.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-2">{o.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact band */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="bg-ink p-8 sm:p-12 lg:p-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-[2rem] font-light leading-tight text-paper sm:text-[2.8rem]">
                Let&rsquo;s build something beautiful together
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-paper/60">
                Ready to transform your space with premium natural stone? Get in
                touch for a personalised consultation and quote.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <User size={20} className="text-sage" strokeWidth={1.5} />
                  <div>
                    <p className="text-[0.72rem] uppercase tracking-[0.14em] text-paper/45">Proprietor</p>
                    <p className="text-paper">{settings.proprietorName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin size={20} className="text-sage" strokeWidth={1.5} />
                  <div>
                    <p className="text-[0.72rem] uppercase tracking-[0.14em] text-paper/45">Location</p>
                    <p className="text-paper">{settings.address}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <a href={`tel:${settings.contactPhone1.replace(/\s/g, "")}`} className="font-serif text-3xl text-paper transition-colors hover:text-sage sm:text-4xl">
                {settings.contactPhone1}
              </a>
              <a href={`tel:${settings.contactPhone2.replace(/\s/g, "")}`} className="font-serif text-3xl text-paper transition-colors hover:text-sage sm:text-4xl">
                {settings.contactPhone2}
              </a>
              <a
                href={whatsappLink(settings.whatsappNumber, "Hello Stonic Export!")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 bg-whatsapp px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:brightness-95"
              >
                Chat on WhatsApp
              </a>
              <Link href="/contact" className="link-underline mt-1 text-[0.75rem] uppercase tracking-[0.14em] text-paper/50">
                More ways to reach us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
