"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Film, Loader2 } from "lucide-react";

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url as string;
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

  async function handleFile(file?: File) {
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
      <div className="flex items-start gap-4">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden border border-line bg-paper-2">
          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-white hover:bg-ink"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-3">
              <ImageIcon size={26} strokeWidth={1.3} />
            </div>
          )}
        </div>

        <div className="flex-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 border border-ink px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-60"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {busy ? "Uploading…" : "Upload image"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <p className="mt-2 text-xs text-ink-3">JPG, PNG or WEBP · up to 8 MB</p>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className="mt-2 w-full border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-sage"
          />
        </div>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
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

  async function handleFile(file?: File) {
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
      <div className="flex items-start gap-4">
        <div className="relative h-24 w-40 shrink-0 overflow-hidden border border-line bg-paper-2">
          {value ? (
            <>
              <video src={value} className="h-full w-full object-cover" muted playsInline preload="metadata" />
              <button type="button" onClick={() => onChange("")} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-white hover:bg-ink" aria-label="Remove video">
                <X size={14} />
              </button>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-3">
              <Film size={24} strokeWidth={1.3} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="inline-flex items-center gap-2 border border-ink px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-60">
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {busy ? "Uploading…" : "Upload video"}
          </button>
          <input ref={inputRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          <p className="mt-2 text-xs text-ink-3">MP4 or WEBM · up to 64 MB. Leave empty to use the hero image instead.</p>
          <input type="url" value={value} onChange={(e) => onChange(e.target.value)} placeholder="…or paste a video URL" className="mt-2 w-full border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-sage" />
        </div>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
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
          <div key={url + i} className="relative h-20 w-20 overflow-hidden border border-line bg-paper-2">
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
          disabled={busy}
          className="flex h-20 w-20 items-center justify-center border border-dashed border-line text-ink-3 transition-colors hover:border-ink hover:text-ink disabled:opacity-60"
        >
          {busy ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
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
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
