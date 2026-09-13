"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "./icons";
import { sendContactEmail } from "@/app/admin/actions";

const MATERIALS = [
  "Marble",
  "Granite",
  "Black Galaxy Granite",
  "Natural Stones (Tandoor / Kadappa / Kota)",
  "Cobbles & Pebbles",
  "Cladding Stone",
  "General Enquiry",
];

export default function ContactForm({
  whatsappNumber,
}: {
  whatsappNumber: string;
  email?: string;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "",
    material: MATERIALS[0],
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function compose() {
    return [
      `Hello Stonic Export!`,
      form.name && `Name: ${form.name}`,
      form.email && `Email: ${form.email}`,
      form.country && `Country: ${form.country}`,
      `Material requirement: ${form.material}`,
      form.message && `Message: ${form.message}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Please enter your name.");
    setSending(true);
    try {
      const res = await sendContactEmail(form);
      if (res.ok) {
        setSent(true);
      } else {
        setError(
          res.error === "not_configured"
            ? "Our email inbox isn't ready yet — please send via WhatsApp below."
            : "Couldn't send right now — please try WhatsApp below.",
        );
      }
    } catch {
      setError("Couldn't send right now — please try WhatsApp below.");
    } finally {
      setSending(false);
    }
  }

  function onWhatsApp() {
    window.open(whatsappLink(whatsappNumber, compose()), "_blank", "noopener");
  }

  const field =
    "w-full border-b border-line bg-transparent py-3 text-ink placeholder:text-ink-3 focus:border-ink focus:outline-none transition-colors";
  const label = "text-[0.7rem] uppercase tracking-[0.16em] text-ink-3";

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-md border border-line bg-paper-2/50 px-8 py-14 text-center">
        <CheckCircle2 size={54} className="text-sage" strokeWidth={1.4} />
        <h3 className="font-serif text-2xl text-ink">Enquiry sent!</h3>
        <p className="max-w-sm text-sm leading-relaxed text-ink-2">
          Thank you, {form.name.split(" ")[0]}. We&rsquo;ve received your enquiry and will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => { setSent(false); setForm({ name: "", email: "", country: "", material: MATERIALS[0], message: "" }); }}
          className="link-underline mt-1 text-[0.75rem] uppercase tracking-[0.14em] text-ink"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <div>
        <label className={label} htmlFor="cf-name">Name</label>
        <input id="cf-name" className={field} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="cf-email">Email</label>
          <input id="cf-email" type="email" className={field} placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className={label} htmlFor="cf-country">Country</label>
          <input id="cf-country" className={field} placeholder="Where are you based?" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        </div>
      </div>
      <div>
        <label className={label} htmlFor="cf-material">Material requirement</label>
        <select id="cf-material" className={`${field} cursor-pointer`} value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}>
          {MATERIALS.map((i) => (<option key={i} value={i}>{i}</option>))}
        </select>
      </div>
      <div>
        <label className={label} htmlFor="cf-message">Message</label>
        <textarea id="cf-message" rows={3} className={`${field} resize-none`} placeholder="Tell us about your project, quantities, timeline…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </div>

      {error ? <p className="border-l-2 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p> : null}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex flex-1 items-center justify-center gap-2.5 bg-ink px-7 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-sage disabled:opacity-60"
        >
          {sending ? <Loader2 size={17} className="animate-spin" /> : null}
          {sending ? "Sending…" : "Send enquiry"}
        </button>
        <button
          type="button"
          onClick={onWhatsApp}
          className="inline-flex flex-1 items-center justify-center gap-2.5 bg-whatsapp px-7 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:brightness-95"
        >
          <WhatsAppIcon size={18} /> WhatsApp
        </button>
      </div>
      <p className="text-xs leading-relaxed text-ink-3">
        Your enquiry is emailed to our team. Prefer chat? Use WhatsApp for an instant reply.
      </p>
    </form>
  );
}
