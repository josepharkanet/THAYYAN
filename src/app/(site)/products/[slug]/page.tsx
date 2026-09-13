import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { parseApplications, whatsappLink } from "@/lib/utils";
import ProductGallery from "@/components/site/ProductGallery";
import ProductCard from "@/components/site/ProductCard";
import Reveal from "@/components/site/Reveal";
import { WhatsAppIcon } from "@/components/site/icons";

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      gallery: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.imageUrl ? [product.imageUrl] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProduct(slug), getSettings()]);
  if (!product) notFound();

  const applications = parseApplications(product.applications);
  const images = [product.imageUrl, ...product.gallery.map((g) => g.url)].filter(Boolean);
  const readyBlocks = product.gallery.filter((g) => g.readyStock);

  const blockWaLink = (refNo?: string | null, qty?: string | null) =>
    whatsappLink(
      settings.whatsappNumber,
      `Hello Stonic Export! I'm interested in ready-stock ${
        refNo ? `block ${refNo}` : "block"
      } of "${product.name}"${qty ? ` (${qty} available)` : ""}. Please share the price and details.`,
    );

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id } },
    orderBy: { sortOrder: "asc" },
    take: 3,
    include: { category: { select: { name: true } } },
  });

  const specs = [
    { label: "Origin", value: product.origin },
    { label: "Finish", value: product.finish },
    { label: "Thickness", value: product.thickness },
    { label: "Category", value: product.category.name },
  ].filter((s) => s.value);

  const waText = `Hello Stonic Export! I'm interested in "${product.name}". Please share pricing and availability.`;

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 sm:pt-36 lg:px-12">
        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.14em] text-ink-3">
          <Link href="/products" className="transition-colors hover:text-ink">Products</Link>
          <ChevronRight size={13} />
          <Link href={`/products?category=${product.categoryId}`} className="transition-colors hover:text-ink">
            {product.category.name}
          </Link>
          <ChevronRight size={13} />
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <ProductGallery images={images} alt={product.name} />

          {/* Details */}
          <div className="lg:py-4">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-sage">
              {product.category.name}
            </p>
            <h1 className="mt-3 font-serif text-[2rem] font-light leading-[1.08] text-ink sm:text-[2.7rem]">
              {product.name}
            </h1>
            {readyBlocks.length > 0 ? (
              <a
                href="#ready-stock"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-sage-soft px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-sage transition-colors hover:bg-sage hover:text-white"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {readyBlocks.length} block{readyBlocks.length > 1 ? "s" : ""} in ready stock
              </a>
            ) : null}
            {product.description ? (
              <p className="mt-6 text-base leading-relaxed text-ink-2">{product.description}</p>
            ) : null}

            {/* Specs */}
            {specs.length > 0 ? (
              <dl className="mt-8 divide-y divide-line border-y border-line">
                {specs.map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-3.5">
                    <dt className="text-[0.72rem] uppercase tracking-[0.16em] text-ink-3">{s.label}</dt>
                    <dd className="text-sm font-medium text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {/* Applications */}
            {applications.length > 0 ? (
              <div className="mt-8">
                <p className="text-[0.72rem] uppercase tracking-[0.16em] text-ink-3">Applications</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {applications.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-line bg-surface px-4 py-1.5 text-[0.78rem] text-ink-2"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* CTAs */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink(settings.whatsappNumber, waText)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2.5 bg-whatsapp px-7 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:brightness-95"
              >
                <WhatsAppIcon size={18} /> Enquire on WhatsApp
              </a>
              <a
                href={`mailto:${settings.contactEmail}?subject=${encodeURIComponent(`Enquiry: ${product.name}`)}`}
                className="inline-flex flex-1 items-center justify-center gap-2 border border-ink px-7 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Email Us
              </a>
            </div>
            <p className="mt-4 text-center text-xs text-ink-3 sm:text-left">
              Prices on request · Samples available · Worldwide shipping
            </p>
          </div>
        </div>
      </section>

      {/* Ready stock — available blocks */}
      {readyBlocks.length > 0 ? (
        <section id="ready-stock" className="scroll-mt-24 border-t border-line bg-sage-soft/30">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-sage" />
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-sage">
                Ready stock — available now
              </p>
            </div>
            <h2 className="mt-3 font-serif text-[1.8rem] font-light leading-tight text-ink sm:text-[2.3rem]">
              {product.name} — blocks available
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-2">
              These specific blocks are in stock right now. Quote the block number when you enquire and
              we&rsquo;ll confirm price &amp; dispatch.
            </p>
            <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {readyBlocks.map((b) => (
                <div key={b.id} className="overflow-hidden rounded-md border border-line bg-paper">
                  <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.url}
                      alt={b.refNo ? `${product.name} block ${b.refNo}` : product.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-sage px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white">
                      Available
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-serif text-xl text-ink">
                        {b.refNo ? `Block ${b.refNo}` : "Block"}
                      </p>
                      {b.qty ? <p className="text-sm font-semibold text-sage">{b.qty}</p> : null}
                    </div>
                    <a
                      href={blockWaLink(b.refNo, b.qty)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-ink px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-sage"
                    >
                      <WhatsAppIcon size={15} /> Enquire this block
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Related */}
      {related.length > 0 ? (
        <section className="border-t border-line bg-paper-2/40">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-serif text-[1.8rem] leading-tight text-ink sm:text-[2.4rem]">
                More in {product.category.name}
              </h2>
              <Link
                href={`/products?category=${product.categoryId}`}
                className="link-underline hidden items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-ink sm:inline-flex"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{
                    slug: p.slug,
                    name: p.name,
                    imageUrl: p.imageUrl,
                    description: p.description,
                    categoryName: p.category.name,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-ink-2 transition-colors hover:text-ink"
        >
          <ArrowLeft size={15} /> Back to all products
        </Link>
      </div>
    </>
  );
}
