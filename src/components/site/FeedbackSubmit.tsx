"use client";

import { useState } from "react";
import { X, Loader2, Star, UploadCloud, CheckCircle2, MessageSquarePlus } from "lucide-react";
import { createFeedback } from "@/app/admin/actions";

export default function FeedbackSubmit({
  variant = "solid",
}: {
  variant?: "solid" | "outline";
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaKind, setMediaKind] = useState<"image" | "video" | "">("");
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function upload(file?: File | null) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/feedback/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setMediaUrl(data.url);
      setMediaKind(data.kind);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Please enter your name.");
    if (!message.trim() && !mediaUrl) return setError("Add a message, photo or video.");
    setSaving(true);
    try {
      const type = mediaKind === "video" ? "video" : mediaKind === "image" ? "image" : "text";
      await createFeedback({ name, location, rating, message, mediaUrl, type });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setOpen(false);
    setTimeout(() => {
      setDone(false); setName(""); setLocation(""); setRating(5);
      setMessage(""); setMediaUrl(""); setMediaKind(""); setError("");
    }, 200);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          variant === "outline"
            ? "inline-flex items-center gap-2 border border-paper/30 px-8 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-paper/10"
            : "inline-flex items-center gap-2 bg-ink px-8 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-sage"
        }
      >
        <MessageSquarePlus size={17} /> Share your experience
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/60" onClick={reset} />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-md bg-paper shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h3 className="font-serif text-2xl text-ink">Share your feedback</h3>
              <button onClick={reset} aria-label="Close" className="text-ink-3 hover:text-ink"><X size={22} /></button>
            </div>

            {done ? (
              <div className="flex flex-col items-center gap-4 px-8 py-14 text-center">
                <CheckCircle2 size={54} className="text-sage" strokeWidth={1.4} />
                <h4 className="font-serif text-2xl text-ink">Thank you!</h4>
                <p className="text-sm leading-relaxed text-ink-2">
                  Your feedback has been submitted and will appear once our team approves it.
                </p>
                <button onClick={reset} className="mt-2 bg-ink px-7 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-paper hover:bg-sage">Close</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4 px-6 py-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name*" className="border border-line bg-surface px-3.5 py-2.5 text-ink outline-none focus:border-sage" />
                  <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City / Country" className="border border-line bg-surface px-3.5 py-2.5 text-ink outline-none focus:border-sage" />
                </div>

                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      aria-pressed={n === rating}
                      className="rounded p-1.5 transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        size={28}
                        strokeWidth={1.5}
                        className={
                          "pointer-events-none transition-colors " +
                          (n <= rating ? "fill-amber-400 text-amber-400" : "fill-transparent text-ink-3")
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-ink-3">{rating}/5</span>
                </div>

                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Tell us about your experience with Stonic…" className="w-full resize-y border border-line bg-surface px-3.5 py-2.5 text-ink outline-none focus:border-sage" />

                <div>
                  <p className="mb-2 text-[0.72rem] uppercase tracking-[0.14em] text-ink-3">Add a photo or video (optional)</p>
                  {mediaUrl ? (
                    <div className="relative inline-block">
                      {mediaKind === "video" ? (
                        <video src={mediaUrl} className="h-28 rounded-sm object-cover" muted controls playsInline />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={mediaUrl} alt="" className="h-28 rounded-sm object-cover" />
                      )}
                      <button type="button" onClick={() => { setMediaUrl(""); setMediaKind(""); }} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white"><X size={13} /></button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-line bg-paper-2 px-4 py-6 text-sm text-ink-2 hover:border-sage">
                      {busy ? <Loader2 size={18} className="animate-spin text-sage" /> : <UploadCloud size={18} className="text-sage" />}
                      {busy ? "Uploading…" : "Tap to add image / video"}
                      <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
                    </label>
                  )}
                </div>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                <button type="submit" disabled={saving || busy} className="flex w-full items-center justify-center gap-2 bg-ink px-6 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-sage disabled:opacity-60">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                  {saving ? "Submitting…" : "Submit feedback"}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
