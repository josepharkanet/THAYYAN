"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn } from "lucide-react";

/** Side-by-side ready-stock block thumbnails with Sqft + click/lens zoom. */
export default function ReadyBlocksStrip({
  blocks,
}: {
  blocks: { url: string; qty: string | null }[];
}) {
  const [zoom, setZoom] = useState<string | null>(null);

  useEffect(() => {
    if (!zoom) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [zoom]);

  return (
    <>
      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {blocks.map((b, i) => (
          <div key={i}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setZoom(b.url);
              }}
              aria-label={`Zoom slab ${b.qty ? `${b.qty} Sqft` : i + 1}`}
              className="group/blk relative block aspect-square w-full overflow-hidden rounded-sm border border-line bg-paper-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.url}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover/blk:scale-110"
              />
              <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/55 text-white backdrop-blur transition-colors group-hover/blk:bg-ink/75">
                <ZoomIn size={12} />
              </span>
            </button>
            <p className="mt-1.5 text-center text-[0.82rem] font-semibold text-sage">
              {b.qty ? `${b.qty} Sqft` : "Avail."}
            </p>
          </div>
        ))}
      </div>

      {zoom && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4"
              onClick={() => setZoom(null)}
            >
              <button
                type="button"
                onClick={() => setZoom(null)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <X size={24} />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoom}
                alt=""
                className="max-h-[92vh] max-w-[96vw] object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
