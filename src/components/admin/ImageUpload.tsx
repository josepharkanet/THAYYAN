"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud, X, Film, Loader2, Link2, Images, Search } from "lucide-react";

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

/* ─────────────── Media library picker (existing images) ─────────────── */
function MediaLibrary({
  onPick,
  onClose,
}: {
  onPick: (url: string) => void;
  onClose: () => void;
}) {
  const [images, setImages] = useState<string[] | null>(null);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/media", { credentials: "same-origin" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load library");
        setImages(data.images ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load library");
        setImages([]);
      }
    })();
  }, []);

  const shown = (images ?? []).filter((u) => u.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog">
      <div className="absolute inset-0 bg-ink/60" onClick={onClose} />
      <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-md bg-paper shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h3 className="font-serif text-xl text-ink">Image library</h3>
          <div className="relative hidden flex-1 sm:block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-full border border-line bg-surface py-2 pl-9 pr-3 text-sm text-ink outline-none focus:border-sage" />
          </div>
          <button onClick={onClose} aria-label="Close" className="text-ink-3 hover:text-ink"><X size={22} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {images === null ? (
            <div className="flex h-40 items-center justify-center text-ink-3"><Loader2 className="animate-spin" /></div>
          ) : error ? (
            <p className="py-10 text-center text-sm text-red-600">{error}</p>
          ) : shown.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-2">No images yet — upload one to start your library.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {shown.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => { onPick(url); onClose(); }}
                  className="group relative aspect-square overflow-hidden rounded-sm border border-line bg-paper-2 transition-all hover:ring-2 hover:ring-sage"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
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
  const [lib, setLib] = useState(false);

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

      {lib ? <MediaLibrary onPick={(url) => onChange(url)} onClose={() => setLib(false)} /> : null}

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={() => setLib(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sage transition-colors hover:text-ink"
        >
          <Images size={14} /> Choose from library
        </button>
        {showUrl ? (
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://…image-url"
            className="w-full flex-1 border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-sage"
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowUrl(true)}
            className="inline-flex items-center gap-1.5 text-xs text-ink-3 transition-colors hover:text-ink"
          >
            <Link2 size={13} /> or paste a URL
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
  const [lib, setLib] = useState(false);

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
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        <button type="button" onClick={() => setLib(true)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-sage transition-colors hover:text-ink">
          <Images size={14} /> Choose from library
        </button>
        <p className="text-xs text-ink-3">…or tap “Add” to upload from your device (multiple allowed).</p>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      {lib ? <MediaLibrary onPick={(url) => onChange([...values, url])} onClose={() => setLib(false)} /> : null}
    </div>
  );
}
