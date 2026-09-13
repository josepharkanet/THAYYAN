"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { WhatsAppIcon } from "./icons";

export default function ShareCatalog() {
  const [copied, setCopied] = useState(false);

  function currentUrl() {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  function copy() {
    const url = currentUrl();
    navigator.clipboard?.writeText(url).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {},
    );
  }

  function shareWhatsApp() {
    const text = `Stonic Export — Ready Stock catalogue:\n${currentUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={shareWhatsApp}
        className="inline-flex items-center gap-2 bg-whatsapp px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:brightness-95"
      >
        <WhatsAppIcon size={16} /> Share catalogue
      </button>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-2 border border-ink px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-paper"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
