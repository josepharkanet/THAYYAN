"use client";

import { useEffect, useState } from "react";
import { X, ClipboardList, Loader2, Trash2, CheckCircle2, Minus, Plus } from "lucide-react";
import {
  getEnquiry,
  removeFromEnquiry,
  setEnquiryQty,
  clearEnquiry,
  onEnquiryChange,
  type EnquiryItem,
} from "@/lib/enquiry-store";
import { createEnquiry } from "@/app/admin/actions";
import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "./icons";

export default function EnquiryBar({ whatsappNumber }: { whatsappNumber: string }) {
  const [items, setItems] = useState<EnquiryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", note: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const sync = () => setItems(getEnquiry());
    sync();
    return onEnquiryChange(sync);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim())
      return setError("Please enter your name and phone number.");
    setSaving(true);
    try {
      await createEnquiry({ ...form, items });
      const lines = items.map((i, idx) => `${idx + 1}. ${i.name} x${i.qty}`).join("\n");
      const msg = `Hello Stonic Export! I'd like a price for these ready-stock items:\n${lines}\n\nName: ${form.name}${form.note ? `\nNote: ${form.note}` : ""}`;
      clearEnquiry();
      setForm({ name: "", phone: "", email: "", note: "" });
      setDone(true);
      window.open(whatsappLink(whatsappNumber, msg), "_blank");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your enquiry. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (items.length === 0 && !open) return null;

  return (
    <>
      {/* Floating trigger */}
      {items.length > 0 && !open ? (
        <button
          type="button"
          onClick={() => { setDone(false); setOpen(true); }}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-ink px-5 py-3.5 text-sm font-semibold text-paper shadow-xl transition-transform hover:scale-105"
        >
          <ClipboardList size={18} />
          Enquiry list
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-sage px-1.5 text-xs text-white">
            {items.length}
          </span>
        </button>
      ) : null}

      {/* Panel */}
      {open ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <div className="relative flex h-full w-full max-w-md flex-col bg-paper shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h3 className="font-serif text-2xl text-ink">Your enquiry list</h3>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-ink-3 hover:text-ink">
                <X size={22} />
              </button>
            </div>

            {done ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <CheckCircle2 size={54} className="text-sage" strokeWidth={1.4} />
                <h4 className="font-serif text-2xl text-ink">Enquiry sent!</h4>
                <p className="text-sm leading-relaxed text-ink-2">
                  Thank you — we&rsquo;ve received your list and will reply with pricing shortly.
                  We&rsquo;ve also opened WhatsApp so you can send it to us directly.
                </p>
                <button onClick={() => setOpen(false)} className="mt-2 bg-ink px-7 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-paper hover:bg-sage">
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  {items.length === 0 ? (
                    <p className="py-10 text-center text-ink-2">Your list is empty.</p>
                  ) : (
                    <ul className="space-y-4">
                      {items.map((it) => (
                        <li key={it.slug} className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={it.imageUrl} alt="" className="h-14 w-14 shrink-0 rounded-sm object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ink">{it.name}</p>
                            <div className="mt-1.5 inline-flex items-center rounded-full border border-line">
                              <button type="button" onClick={() => setEnquiryQty(it.slug, it.qty - 1)} className="px-2 py-1 text-ink-3 hover:text-ink" aria-label="Decrease"><Minus size={13} /></button>
                              <span className="min-w-6 text-center text-sm text-ink">{it.qty}</span>
                              <button type="button" onClick={() => setEnquiryQty(it.slug, it.qty + 1)} className="px-2 py-1 text-ink-3 hover:text-ink" aria-label="Increase"><Plus size={13} /></button>
                            </div>
                          </div>
                          <button type="button" onClick={() => removeFromEnquiry(it.slug)} aria-label="Remove" className="text-ink-3 hover:text-red-600"><Trash2 size={16} /></button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <form onSubmit={submit} className="border-t border-line px-6 py-5">
                  <p className="mb-3 text-[0.72rem] uppercase tracking-[0.14em] text-ink-3">Send us your list for pricing</p>
                  <div className="space-y-3">
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name*" className="w-full border border-line bg-surface px-3.5 py-2.5 text-ink outline-none focus:border-sage" />
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone / WhatsApp*" className="w-full border border-line bg-surface px-3.5 py-2.5 text-ink outline-none focus:border-sage" />
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email (optional)" className="w-full border border-line bg-surface px-3.5 py-2.5 text-ink outline-none focus:border-sage" />
                    <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={2} placeholder="Note (quantity, sizes, delivery city…)" className="w-full resize-y border border-line bg-surface px-3.5 py-2.5 text-ink outline-none focus:border-sage" />
                  </div>
                  {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
                  <button type="submit" disabled={saving || items.length === 0} className="mt-4 flex w-full items-center justify-center gap-2 bg-whatsapp px-6 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:brightness-95 disabled:opacity-60">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <WhatsAppIcon size={17} />}
                    {saving ? "Sending…" : "Send enquiry"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
