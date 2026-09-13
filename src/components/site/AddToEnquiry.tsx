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
  slug,
  name,
  imageUrl,
  variant = "chip",
}: {
  slug: string;
  name: string;
  imageUrl: string;
  variant?: "chip" | "button";
}) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const sync = () => setAdded(inEnquiry(slug));
    sync();
    return onEnquiryChange(sync);
  }, [slug]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (added) removeFromEnquiry(slug);
    else addToEnquiry({ slug, name, imageUrl, qty: 1 });
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
