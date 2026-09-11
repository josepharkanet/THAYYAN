import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { prisma } from "@/lib/db";

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminBlogPage() {
  const posts = await prisma.post.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="mt-3 font-serif text-4xl font-light text-ink">Blog</h1>
          <p className="mt-2 text-ink-2">{posts.length} article{posts.length === 1 ? "" : "s"}.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:bg-sage"
        >
          <Plus size={16} /> Add post
        </Link>
      </div>

      <div className="mt-8 divide-y divide-line border border-line bg-surface">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/admin/blog/${p.id}`}
            className="group flex items-center gap-4 p-4 transition-colors hover:bg-paper-2/50"
          >
            <div className="h-14 w-20 shrink-0 overflow-hidden bg-paper-2">
              {p.coverImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={p.coverImage} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{p.title}</p>
              <p className="text-xs text-ink-3">{formatDate(p.publishedAt)}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.12em] ${
                p.published ? "text-sage" : "text-ink-3"
              }`}
            >
              {p.published ? <Eye size={13} /> : <EyeOff size={13} />}
              {p.published ? "Live" : "Draft"}
            </span>
            <span className="hidden items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.12em] text-ink-3 transition-colors group-hover:text-ink sm:inline-flex">
              <Pencil size={14} /> Edit
            </span>
          </Link>
        ))}
        {posts.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-ink-2">No posts yet.</p>
            <Link href="/admin/blog/new" className="link-underline mt-3 inline-block text-sm uppercase tracking-[0.12em] text-ink">
              Write your first post
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
