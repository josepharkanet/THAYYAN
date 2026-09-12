"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, X, Loader2 } from "lucide-react";
import { upsertService, deleteService } from "@/app/admin/actions";
import { ImageUpload } from "./ImageUpload";
import IconPicker from "./IconPicker";

export type ServiceFormData = {
  id?: string;
  icon: string;
  subtitle: string;
  title: string;
  description: string;
  imageUrl: string;
  highlights: string[];
  sortOrder: number;
};

const inputCls =
  "w-full border border-line bg-surface px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-sage";
const labelCls = "text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-3";

export default function ServiceForm({ service }: { service?: ServiceFormData }) {
  const router = useRouter();
  const isEdit = Boolean(service?.id);

  const [form, setForm] = useState<ServiceFormData>(
    service ?? {
      icon: "mountain",
      subtitle: "",
      title: "",
      description: "",
      imageUrl: "",
      highlights: [],
      sortOrder: 0,
    },
  );
  const [hlInput, setHlInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof ServiceFormData>(key: K, value: ServiceFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addHighlight(raw: string) {
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) set("highlights", [...new Set([...form.highlights, ...parts])]);
    setHlInput("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("Please enter a title.");
    if (!form.subtitle.trim()) return setError("Please enter a subtitle.");
    if (!form.imageUrl) return setError("Please add an image.");
    setSaving(true);
    try {
      await upsertService({ ...form, id: service?.id });
      router.push("/admin/services");
      router.refresh();
    } catch {
      setError("Could not save the service.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!service?.id) return;
    if (!confirm(`Delete “${form.title}”?`)) return;
    setDeleting(true);
    try {
      await deleteService(service.id);
      router.push("/admin/services");
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
          <Link href="/admin/services" className="inline-flex items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.14em] text-ink-3 transition-colors hover:text-ink">
            <ArrowLeft size={14} /> Services
          </Link>
          <h1 className="mt-2 font-serif text-3xl font-light text-ink">
            {isEdit ? "Edit service" : "New service"}
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
            {saving ? "Saving…" : "Save service"}
          </button>
        </div>
      </div>

      {error ? <p className="mt-6 border-l-2 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <label className={labelCls}>Subtitle (small label)</label>
            <input className={`${inputCls} mt-2`} value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="e.g. From the Source" />
          </div>
          <div>
            <label className={labelCls}>Title</label>
            <input className={`${inputCls} mt-2`} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Quarry-Direct Sourcing" />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={5} className={`${inputCls} mt-2 resize-y`} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Highlights</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.highlights.map((h) => (
                <span key={h} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-2 px-3 py-1 text-sm text-ink">
                  {h}
                  <button type="button" onClick={() => set("highlights", form.highlights.filter((x) => x !== h))}>
                    <X size={13} className="text-ink-3 hover:text-ink" />
                  </button>
                </span>
              ))}
            </div>
            <input
              className={`${inputCls} mt-2`}
              value={hlInput}
              onChange={(e) => setHlInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addHighlight(hlInput); } }}
              onBlur={() => hlInput && addHighlight(hlInput)}
              placeholder="Type a highlight and press Enter"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-line bg-surface p-5">
            <label className={labelCls}>Icon</label>
            <div className="mt-3">
              <IconPicker value={form.icon} onChange={(k) => set("icon", k)} />
            </div>
          </div>
          <div className="border border-line bg-surface p-5">
            <label className={labelCls}>Image</label>
            <div className="mt-3">
              <ImageUpload value={form.imageUrl} onChange={(url) => set("imageUrl", url)} />
            </div>
          </div>
          <div className="border border-line bg-surface p-5">
            <label className={labelCls}>Sort order</label>
            <input type="number" className={`${inputCls} mt-2`} value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value) || 0)} />
          </div>
        </div>
      </div>
    </form>
  );
}
