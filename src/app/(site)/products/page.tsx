import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import Reveal from "@/components/site/Reveal";
import ProductCard from "@/components/site/ProductCard";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse our collection of premium Rajasthan marble, granite (including Black Galaxy), Kota & Tandoor natural stone, and stone cladding.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: category ? { categoryId: category } : undefined,
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
      include: { category: { select: { name: true } } },
    }),
  ]);

  const active = categories.find((c) => c.id === category);

  return (
    <>
      {/* Header */}
      <section className="border-b border-line bg-paper-2/40 px-5 pb-14 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">{active ? "Collection" : "Our Collection"}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-[2.6rem] font-light leading-[1.02] text-ink sm:text-[4rem]">
            {active ? active.name : "Premium Natural Stone"}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-2">
            {active?.description ??
              "Explore our full range of Rajasthan marble, granite, natural stone and cladding — each finished to strict export standards."}
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-20 z-30 border-b border-line glass">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="-mx-1 flex gap-1 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <FilterChip href="/products" active={!category} label="All" />
            {categories.map((c) => (
              <FilterChip
                key={c.id}
                href={`/products?category=${c.id}`}
                active={category === c.id}
                label={c.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
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
            <p className="mb-10 text-[0.72rem] uppercase tracking-[0.16em] text-ink-3">
              {products.length} {products.length === 1 ? "item" : "items"}
            </p>
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
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "whitespace-nowrap rounded-full px-5 py-2.5 text-[0.74rem] font-medium uppercase tracking-[0.12em] transition-colors",
        active
          ? "bg-ink text-paper"
          : "text-ink-2 hover:bg-ink/5 hover:text-ink",
      )}
    >
      {label}
    </Link>
  );
}
