import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type ProductCardData = {
  slug: string;
  name: string;
  imageUrl: string;
  description?: string | null;
  categoryName?: string;
  readyStock?: boolean;
  /** When set (Ready Stock view), the available slabs/blocks with their Sqft. */
  readyBlocks?: { qty: string | null }[];
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const href = `/products/${product.slug}`;
  return (
    <div className="group relative">
      <div className="relative aspect-square overflow-hidden bg-paper-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {/* Navigation overlay */}
        <Link href={href} className="absolute inset-0" aria-label={product.name} />
        {product.readyStock ? (
          <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-sage px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white">
            Ready Stock
          </span>
        ) : null}
        <div className="pointer-events-none absolute right-4 top-4 flex h-10 w-10 translate-y-1 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={18} strokeWidth={1.5} />
        </div>
      </div>
      <Link href={href} className="block pt-5">
        {product.categoryName ? (
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-sage">
            {product.categoryName}
          </p>
        ) : null}
        <h3 className="mt-2 font-serif text-2xl text-ink transition-colors group-hover:text-sage">
          {product.name}
        </h3>
        {product.readyBlocks && product.readyBlocks.length > 0 ? (
          <div className="mt-3">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-ink-3">
              {product.readyBlocks.length} {product.readyBlocks.length === 1 ? "slab" : "slabs"} available
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {product.readyBlocks.map((b, i) => (
                <span
                  key={i}
                  className="rounded-full bg-sage-soft px-2.5 py-1 text-[0.72rem] font-semibold text-sage"
                >
                  {b.qty ? `${b.qty} Sqft` : "Available"}
                </span>
              ))}
            </div>
          </div>
        ) : product.description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-2">
            {product.description}
          </p>
        ) : null}
      </Link>
    </div>
  );
}
