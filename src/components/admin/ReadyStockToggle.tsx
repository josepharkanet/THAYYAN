"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { setProductReadyStock } from "@/app/admin/actions";

export default function ReadyStockToggle({
  id,
  initial,
}: {
  id: string;
  initial: boolean;
}) {
  const [on, setOn] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    const next = !on;
    setBusy(true);
    setOn(next); // optimistic
    try {
      await setProductReadyStock(id, next);
    } catch {
      setOn(!next); // revert on failure
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={on}
      title={on ? "In ready stock — tap to unmark" : "Mark as ready stock"}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] transition-colors disabled:opacity-60 ${
        on
          ? "border-sage bg-sage-soft text-sage"
          : "border-line text-ink-3 hover:border-sage hover:text-sage"
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-[3px] border transition-colors ${
          on ? "border-sage bg-sage text-white" : "border-line text-transparent"
        }`}
      >
        {busy ? <Loader2 size={11} className="animate-spin text-sage" /> : <Check size={11} strokeWidth={3} />}
      </span>
      Ready stock
    </button>
  );
}
