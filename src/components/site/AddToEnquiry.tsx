"use client";

import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import {
  addToEnquiry,
  removeFromEnquiry,
  inEnquiry,
  onEnquiryChange,
} from "@/lib/enquiry-store";

export default function AddToEnquiry({
  itemKey,
  slug,
  name,
  imageUrl,
  label,
  variant = "chip",
}: {
  itemKey: string;
  slug: string;
  name: string;
  imageUrl: string;
  label?: string;
  variant?: "chip" | "button" | "block";
}) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const sync = () => setAdded(inEnquiry(itemKey));
    sync();
    return onEnquiryChange(sync);
  }, [itemKey]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (added) removeFromEnquiry(itemKey);
    else addToEnquiry({ key: itemKey, slug, name, imageUrl, label, qty: 1 });
  }

  if (variant === "block") {
    return (
      <button
        type="button"
        onClick={toggle}
        className={`inline-flex w-full items-center justify-center gap-2 border px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] transition-colors ${
          added ? "border-sage bg-sage-soft text-sage" : "border-ink text-ink hover:bg-ink hover:text-paper"
        }`}
      >
        {added ? <><Check size={15} /> Added to list</> : <><Plus size={15} /> Add to list</>}
      </button>
    );
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={toggle}
        className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
          added ? "bg-sage text-white" : "bg-ink text-paper hover:bg-sage"
        }`}
      >
        {added ? <><Check size={16} /> Added to list</> : <><Plus size={16} /> Add to enquiry list</>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={added ? "Remove from enquiry list" : "Add to enquiry list"}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] backdrop-blur transition-colors ${
        added ? "bg-sage text-white" : "bg-white/90 text-ink hover:bg-white"
      }`}
    >
      {added ? <><Check size={13} /> Added</> : <><Plus size={13} /> Add to list</>}
    </button>
  );
}
