"use client";

import { ICONS, ICON_KEYS } from "@/lib/content";
import { cn } from "@/lib/utils";

export default function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {ICON_KEYS.map((k) => {
        const Icon = ICONS[k];
        return (
          <button
            key={k}
            type="button"
            title={k}
            onClick={() => onChange(k)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-sm border transition-colors",
              value === k
                ? "border-ink bg-ink text-paper"
                : "border-line text-ink-2 hover:border-ink/40",
            )}
          >
            <Icon size={18} strokeWidth={1.5} />
          </button>
        );
      })}
    </div>
  );
}
