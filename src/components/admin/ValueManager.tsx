"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { upsertValue, deleteValue } from "@/app/admin/actions";
import { ICONS } from "@/lib/content";
import IconPicker from "./IconPicker";

export type ValueRow = {
  id: string;
  icon: string;
  title: string;
  description: string;
  sortOrder: number;
};

type Draft = { id?: string; icon: string; title: string; description: string; sortOrder: number };

const inputCls =
  "w-full border border-line bg-surface px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-sage";
const labelCls = "text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-3";

export default function ValueManager({ values }: { values: ValueRow[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startNew() {
    setError("");
    setDraft({ icon: "gem", title: "", description: "", sortOrder: values.length + 1 });
  }
  function startEdit(v: ValueRow) {
    setError("");
    setDraft({ id: v.id, icon: v.icon, title: v.title, description: v.description, sortOrder: v.sortOrder });
  }

  async function save() {
    if (!draft) return;
    if (!draft.title.trim()) return setError("Please enter a title.");
    setSaving(true);
    setError("");
    try {
      await upsertValue(draft);
      setDraft(null);
      router.refresh();
    } catch {
      setError("Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(v: ValueRow) {
    if (!confirm(`Delete “${v.title}”?`)) return;
    await deleteValue(v.id);
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Homepage</p>
          <h1 className="mt-3 font-serif text-4xl font-light text-ink">Values</h1>
          <p className="mt-2 text-ink-2">The &ldquo;why choose us&rdquo; points on the home &amp; services pages.</p>
        </div>
        {!draft ? (
          <button onClick={startNew} className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:bg-sage">
            <Plus size={16} /> Add value
          </button>
        ) : null}
      </div>

      {error ? <p className="mt-6 border-l-2 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      {draft ? (
        <div className="mt-6 border border-line bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-ink">{draft.id ? "Edit value" : "New value"}</h2>
            <button onClick={() => setDraft(null)} aria-label="Close" className="text-ink-3 hover:text-ink"><X size={20} /></button>
          </div>
          <div className="mt-5 space-y-5">
            <div>
              <label className={labelCls}>Icon</label>
              <div className="mt-3"><IconPicker value={draft.icon} onChange={(k) => setDraft({ ...draft, icon: k })} /></div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Title</label>
                <input className={`${inputCls} mt-2`} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Quarry-Direct" />
              </div>
              <div className="w-32">
                <label className={labelCls}>Sort order</label>
                <input type="number" className={`${inputCls} mt-2`} value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) || 0 })} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea rows={2} className={`${inputCls} mt-2 resize-y`} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 bg-ink px-6 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:bg-sage disabled:opacity-60">
              {saving ? <Loader2 size={15} className="animate-spin" /> : null}{saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setDraft(null)} className="border border-line px-6 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink-2 transition-colors hover:bg-paper-2">Cancel</button>
          </div>
        </div>
      ) : null}

      <div className="mt-8 divide-y divide-line border border-line bg-surface">
        {values.map((v) => {
          const Icon = ICONS[v.icon as keyof typeof ICONS] ?? ICONS.gem;
          return (
            <div key={v.id} className="flex items-center gap-4 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage">
                <Icon size={20} strokeWidth={1.5} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{v.title}</p>
                <p className="truncate text-xs text-ink-3">{v.description}</p>
              </div>
              <button onClick={() => startEdit(v)} className="inline-flex items-center gap-1.5 px-3 py-2 text-[0.72rem] uppercase tracking-[0.1em] text-ink-3 transition-colors hover:text-ink">
                <Pencil size={14} /> Edit
              </button>
              <button onClick={() => remove(v)} className="inline-flex items-center px-2 py-2 text-ink-3 transition-colors hover:text-red-600" aria-label={`Delete ${v.title}`}>
                <Trash2 size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
