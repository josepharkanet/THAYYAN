"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Film, Loader2, Link2 } from "lucide-react";

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: fd,
    credentials: "same-origin",
  });
  let data: { url?: string; error?: string } = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON error */
  }
  if (!res.ok || !data.url) throw new Error(data.error || `Upload failed (${res.status})`);
  return data.url;
}

/* ─────────────────────── Single image ─────────────────────── */
export function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  async function handleFile(file?: File | null) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadFile(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {value ? (
        <div className="group relative overflow-hidden rounded-md border border-line bg-paper-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-44 w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-ink/80 to-transparent p-2.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-sm bg-white/90 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink hover:bg-white disabled:opacity-60"
            >
              {busy ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
              {busy ? "Uploading…" : "Replace"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 text-white hover:bg-ink"
              aria-label="Remove image"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files?.[0]); }}
          disabled={busy}
          className={`flex h-44 w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 text-center transition-colors ${
            drag ? "border-sage bg-sage-soft" : "border-line bg-paper-2 hover:border-sage hover:bg-sage-soft/40"
          }`}
        >
          {busy ? (
            <Loader2 size={26} className="animate-spin text-sage" />
          ) : (
            <UploadCloud size={26} className="text-sage" strokeWidth={1.6} />
          )}
          <span className="text-sm font-medium text-ink">
            {busy ? "Uploading…" : "Tap to upload or drag & drop"}
          </span>
          <span className="text-xs text-ink-3">JPG, PNG or WEBP · up to 8 MB · phone camera or gallery</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }}
      />

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <div className="mt-2">
        {showUrl ? (
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://…image-url"
            className="w-full border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-sage"
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowUrl(true)}
            className="inline-flex items-center gap-1.5 text-xs text-ink-3 transition-colors hover:text-ink"
          >
            <Link2 size={13} /> or paste an image URL
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────── Single video ─────────────────────── */
export function VideoUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  async function handleFile(file?: File | null) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadFile(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative overflow-hidden rounded-md border border-line bg-paper-2">
          <video src={value} className="h-40 w-full object-cover" muted playsInline preload="metadata" controls />
          <div className="flex items-center justify-between gap-2 p-2.5">
            <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="inline-flex items-center gap-1.5 rounded-sm border border-ink px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink hover:bg-ink hover:text-paper disabled:opacity-60">
              {busy ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />} {busy ? "Uploading…" : "Replace"}
            </button>
            <button type="button" onClick={() => onChange("")} className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 text-white hover:bg-ink" aria-label="Remove video"><X size={15} /></button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files?.[0]); }}
          disabled={busy}
          className={`flex h-40 w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 text-center transition-colors ${
            drag ? "border-sage bg-sage-soft" : "border-line bg-paper-2 hover:border-sage hover:bg-sage-soft/40"
          }`}
        >
          {busy ? <Loader2 size={24} className="animate-spin text-sage" /> : <Film size={24} className="text-sage" strokeWidth={1.5} />}
          <span className="text-sm font-medium text-ink">{busy ? "Uploading…" : "Tap to upload a video"}</span>
          <span className="text-xs text-ink-3">MP4 or WEBM · up to 64 MB. Leave empty to use the hero image.</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }} />
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <div className="mt-2">
        {showUrl ? (
          <input type="url" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…video-url" className="w-full border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-sage" />
        ) : (
          <button type="button" onClick={() => setShowUrl(true)} className="inline-flex items-center gap-1.5 text-xs text-ink-3 transition-colors hover:text-ink"><Link2 size={13} /> or paste a video URL</button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────── Image gallery ─────────────────────── */
export function GalleryUpload({
  values,
  onChange,
}: {
  values: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) urls.push(await uploadFile(file));
      onChange([...values, ...urls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {values.map((url, i) => (
          <div key={url + i} className="relative h-20 w-20 overflow-hidden rounded-sm border border-line bg-paper-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-white hover:bg-ink"
              aria-label="Remove"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
          disabled={busy}
          className={`flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-sm border-2 border-dashed text-ink-3 transition-colors disabled:opacity-60 ${
            drag ? "border-sage bg-sage-soft" : "border-line hover:border-sage hover:text-ink"
          }`}
        >
          {busy ? <Loader2 size={18} className="animate-spin text-sage" /> : <UploadCloud size={18} />}
          <span className="text-[0.6rem] uppercase tracking-[0.1em]">Add</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="mt-2 text-xs text-ink-3">Tap “Add” to upload from your device (or drag &amp; drop). You can select multiple.</p>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
