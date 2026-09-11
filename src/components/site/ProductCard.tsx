import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type ProductCardData = {
  slug: string;
  name: string;
  imageUrl: string;
  description?: string | null;
  categoryName?: string;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
    >
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
        <div className="absolute right-4 top-4 flex h-10 w-10 translate-y-1 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={18} strokeWidth={1.5} />
        </div>
      </div>
      <div className="pt-5">
        {product.categoryName ? (
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-sage">
            {product.categoryName}
          </p>
        ) : null}
        <h3 className="mt-2 font-serif text-2xl text-ink transition-colors group-hover:text-sage">
          {product.name}
        </h3>
        {product.description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-2">
            {product.description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
