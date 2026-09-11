import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type CategoryCardData = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
};

export default function CategoryCard({
  category,
  index,
  className = "",
}: {
  category: CategoryCardData;
  index?: string;
  className?: string;
}) {
  return (
    <Link
      href={`/products?category=${category.id}`}
      className={`group relative block overflow-hidden ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={
          category.imageUrl ||
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200"
        }
        alt={category.name}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />

      {index ? (
        <span className="index-numeral absolute right-6 top-5 text-5xl text-white/25 sm:text-6xl">
          {index}
        </span>
      ) : null}

      <div className="relative flex h-full flex-col justify-end p-7 sm:p-9">
        <h3 className="font-serif text-[1.9rem] font-light leading-tight text-white sm:text-4xl">
          {category.name}
        </h3>
        {category.description ? (
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">
            {category.description}
          </p>
        ) : null}
        <span className="mt-5 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/90">
          <span className="h-px w-6 bg-white/60 transition-all duration-500 group-hover:w-12" />
          View Collection
          <ArrowRight size={15} className="transition-transform duration-500 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
