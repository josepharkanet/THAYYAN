"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { upsertCategory, deleteCategory } from "@/app/admin/actions";
import { ImageUpload } from "./ImageUpload";

export type CategoryRow = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  productCount: number;
};

type Draft = {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
};

const inputCls =
  "w-full border border-line bg-surface px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-sage";
const labelCls = "text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-3";

export default function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startNew() {
    setError("");
    setDraft({ name: "", description: "", imageUrl: "", sortOrder: categories.length + 1 });
  }
  function startEdit(c: CategoryRow) {
    setError("");
    setDraft({ id: c.id, name: c.name, description: c.description, imageUrl: c.imageUrl, sortOrder: c.sortOrder });
  }

  async function save() {
    if (!draft) return;
    if (!draft.name.trim()) return setError("Please enter a name.");
    setSaving(true);
    setError("");
    try {
      const res = await upsertCategory(draft);
      if (res && res.ok === false) {
        setError(res.error || "Could not save.");
        return;
      }
      setDraft(null);
      router.refresh();
    } catch {
      setError("Could not save the category.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(c: CategoryRow) {
    setError("");
    if (!confirm(`Delete “${c.name}”?`)) return;
    const res = await deleteCategory(c.id);
    if (res && res.ok === false) {
      setError(res.error || "Could not delete.");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Collection</p>
          <h1 className="mt-3 font-serif text-4xl font-light text-ink">Categories</h1>
          <p className="mt-2 text-ink-2">Organise your products into collections.</p>
        </div>
        {!draft ? (
          <button
            onClick={startNew}
            className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:bg-sage"
          >
            <Plus size={16} /> Add category
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="mt-6 border-l-2 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      {/* Editor */}
      {draft ? (
        <div className="mt-6 border border-line bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-ink">
              {draft.id ? "Edit category" : "New category"}
            </h2>
            <button onClick={() => setDraft(null)} aria-label="Close" className="text-ink-3 hover:text-ink">
              <X size={20} />
            </button>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Name</label>
                <input
                  className={`${inputCls} mt-2`}
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g. Indian Marbles"
                />
                {draft.id ? (
                  <p className="mt-1 text-xs text-ink-3">URL: /products?category={draft.id}</p>
                ) : null}
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  rows={3}
                  className={`${inputCls} mt-2 resize-y`}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  placeholder="A short line shown under the category."
                />
              </div>
              <div className="w-32">
                <label className={labelCls}>Sort order</label>
                <input
                  type="number"
                  className={`${inputCls} mt-2`}
                  value={draft.sortOrder}
                  onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Cover image</label>
              <div className="mt-2">
                <ImageUpload value={draft.imageUrl} onChange={(url) => setDraft({ ...draft, imageUrl: url })} />
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-ink px-6 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:bg-sage disabled:opacity-60"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : null}
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => setDraft(null)}
              className="border border-line px-6 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink-2 transition-colors hover:bg-paper-2"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {/* List */}
      <div className="mt-8 divide-y divide-line border border-line bg-surface">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-4 p-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden bg-paper-2">
              {c.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={c.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{c.name}</p>
              <p className="truncate text-xs text-ink-3">
                {c.productCount} product{c.productCount === 1 ? "" : "s"}
              </p>
            </div>
            <button
              onClick={() => startEdit(c)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-[0.72rem] uppercase tracking-[0.1em] text-ink-3 transition-colors hover:text-ink"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={() => remove(c)}
              className="inline-flex items-center px-2 py-2 text-ink-3 transition-colors hover:text-red-600"
              aria-label={`Delete ${c.name}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
