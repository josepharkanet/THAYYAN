import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import Reveal from "@/components/site/Reveal";
import ProductCard from "@/components/site/ProductCard";
import ShareCatalog from "@/components/site/ShareCatalog";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; ready?: string }>;
}): Promise<Metadata> {
  const { ready } = await searchParams;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://stonicexport.com";
  const abs = (u?: string | null) =>
    u ? (u.startsWith("http") ? u : `${base}${u}`) : undefined;

  if (ready === "1") {
    // Preview the admin-set share image if any, else the first available product.
    const [first, settings] = await Promise.all([
      prisma.product.findFirst({
        where: { gallery: { some: { readyStock: true } } },
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
        select: { imageUrl: true },
      }),
      getSettings(),
    ]);
    const image = abs(settings.ogImage || first?.imageUrl);
    const title = "Ready Stock — Available Now | Stonic Export";
    const description =
      "In-stock marble, granite & natural stone slabs ready for immediate dispatch. See available sizes and enquire for the best price.";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: image ? [{ url: image }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  }

  return {
    title: "Products",
    description:
      "Browse our collection of premium Indian marble, granite (including Black Galaxy), Kota & Tandoor natural stone, and stone cladding.",
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; ready?: string }>;
}) {
  const { category, ready } = await searchParams;
  const readyMode = ready === "1";

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: {
        ...(category ? { categoryId: category } : {}),
        // Base the Ready Stock filter on actual available blocks, not the
        // derived product flag, so it stays correct no matter what.
        ...(readyMode ? { gallery: { some: { readyStock: true } } } : {}),
      },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
      include: {
        category: { select: { name: true } },
        gallery: {
          where: { readyStock: true },
          select: { id: true, qty: true, url: true },
          orderBy: { sortOrder: "asc" },
        },
        _count: { select: { gallery: true } },
      },
    }),
  ]);

  const active = categories.find((c) => c.id === category);

  return (
    <>
      {/* Header */}
      <section className="border-b border-line bg-paper-2/40 px-5 pb-14 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">{readyMode ? "Available now" : active ? "Collection" : "Our Collection"}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-[2.2rem] font-light leading-[1.04] text-ink sm:text-[3.1rem]">
            {readyMode ? "Ready Stock" : active ? active.name : "Premium Natural Stone"}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-2">
            {readyMode
              ? "In-stock material ready for immediate dispatch. Add the pieces you need to your enquiry list and send it to us — we'll reply with the best price."
              : active?.description ??
                "Explore our full range of Indian marble, granite, natural stone and cladding, each finished to strict export standards."}
          </p>
          {readyMode ? (
            <div className="mt-7">
              <ShareCatalog />
            </div>
          ) : null}
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-20 z-30 border-b border-line glass">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="-mx-1 flex gap-1 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <FilterChip href="/products" active={!category && !readyMode} label="All" />
            <FilterChip href="/products?ready=1" active={readyMode} label="Ready Stock" ready />
            {categories.map((c) => (
              <FilterChip
                key={c.id}
                href={`/products?category=${c.id}`}
                active={category === c.id && !readyMode}
                label={c.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-10 lg:px-12">
        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-3xl text-ink">Nothing here yet</p>
            <p className="mt-3 text-ink-2">
              Products for this category are coming soon.
            </p>
            <Link
              href="/products"
              className="link-underline mt-6 inline-block text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-ink"
            >
              View all products
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 90}>
                  <ProductCard
                    product={{
                      slug: p.slug,
                      name: p.name,
                      imageUrl: p.imageUrl,
                      description: p.description,
                      categoryName: p.category.name,
                      readyStock: p.gallery.length > 0,
                      readyBlocks: p.gallery.map((g) => ({ qty: g.qty, url: g.url })),
                      galleryCount: p._count.gallery,
                    }}
                  />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}

function FilterChip({
  href,
  active,
  label,
  ready,
}: {
  href: string;
  active: boolean;
  label: string;
  ready?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-5 py-2.5 text-[0.74rem] font-medium uppercase tracking-[0.12em] transition-colors",
        active
          ? ready
            ? "bg-sage text-white"
            : "bg-ink text-paper"
          : ready
            ? "text-sage ring-1 ring-inset ring-sage/40 hover:bg-sage/10"
            : "text-ink-2 hover:bg-ink/5 hover:text-ink",
      )}
    >
      {ready ? <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {label}
    </Link>
  );
}
