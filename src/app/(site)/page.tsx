import Link from "next/link";
import { ArrowRight, ArrowUpRight, ArrowDown, Award, Globe2, Gem, Mountain } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { SERVICES, VALUES } from "@/lib/content";
import { whatsappLink } from "@/lib/utils";
import Reveal from "@/components/site/Reveal";
import SectionHeading from "@/components/site/SectionHeading";
import ProductCard from "@/components/site/ProductCard";
import Marquee from "@/components/site/Marquee";
import { WhatsAppIcon } from "@/components/site/icons";

const VALUE_ICONS = { mountain: Mountain, globe: Globe2, gem: Gem, award: Award };

export default async function HomePage() {
  const [settings, categories, featured] = await Promise.all([
    getSettings(),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: { featured: true },
      orderBy: { sortOrder: "asc" },
      take: 3,
      include: { category: { select: { name: true } } },
    }),
  ]);

  return (
    <>
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/25 to-ink/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/10 to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-28 pt-32 sm:px-8 lg:px-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 text-[0.66rem] font-medium uppercase tracking-[0.28em] text-white/65">
              <span>Est. {settings.foundedYear}</span>
              <span className="h-px w-8 bg-white/30" />
              <span>Kishangarh · India</span>
            </div>
            <h1 className="mt-6 font-serif text-[2.6rem] font-light leading-[0.98] text-white sm:text-[3.7rem] lg:text-[4.6rem]">
              {settings.heroTitle}
            </h1>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
              {settings.heroSubtitle}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 bg-white px-8 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-sage hover:text-white"
              >
                Explore Collection
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 border border-white/50 px-8 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Hero bottom strip */}
        <div className="absolute inset-x-0 bottom-0 hidden border-t border-white/15 backdrop-blur-sm md:block">
          <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-white/15 px-5 sm:px-8 lg:px-12">
            {[
              { k: `${settings.statYears}`, v: "Years of Excellence" },
              { k: `${settings.statCountries}`, v: "Export Markets" },
              { k: "Worldwide", v: "Shipping & Forwarding" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col justify-center gap-1.5 py-6 pl-6 first:pl-0 sm:py-7 sm:[&:not(:first-child)]:pl-10">
                <span className="font-serif text-2xl leading-none text-white sm:text-[1.7rem]">{s.k}</span>
                <span className="text-[0.68rem] uppercase leading-tight tracking-[0.16em] text-white/55">{s.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-28 right-6 hidden animate-bounce text-white/50 lg:block">
          <ArrowDown size={20} strokeWidth={1.5} />
        </div>
      </section>

      {/* Marquee */}
      <Marquee />

      {/* ───────────────────────── Intro ───────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-sage/50" />
              <p className="eyebrow">Since {settings.foundedYear}</p>
            </div>
            <h2 className="mt-6 font-serif text-[2.1rem] font-light leading-[1.05] text-ink sm:text-[3rem]">
              We bring the timeless beauty of India&rsquo;s natural stone to the world.
            </h2>
          </Reveal>
          <Reveal className="flex flex-col justify-end lg:col-span-4 lg:col-start-9" delay={120}>
            <p className="text-base leading-relaxed text-ink-2">
              Direct from India&rsquo;s finest quarries to projects worldwide, {settings.siteName}{" "}
              delivers marble, granite and natural stone with complete, end-to-end care,
              from handpicked sourcing and in-house finishing to global export.
            </p>
            <Link
              href="/about"
              className="link-underline mt-6 inline-flex w-fit items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-ink"
            >
              Our Story <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>

        {/* Stats */}
        <Reveal className="mt-16 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:mt-24 lg:grid-cols-4">
          {[
            { k: settings.statYears, v: "Years of Excellence" },
            { k: settings.statProducts, v: "Stone Varieties" },
            { k: settings.statCountries, v: "Export Markets" },
            { k: settings.statQuality, v: "Quality Assured" },
          ].map((s, i) => (
            <div key={i} className="bg-paper px-6 py-10 text-center sm:py-14">
              <p className="font-serif text-5xl font-light text-ink sm:text-6xl">{s.k}</p>
              <p className="mt-3 text-[0.72rem] uppercase tracking-[0.18em] text-ink-3">{s.v}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ─────────────────────── Categories ─────────────────────── */}
      <section className="border-t border-line bg-paper-2/40">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="The Collection"
              title="Four collections, one standard"
              description="A curated range of premium Indian stone: marble, granite, natural stones and cladding."
            />
          </Reveal>
          <Reveal className="mt-12 border-t border-line-2">
            {categories.map((c, i) => (
              <Link
                key={c.id}
                href={`/products?category=${c.id}`}
                className="group flex items-center gap-5 border-b border-line-2 py-6 sm:gap-8 sm:py-8"
              >
                <span className="index-numeral w-9 shrink-0 text-2xl text-ink-3 transition-colors group-hover:text-sage sm:w-16 sm:text-3xl">
                  0{i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-[1.7rem] font-light leading-none text-ink transition-colors group-hover:text-sage sm:text-[3rem]">
                    {c.name}
                  </h3>
                  <p className="mt-2 hidden max-w-md text-sm leading-relaxed text-ink-2 sm:block">
                    {c.description}
                  </p>
                </div>
                <div className="relative h-16 w-24 shrink-0 overflow-hidden bg-paper-2 sm:h-24 sm:w-40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.imageUrl ?? ""}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
                <ArrowUpRight
                  size={26}
                  className="hidden shrink-0 text-ink-3 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-sage sm:block"
                />
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ──────────────────────── Featured ──────────────────────── */}
      {featured.length > 0 ? (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-sage/50" />
                <p className="eyebrow">Featured</p>
              </div>
              <h2 className="mt-5 font-serif text-[1.9rem] font-light leading-tight text-ink sm:text-[2.6rem]">
                Signature selections
              </h2>
            </div>
            <Link
              href="/products"
              className="link-underline inline-flex w-fit items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-ink"
            >
              View All Products <ArrowRight size={15} />
            </Link>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <ProductCard
                  product={{
                    slug: p.slug,
                    name: p.name,
                    imageUrl: p.imageUrl,
                    description: p.description,
                    categoryName: p.category.name,
                  }}
                />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* ──────────────────────── Services ──────────────────────── */}
      <section className="border-t border-line bg-paper-2/40">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="What We Do"
              title="More than a supplier"
              description="Complete stone solutions: from quarry-direct sourcing and precision finishing to worldwide export."
            />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} delay={i * 100}>
                <Link href="/services" className="group block bg-paper">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                    <span className="index-numeral absolute left-4 top-3 text-4xl text-white/80">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-sage">
                      {s.subtitle}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl text-ink">{s.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-2">
                      {s.description}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── Values ───────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {VALUES.map((v, i) => {
            const Icon = VALUE_ICONS[v.icon];
            return (
              <Reveal key={v.title} delay={i * 90} className="text-center lg:text-left">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-soft text-sage lg:mx-0">
                  <Icon size={24} strokeWidth={1.4} />
                </div>
                <h3 className="mt-6 font-serif text-2xl text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{v.description}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────── CTA ─────────────────────────── */}
      <section className="bg-ink">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-32">
          <Reveal>
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-sage">
              Let&rsquo;s Work Together
            </p>
            <h2 className="mx-auto mt-5 max-w-2xl font-serif text-[2.1rem] font-light leading-[1.05] text-paper sm:text-[2.9rem]">
              Ready to transform your space?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-paper/60">
              Message us on WhatsApp for personalised assistance, pricing and samples.
              We typically reply within the hour.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={whatsappLink(
                  settings.whatsappNumber,
                  "Hello Stonic Export! I'm interested in your premium natural stones.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-whatsapp px-9 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:brightness-95"
              >
                <WhatsAppIcon size={19} /> Chat on WhatsApp
              </a>
              <a
                href={`tel:${settings.contactPhone1.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 border border-paper/25 px-9 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-paper/5"
              >
                {settings.contactPhone1}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
