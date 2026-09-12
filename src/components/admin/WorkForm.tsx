"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";
import { upsertWork, deleteWork } from "@/app/admin/actions";
import { ImageUpload, GalleryUpload } from "./ImageUpload";

export type WorkFormData = {
  id?: string;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  featured: boolean;
  sortOrder: number;
};

const inputCls =
  "w-full border border-line bg-surface px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-sage";
const labelCls = "text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-3";

export default function WorkForm({ work }: { work?: WorkFormData }) {
  const router = useRouter();
  const isEdit = Boolean(work?.id);

  const [form, setForm] = useState<WorkFormData>(
    work ?? {
      title: "",
      category: "",
      location: "",
      year: "",
      description: "",
      imageUrl: "",
      gallery: [],
      featured: false,
      sortOrder: 0,
    },
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof WorkFormData>(key: K, value: WorkFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("Please enter a project title.");
    if (!form.imageUrl) return setError("Please add a cover image.");
    setSaving(true);
    try {
      await upsertWork({ ...form, id: work?.id });
      router.push("/admin/works");
      router.refresh();
    } catch {
      setError("Could not save the project.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!work?.id) return;
    if (!confirm(`Delete “${form.title}”?`)) return;
    setDeleting(true);
    try {
      await deleteWork(work.id);
      router.push("/admin/works");
      router.refresh();
    } catch {
      setError("Could not delete.");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/works" className="inline-flex items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.14em] text-ink-3 transition-colors hover:text-ink">
            <ArrowLeft size={14} /> Works
          </Link>
          <h1 className="mt-2 font-serif text-3xl font-light text-ink">
            {isEdit ? "Edit project" : "New project"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {isEdit ? (
            <button type="button" onClick={onDelete} disabled={deleting} className="inline-flex items-center gap-2 border border-red-300 px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60">
              <Trash2 size={15} /> Delete
            </button>
          ) : null}
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-ink px-6 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:bg-sage disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin" /> : null}
            {saving ? "Saving…" : "Save project"}
          </button>
        </div>
      </div>

      {error ? <p className="mt-6 border-l-2 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <label className={labelCls}>Project title</label>
            <input className={`${inputCls} mt-2`} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Sacred Heart Church" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Category</label>
              <input className={`${inputCls} mt-2`} value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Flooring" />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input className={`${inputCls} mt-2`} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Kerala, India" />
            </div>
            <div>
              <label className={labelCls}>Year</label>
              <input className={`${inputCls} mt-2`} value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="e.g. 2024" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={5} className={`${inputCls} mt-2 resize-y`} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the project, the stone used and the work done." />
          </div>
          <div className="border border-line bg-surface p-5">
            <label className={labelCls}>Gallery images</label>
            <p className="mt-1 text-xs text-ink-3">Extra photos shown alongside the cover.</p>
            <div className="mt-3">
              <GalleryUpload values={form.gallery} onChange={(urls) => set("gallery", urls)} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-line bg-surface p-5">
            <label className={labelCls}>Cover image</label>
            <div className="mt-3">
              <ImageUpload value={form.imageUrl} onChange={(url) => set("imageUrl", url)} />
            </div>
          </div>
          <div className="border border-line bg-surface p-5">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span className={labelCls}>Featured project</span>
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-sage" />
            </label>
          </div>
          <div className="border border-line bg-surface p-5">
            <label className={labelCls}>Sort order</label>
            <input type="number" className={`${inputCls} mt-2`} value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value) || 0)} />
            <p className="mt-2 text-xs text-ink-3">Lower numbers appear first.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
