"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, X, Loader2 } from "lucide-react";
import { upsertProduct, deleteProduct } from "@/app/admin/actions";
import { ImageUpload, GalleryUpload } from "./ImageUpload";

type Category = { id: string; name: string };

export type ProductFormData = {
  id?: string;
  name: string;
  categoryId: string;
  description: string;
  origin: string;
  finish: string;
  thickness: string;
  imageUrl: string;
  featured: boolean;
  readyStock: boolean;
  sortOrder: number;
  applications: string[];
  gallery: string[];
};

const inputCls =
  "w-full border border-line bg-surface px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-sage";
const labelCls = "text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-3";

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: ProductFormData;
}) {
  const router = useRouter();
  const isEdit = Boolean(product?.id);

  const [form, setForm] = useState<ProductFormData>(
    product ?? {
      name: "",
      categoryId: categories[0]?.id ?? "",
      description: "",
      origin: "",
      finish: "",
      thickness: "",
      imageUrl: "",
      featured: false,
      readyStock: false,
      sortOrder: 0,
      applications: [],
      gallery: [],
    },
  );
  const [appInput, setAppInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addApplication(raw: string) {
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) set("applications", [...new Set([...form.applications, ...parts])]);
    setAppInput("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Please enter a product name.");
    if (!form.categoryId) return setError("Please choose a category.");
    if (!form.imageUrl) return setError("Please add a main image.");

    setSaving(true);
    try {
      await upsertProduct({ ...form, id: product?.id });
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the product.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!product?.id) return;
    if (!confirm(`Delete “${form.name}”? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteProduct(product.id);
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Could not delete the product.");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.14em] text-ink-3 transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} /> Products
          </Link>
          <h1 className="mt-2 font-serif text-3xl font-light text-ink">
            {isEdit ? "Edit product" : "New product"}
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
            {saving ? "Saving…" : "Save product"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-6 border-l-2 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main fields */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <label className={labelCls} htmlFor="p-name">Product name</label>
            <input
              id="p-name"
              className={`${inputCls} mt-2`}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Makrana White Marble"
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="p-cat">Category</label>
            <select
              id="p-cat"
              className={`${inputCls} mt-2 cursor-pointer`}
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="p-desc">Description</label>
            <textarea
              id="p-desc"
              rows={5}
              className={`${inputCls} mt-2 resize-y`}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the stone: colour, veining, ideal uses…"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="p-origin">Origin</label>
              <input id="p-origin" className={`${inputCls} mt-2`} value={form.origin} onChange={(e) => set("origin", e.target.value)} placeholder="India" />
            </div>
            <div>
              <label className={labelCls} htmlFor="p-finish">Finish</label>
              <input id="p-finish" className={`${inputCls} mt-2`} value={form.finish} onChange={(e) => set("finish", e.target.value)} placeholder="Polished" />
            </div>
            <div>
              <label className={labelCls} htmlFor="p-thick">Thickness</label>
              <input id="p-thick" className={`${inputCls} mt-2`} value={form.thickness} onChange={(e) => set("thickness", e.target.value)} placeholder="18–20mm" />
            </div>
          </div>

          {/* Applications */}
          <div>
            <label className={labelCls} htmlFor="p-app">Applications</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.applications.map((a) => (
                <span key={a} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-2 px-3 py-1 text-sm text-ink">
                  {a}
                  <button type="button" onClick={() => set("applications", form.applications.filter((x) => x !== a))} aria-label={`Remove ${a}`}>
                    <X size={13} className="text-ink-3 hover:text-ink" />
                  </button>
                </span>
              ))}
            </div>
            <input
              id="p-app"
              className={`${inputCls} mt-2`}
              value={appInput}
              onChange={(e) => setAppInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addApplication(appInput);
                }
              }}
              onBlur={() => appInput && addApplication(appInput)}
              placeholder="Type an application and press Enter (e.g. Flooring)"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="border border-line bg-surface p-5">
            <label className={labelCls}>Main image</label>
            <div className="mt-3">
              <ImageUpload value={form.imageUrl} onChange={(url) => set("imageUrl", url)} />
            </div>
          </div>

          <div className="border border-line bg-surface p-5">
            <label className={labelCls}>Gallery images</label>
            <p className="mt-1 mb-3 text-xs text-ink-3">Optional extra photos.</p>
            <GalleryUpload values={form.gallery} onChange={(urls) => set("gallery", urls)} />
          </div>

          <div className="border border-line bg-surface p-5">
            <label className="flex cursor-pointer items-center justify-between">
              <span>
                <span className="block font-medium text-ink">Featured</span>
                <span className="text-xs text-ink-3">Show on the homepage</span>
              </span>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="h-5 w-5 accent-sage"
              />
            </label>
            <label className="mt-4 flex cursor-pointer items-center justify-between border-t border-line pt-4">
              <span>
                <span className="block font-medium text-ink">Ready stock</span>
                <span className="text-xs text-ink-3">Show in the shareable Ready Stock catalogue</span>
              </span>
              <input
                type="checkbox"
                checked={form.readyStock}
                onChange={(e) => set("readyStock", e.target.checked)}
                className="h-5 w-5 accent-sage"
              />
            </label>
            <div className="mt-5">
              <label className={labelCls} htmlFor="p-sort">Sort order</label>
              <input
                id="p-sort"
                type="number"
                className={`${inputCls} mt-2`}
                value={form.sortOrder}
                onChange={(e) => set("sortOrder", Number(e.target.value) || 0)}
              />
              <p className="mt-1 text-xs text-ink-3">Lower numbers show first.</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
