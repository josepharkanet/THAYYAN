"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Check, Eye, EyeOff, Plus, Star, UploadCloud, X } from "lucide-react";
import { upsertFeedback, setFeedbackApproved, deleteFeedback } from "@/app/admin/actions";

export type AdminFeedback = {
  id: string;
  name: string;
  location: string | null;
  type: string;
  message: string | null;
  mediaUrl: string | null;
  rating: number | null;
  approved: boolean;
};

export default function FeedbackManager({ feedback }: { feedback: AdminFeedback[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  return (
    <div className="mt-8">
      <div className="mb-5 flex justify-end">
        <button onClick={() => setAdding((v) => !v)} className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-paper hover:bg-sage">
          <Plus size={15} /> {adding ? "Close" : "Add feedback"}
        </button>
      </div>

      {adding ? <AddForm onDone={() => { setAdding(false); router.refresh(); }} /> : null}

      {feedback.length === 0 ? (
        <div className="border border-line bg-surface p-10 text-center text-ink-2">No feedback yet.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {feedback.map((f) => (
            <Row key={f.id} f={f} onChange={() => router.refresh()} />
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ f, onChange }: { f: AdminFeedback; onChange: () => void }) {
  const [busy, setBusy] = useState(false);
  async function toggle() {
    setBusy(true);
    await setFeedbackApproved(f.id, !f.approved);
    onChange();
    setBusy(false);
  }
  async function del() {
    if (!confirm(`Delete feedback from ${f.name}?`)) return;
    setBusy(true);
    await deleteFeedback(f.id);
    onChange();
  }
  return (
    <div className={`overflow-hidden border bg-surface ${f.approved ? "border-line" : "border-amber-300"}`}>
      {f.type === "video" && f.mediaUrl ? (
        <video src={f.mediaUrl} className="h-40 w-full object-cover" muted controls playsInline preload="metadata" />
      ) : f.type === "image" && f.mediaUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={f.mediaUrl} alt="" className="h-40 w-full object-cover" />
      ) : null}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-medium text-ink">{f.name}</p>
            {f.location ? <p className="text-xs text-ink-3">{f.location}</p> : null}
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] ${f.approved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
            {f.approved ? "Live" : "Pending"}
          </span>
        </div>
        {f.rating ? (
          <div className="mt-2 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={13} className={i <= (f.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-line"} />)}
          </div>
        ) : null}
        {f.message ? <p className="mt-2 line-clamp-4 text-sm text-ink-2">{f.message}</p> : null}
        <div className="mt-4 flex items-center gap-2">
          <button onClick={toggle} disabled={busy} className={`inline-flex items-center gap-1.5 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.1em] ${f.approved ? "border border-line text-ink-2 hover:bg-paper-2" : "bg-sage text-white hover:brightness-95"} disabled:opacity-60`}>
            {busy ? <Loader2 size={13} className="animate-spin" /> : f.approved ? <EyeOff size={13} /> : <Eye size={13} />}
            {f.approved ? "Unpublish" : "Approve"}
          </button>
          <button onClick={del} disabled={busy} className="ml-auto inline-flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.1em] text-red-600 hover:text-red-700 disabled:opacity-60">
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function AddForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [kind, setKind] = useState<"image" | "video" | "">("");
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function upload(file?: File | null) {
    if (!file) return;
    setBusy(true); setError("");
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "same-origin" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setMediaUrl(data.url);
      setKind(file.type.startsWith("video/") ? "video" : "image");
    } catch (e) { setError(e instanceof Error ? e.message : "Upload failed"); }
    finally { setBusy(false); }
  }

  async function save() {
    setError("");
    if (!name.trim()) return setError("Enter a name.");
    if (!message.trim() && !mediaUrl) return setError("Add a message or media.");
    setSaving(true);
    try {
      await upsertFeedback({
        name, location, rating, message, mediaUrl,
        type: kind === "video" ? "video" : kind === "image" ? "image" : "text",
        approved: true,
      });
      onDone();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save."); setSaving(false); }
  }

  const inputCls = "border border-line bg-surface px-3.5 py-2.5 text-ink outline-none focus:border-sage";
  return (
    <div className="mb-6 border border-line bg-surface p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name*" className={inputCls} />
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City / Country" className={inputCls} />
      </div>
      <div className="mt-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)}><Star size={22} className={n <= rating ? "fill-amber-400 text-amber-400" : "text-line"} /></button>
        ))}
      </div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Feedback message" className={`${inputCls} mt-3 w-full resize-y`} />
      <div className="mt-3">
        {mediaUrl ? (
          <div className="relative inline-block">
            {kind === "video" ? <video src={mediaUrl} className="h-24 rounded-sm" muted controls /> : /* eslint-disable-next-line @next/next/no-img-element */ <img src={mediaUrl} alt="" className="h-24 rounded-sm object-cover" />}
            <button type="button" onClick={() => { setMediaUrl(""); setKind(""); }} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white"><X size={13} /></button>
          </div>
        ) : (
          <label className="inline-flex cursor-pointer items-center gap-2 border border-ink px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink hover:bg-ink hover:text-paper">
            {busy ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />} {busy ? "Uploading…" : "Add image / video"}
            <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
          </label>
        )}
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <button onClick={save} disabled={saving || busy} className="mt-4 inline-flex items-center gap-2 bg-ink px-6 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-paper hover:bg-sage disabled:opacity-60">
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save &amp; publish
      </button>
    </div>
  );
}
