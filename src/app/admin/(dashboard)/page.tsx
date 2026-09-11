import Link from "next/link";
import { Plus, Package, Layers, Settings, ArrowRight, Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await requireSession();
  const [products, categories, featured, recent] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({ where: { featured: true } }),
    prisma.product.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { category: { select: { name: true } } },
    }),
  ]);

  const stats = [
    { label: "Products", value: products, icon: Package, href: "/admin/products" },
    { label: "Categories", value: categories, icon: Layers, href: "/admin/categories" },
    { label: "Featured", value: featured, icon: Star, href: "/admin/products" },
  ];

  const firstName = session.name.split(" ")[0] || "there";

  return (
    <div>
      <p className="eyebrow">Dashboard</p>
      <h1 className="mt-3 font-serif text-4xl font-light text-ink">
        Welcome back, {firstName}
      </h1>
      <p className="mt-2 text-ink-2">Here&rsquo;s what&rsquo;s on your website right now.</p>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group flex items-center justify-between border border-line bg-surface p-6 transition-colors hover:border-ink/30"
          >
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.16em] text-ink-3">{s.label}</p>
              <p className="mt-1 font-serif text-4xl text-ink">{s.value}</p>
            </div>
            <s.icon size={26} strokeWidth={1.4} className="text-ink-3 transition-colors group-hover:text-sage" />
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink-3">
          Quick actions
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <QuickAction href="/admin/products/new" icon={Plus} title="Add a product" desc="Create a new catalogue item" />
          <QuickAction href="/admin/categories" icon={Layers} title="Manage categories" desc="Organise your collection" />
          <QuickAction href="/admin/settings" icon={Settings} title="Edit site content" desc="Hero, about, contact details" />
        </div>
      </div>

      {/* Recent products */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink-3">
            Recently updated
          </h2>
          <Link href="/admin/products" className="link-underline text-[0.75rem] uppercase tracking-[0.12em] text-ink">
            All products
          </Link>
        </div>
        <div className="mt-4 divide-y divide-line border border-line bg-surface">
          {recent.map((p) => (
            <Link
              key={p.id}
              href={`/admin/products/${p.id}`}
              className="group flex items-center gap-4 p-4 transition-colors hover:bg-paper-2/50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.imageUrl} alt="" className="h-12 w-12 shrink-0 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{p.name}</p>
                <p className="text-xs text-ink-3">{p.category.name}</p>
              </div>
              {p.featured ? (
                <Star size={15} className="fill-sage text-sage" />
              ) : null}
              <ArrowRight size={16} className="text-ink-3 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
          {recent.length === 0 ? (
            <p className="p-6 text-sm text-ink-3">No products yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <Link href={href} className="group border border-line bg-surface p-5 transition-colors hover:border-ink/30">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-soft text-sage">
        <Icon size={18} strokeWidth={1.6} />
      </span>
      <p className="mt-4 font-medium text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-2">{desc}</p>
    </Link>
  );
}
