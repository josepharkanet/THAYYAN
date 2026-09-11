import type { Metadata } from "next";
import Link from "next/link";
import { Mountain, Factory, Ship, Check, ArrowRight, Globe2, Gem, Award } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { SERVICES, VALUES } from "@/lib/content";
import { whatsappLink } from "@/lib/utils";
import Reveal from "@/components/site/Reveal";
import SectionHeading from "@/components/site/SectionHeading";
import { WhatsAppIcon } from "@/components/site/icons";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Complete stone solutions from Stonic Export, global cemetery works, professional installation & fitting, and worldwide shipping & forwarding.",
};

const SERVICE_ICONS = { mountain: Mountain, factory: Factory, ship: Ship };
const VALUE_ICONS = { mountain: Mountain, globe: Globe2, gem: Gem, award: Award };

export default async function ServicesPage() {
  const [settings, categories] = await Promise.all([
    getSettings(),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="bg-ink px-5 pb-20 pt-36 text-center sm:px-8 sm:pt-44 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-sage">
            What We Offer
          </p>
          <h1 className="mt-5 font-serif text-[2.8rem] font-light leading-[1.02] text-paper sm:text-[4.2rem]">
            Our Services
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-paper/60">
            Complete stone solutions, from premium sourcing to professional
            installation and worldwide delivery.
          </p>
        </div>
      </section>

      {/* Specialized services */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <Reveal>
          <SectionHeading
            eyebrow="Specialised Services"
            title="Beyond just supply"
          />
        </Reveal>

        <div className="mt-16 space-y-20 sm:space-y-28">
          {SERVICES.map((s, index) => {
            const Icon = SERVICE_ICONS[s.icon];
            const flipped = index % 2 === 1;
            return (
              <Reveal
                key={s.id}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div className={flipped ? "lg:order-2" : ""}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className={flipped ? "lg:order-1" : ""}>
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage">
                      <Icon size={22} strokeWidth={1.4} />
                    </span>
                    <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-sage">
                      {s.subtitle}
                    </p>
                  </div>
                  <h3 className="mt-5 font-serif text-[2rem] leading-tight text-ink sm:text-[2.6rem]">
                    {s.title}
                  </h3>
                  <p className="mt-5 text-base leading-relaxed text-ink-2">{s.description}</p>
                  <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {s.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2.5 text-sm text-ink-2">
                        <Check size={16} className="shrink-0 text-sage" strokeWidth={2} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Product categories */}
      <section className="border-t border-line bg-paper-2/40">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <Reveal>
            <SectionHeading
              eyebrow="Our Products"
              title="A complete stone collection"
            />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <Reveal key={c.id} delay={(i % 3) * 80}>
                <Link
                  href={`/products?category=${c.id}`}
                  className="group block overflow-hidden bg-paper"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.imageUrl ?? ""}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4 p-6">
                    <div>
                      <h3 className="font-serif text-2xl text-ink">{c.name}</h3>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-2">
                        {c.description}
                      </p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="mt-1.5 shrink-0 text-ink-3 transition-all group-hover:translate-x-1 group-hover:text-sage"
                    />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <Reveal>
          <SectionHeading eyebrow="Why Stonic Export" title="Your trusted stone partner" />
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {VALUES.map((v, i) => {
            const Icon = VALUE_ICONS[v.icon];
            return (
              <Reveal key={v.title} delay={i * 90} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-soft text-sage">
                  <Icon size={24} strokeWidth={1.4} />
                </div>
                <h3 className="mt-6 font-serif text-2xl text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{v.description}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-28">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-serif text-[2.4rem] font-light leading-[1.05] text-paper sm:text-[3.2rem]">
              Ready to start your project?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-paper/60">
              Residential, commercial or large-scale, we combine precision,
              reliability and craftsmanship to bring your vision to life.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={whatsappLink(settings.whatsappNumber, "Hello Stonic Export! I'd like to discuss a project.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-whatsapp px-9 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:brightness-95"
              >
                <WhatsAppIcon size={19} /> Get a Quote
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-paper/25 px-9 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-paper/5"
              >
                Contact Us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
