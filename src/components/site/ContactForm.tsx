"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "./icons";

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
  email,
}: {
  whatsappNumber: string;
  email: string;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "",
    material: MATERIALS[0],
    message: "",
  });

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

  function onWhatsApp(e: React.FormEvent) {
    e.preventDefault();
    window.open(whatsappLink(whatsappNumber, compose()), "_blank", "noopener");
  }

  function onEmail() {
    const body = encodeURIComponent(compose());
    const subject = encodeURIComponent(`Enquiry: ${form.material}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  const field =
    "w-full border-b border-line bg-transparent py-3 text-ink placeholder:text-ink-3 focus:border-ink focus:outline-none transition-colors";
  const label = "text-[0.7rem] uppercase tracking-[0.16em] text-ink-3";

  return (
    <form onSubmit={onWhatsApp} className="space-y-7">
      <div>
        <label className={label} htmlFor="cf-name">Name</label>
        <input
          id="cf-name"
          className={field}
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            type="email"
            className={field}
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className={label} htmlFor="cf-country">Country</label>
          <input
            id="cf-country"
            className={field}
            placeholder="Where are you based?"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className={label} htmlFor="cf-material">Material requirement</label>
        <select
          id="cf-material"
          className={`${field} cursor-pointer`}
          value={form.material}
          onChange={(e) => setForm({ ...form, material: e.target.value })}
        >
          {MATERIALS.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={label} htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message"
          rows={3}
          className={`${field} resize-none`}
          placeholder="Tell us about your project, quantities, timeline…"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="submit"
          className="inline-flex flex-1 items-center justify-center gap-2.5 bg-whatsapp px-7 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:brightness-95"
        >
          <WhatsAppIcon size={18} /> Send via WhatsApp
        </button>
        <button
          type="button"
          onClick={onEmail}
          className="inline-flex flex-1 items-center justify-center gap-2 border border-ink px-7 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Send via Email <ArrowRight size={15} />
        </button>
      </div>
      <p className="text-xs leading-relaxed text-ink-3">
        Your details open a pre-filled message in WhatsApp or your email app, nothing
        is stored on this site.
      </p>
    </form>
  );
}
