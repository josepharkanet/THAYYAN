import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Homepage</p>
          <h1 className="mt-3 font-serif text-4xl font-light text-ink">Services</h1>
          <p className="mt-2 text-ink-2">The service cards shown on the home &amp; services pages.</p>
        </div>
        <Link href="/admin/services/new" className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:bg-sage">
          <Plus size={16} /> Add service
        </Link>
      </div>

      <div className="mt-8 divide-y divide-line border border-line bg-surface">
        {services.map((s) => (
          <Link key={s.id} href={`/admin/services/${s.id}`} className="group flex items-center gap-4 p-4 transition-colors hover:bg-paper-2/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.imageUrl} alt="" className="h-14 w-20 shrink-0 object-cover" />
            <div className="min-w-0 flex-1">
              <p className="text-[0.66rem] uppercase tracking-[0.16em] text-sage">{s.subtitle}</p>
              <p className="truncate font-medium text-ink">{s.title}</p>
            </div>
            <span className="hidden items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.12em] text-ink-3 transition-colors group-hover:text-ink sm:inline-flex">
              <Pencil size={14} /> Edit
            </span>
          </Link>
        ))}
        {services.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-ink-2">No services yet.</p>
            <Link href="/admin/services/new" className="link-underline mt-3 inline-block text-sm uppercase tracking-[0.12em] text-ink">Add one</Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
