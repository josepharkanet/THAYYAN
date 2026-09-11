"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";
import { upsertPost, deletePost } from "@/app/admin/actions";
import { ImageUpload } from "./ImageUpload";

export type PostFormData = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  keywords: string;
  published: boolean;
};

const inputCls =
  "w-full border border-line bg-surface px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-sage";
const labelCls = "text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-3";

export default function BlogForm({ post }: { post?: PostFormData }) {
  const router = useRouter();
  const isEdit = Boolean(post?.id);

  const [form, setForm] = useState<PostFormData>(
    post ?? {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      keywords: "",
      published: true,
    },
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof PostFormData>(key: K, value: PostFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("Please enter a title.");
    if (!form.content.trim()) return setError("Please write some content.");
    setSaving(true);
    try {
      await upsertPost({ ...form, id: post?.id });
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the post.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!post?.id) return;
    if (!confirm(`Delete “${form.title}”? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deletePost(post.id);
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Could not delete the post.");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.14em] text-ink-3 transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} /> Blog
          </Link>
          <h1 className="mt-2 font-serif text-3xl font-light text-ink">
            {isEdit ? "Edit post" : "New post"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {isEdit ? (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 border border-red-300 px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              <Trash2 size={15} /> Delete
            </button>
          ) : null}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-ink px-6 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:bg-sage disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : null}
            {saving ? "Saving…" : "Save post"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-6 border-l-2 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <label className={labelCls} htmlFor="b-title">Title</label>
            <input
              id="b-title"
              className={`${inputCls} mt-2`}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Marble Price in Kerala (2026)"
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="b-excerpt">Excerpt (summary)</label>
            <textarea
              id="b-excerpt"
              rows={2}
              className={`${inputCls} mt-2 resize-y`}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="One or two sentences shown in listings and search results."
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="b-content">Content (Markdown)</label>
            <textarea
              id="b-content"
              rows={20}
              className={`${inputCls} mt-2 resize-y font-mono text-sm`}
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder={"Write in Markdown.\n\n## A heading\n\nA paragraph with **bold** text and a [link](/products).\n\n- A bullet\n- Another bullet"}
            />
            <p className="mt-1 text-xs text-ink-3">
              Supports Markdown: <code># Heading</code>, <code>**bold**</code>,
              <code> [text](/link)</code>, <code>- lists</code>.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-line bg-surface p-5">
            <label className="flex cursor-pointer items-center justify-between">
              <span>
                <span className="block font-medium text-ink">Published</span>
                <span className="text-xs text-ink-3">Visible on the website</span>
              </span>
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => set("published", e.target.checked)}
                className="h-5 w-5 accent-sage"
              />
            </label>
          </div>

          <div className="border border-line bg-surface p-5">
            <label className={labelCls}>Cover image</label>
            <div className="mt-3">
              <ImageUpload value={form.coverImage} onChange={(url) => set("coverImage", url)} />
            </div>
          </div>

          <div className="border border-line bg-surface p-5">
            <label className={labelCls} htmlFor="b-keywords">SEO keywords</label>
            <input
              id="b-keywords"
              className={`${inputCls} mt-2`}
              value={form.keywords}
              onChange={(e) => set("keywords", e.target.value)}
              placeholder="marble price kerala, marble flooring"
            />
            <p className="mt-1 text-xs text-ink-3">Comma-separated.</p>
          </div>

          <div className="border border-line bg-surface p-5">
            <label className={labelCls} htmlFor="b-slug">URL slug (optional)</label>
            <input
              id="b-slug"
              className={`${inputCls} mt-2`}
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="auto from title"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
