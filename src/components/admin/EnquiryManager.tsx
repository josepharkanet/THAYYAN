"use client";

import { useState } from "react";
import { Loader2, Trash2, Check, Phone, Mail } from "lucide-react";
import { updateEnquiry, deleteEnquiry } from "@/app/admin/actions";
import { WhatsAppIcon } from "@/components/site/icons";

type Item = { slug: string; name: string; imageUrl: string; qty: number };
export type AdminEnquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  note: string | null;
  items: Item[];
  status: string;
  reply: string | null;
  createdAt: string;
};

const STATUS: Record<string, string> = {
  new: "bg-amber-100 text-amber-700",
  quoted: "bg-sky-100 text-sky-700",
  closed: "bg-emerald-100 text-emerald-700",
};

function template(e: AdminEnquiry) {
  const lines = e.items.map((i, n) => `${n + 1}. ${i.name} x${i.qty} — ₹`).join("\n");
  return `Hi ${e.name}, thank you for your enquiry! Our best prices:\n${lines}\n\nPrices are per sq.ft / piece, ex-works. Reply to confirm your order.`;
}

export default function EnquiryManager({ enquiries }: { enquiries: AdminEnquiry[] }) {
  if (enquiries.length === 0) {
    return (
      <div className="mt-8 border border-line bg-surface p-10 text-center text-ink-2">
        No enquiries yet. When a customer sends their ready-stock list, it appears here.
      </div>
    );
  }
  return (
    <div className="mt-8 space-y-5">
      {enquiries.map((e) => (
        <EnquiryRow key={e.id} e={e} />
      ))}
    </div>
  );
}

function EnquiryRow({ e }: { e: AdminEnquiry }) {
  const [reply, setReply] = useState(e.reply || template(e));
  const [status, setStatus] = useState(e.status);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function save(nextStatus?: string) {
    setSaving(true);
    setSaved(false);
    try {
      const s = nextStatus ?? status;
      await updateEnquiry(e.id, { reply, status: s });
      setStatus(s);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  function whatsapp() {
    const phone = e.phone.replace(/\D/g, "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(reply)}`, "_blank");
    if (status === "new") save("quoted");
  }

  async function del() {
    if (!confirm(`Delete enquiry from ${e.name}?`)) return;
    setDeleting(true);
    try {
      await deleteEnquiry(e.id);
      window.location.reload();
    } catch {
      setDeleting(false);
    }
  }

  return (
    <div className="border border-line bg-surface">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line p-5">
        <div>
          <div className="flex items-center gap-3">
            <p className="font-serif text-xl text-ink">{e.name}</p>
            <span className={`rounded-full px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] ${STATUS[status] ?? STATUS.new}`}>{status}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2">
            <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-ink"><Phone size={14} /> {e.phone}</a>
            {e.email ? <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1.5 hover:text-ink"><Mail size={14} /> {e.email}</a> : null}
          </div>
        </div>
        <p className="text-xs text-ink-3">{new Date(e.createdAt).toLocaleString()}</p>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-2">
        <div>
          <p className="text-[0.66rem] uppercase tracking-[0.16em] text-ink-3">Requested items ({e.items.length})</p>
          <ul className="mt-3 space-y-2.5">
            {e.items.map((i) => (
              <li key={i.slug} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.imageUrl} alt="" className="h-11 w-11 shrink-0 rounded-sm object-cover" />
                <span className="flex-1 text-sm text-ink">{i.name}</span>
                <span className="text-sm font-medium text-ink-2">×{i.qty}</span>
              </li>
            ))}
          </ul>
          {e.note ? <p className="mt-4 border-l-2 border-line pl-3 text-sm italic text-ink-2">“{e.note}”</p> : null}
        </div>

        <div>
          <p className="text-[0.66rem] uppercase tracking-[0.16em] text-ink-3">Your reply (fill in prices)</p>
          <textarea
            value={reply}
            onChange={(ev) => setReply(ev.target.value)}
            rows={7}
            className="mt-3 w-full resize-y border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-sage"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button onClick={whatsapp} className="inline-flex items-center gap-2 bg-whatsapp px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-white hover:brightness-95">
              <WhatsAppIcon size={15} /> Reply on WhatsApp
            </button>
            <button onClick={() => save()} disabled={saving} className="inline-flex items-center gap-2 border border-ink px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink hover:bg-ink hover:text-paper disabled:opacity-60">
              {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
              {saved ? "Saved" : "Save"}
            </button>
            <select value={status} onChange={(ev) => save(ev.target.value)} className="border border-line bg-paper px-3 py-2.5 text-[0.7rem] uppercase tracking-[0.1em] text-ink outline-none focus:border-sage">
              <option value="new">New</option>
              <option value="quoted">Quoted</option>
              <option value="closed">Closed</option>
            </select>
            <button onClick={del} disabled={deleting} className="ml-auto inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.1em] text-red-600 hover:text-red-700 disabled:opacity-60">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
