import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { prisma } from "@/lib/db";

export default async function AdminWorksPage() {
  const works = await prisma.work.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h1 className="mt-3 font-serif text-4xl font-light text-ink">Works</h1>
          <p className="mt-2 text-ink-2">Completed projects shown on the Works page.</p>
        </div>
        <Link href="/admin/works/new" className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:bg-sage">
          <Plus size={16} /> Add project
        </Link>
      </div>

      <div className="mt-8 divide-y divide-line border border-line bg-surface">
        {works.map((w) => (
          <Link key={w.id} href={`/admin/works/${w.id}`} className="group flex items-center gap-4 p-4 transition-colors hover:bg-paper-2/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={w.imageUrl} alt="" className="h-14 w-20 shrink-0 object-cover" />
            <div className="min-w-0 flex-1">
              <p className="text-[0.66rem] uppercase tracking-[0.16em] text-sage">
                {w.category || "Project"}{w.location ? ` · ${w.location}` : ""}
              </p>
              <p className="flex items-center gap-2 truncate font-medium text-ink">
                {w.title}
                {w.featured ? <Star size={13} className="shrink-0 fill-sage text-sage" /> : null}
              </p>
            </div>
            <span className="hidden items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.12em] text-ink-3 transition-colors group-hover:text-ink sm:inline-flex">
              <Pencil size={14} /> Edit
            </span>
          </Link>
        ))}
        {works.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-ink-2">No projects yet.</p>
            <Link href="/admin/works/new" className="link-underline mt-3 inline-block text-sm uppercase tracking-[0.12em] text-ink">Add one</Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
