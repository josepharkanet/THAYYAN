import Link from "next/link";
import { Plus, Star, Pencil, PackageCheck } from "lucide-react";
import { prisma } from "@/lib/db";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      category: { select: { name: true } },
      gallery: { where: { readyStock: true }, select: { id: true } },
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1 className="mt-3 font-serif text-4xl font-light text-ink">Products</h1>
          <p className="mt-2 text-ink-2">{products.length} items in your collection.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:bg-sage"
        >
          <Plus size={16} /> Add product
        </Link>
      </div>

      <div className="mt-8 divide-y divide-line border border-line bg-surface">
        {products.map((p) => (
          <div
            key={p.id}
            className="group flex items-center gap-4 p-4 transition-colors hover:bg-paper-2/50"
          >
            <Link href={`/admin/products/${p.id}`} className="flex min-w-0 flex-1 items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.imageUrl} alt="" className="h-14 w-14 shrink-0 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 truncate font-medium text-ink">
                  {p.name}
                  {p.featured ? <Star size={14} className="fill-sage text-sage" /> : null}
                </p>
                <p className="text-xs uppercase tracking-[0.1em] text-ink-3">{p.category.name}</p>
              </div>
            </Link>
            {p.gallery.length > 0 ? (
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-sage/50 bg-sage-soft px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-sage">
                <PackageCheck size={13} /> {p.gallery.length} in stock
              </span>
            ) : null}
            <Link
              href={`/admin/products/${p.id}`}
              className="hidden items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.12em] text-ink-3 transition-colors hover:text-ink sm:inline-flex"
            >
              <Pencil size={14} /> Edit
            </Link>
          </div>
        ))}
        {products.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-ink-2">No products yet.</p>
            <Link href="/admin/products/new" className="link-underline mt-3 inline-block text-sm uppercase tracking-[0.12em] text-ink">
              Add your first product
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
