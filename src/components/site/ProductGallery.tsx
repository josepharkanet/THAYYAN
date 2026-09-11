"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [""];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-2 sm:aspect-square">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={list[active]}
          src={list[active]}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </div>

      {list.length > 1 ? (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {list.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative aspect-square overflow-hidden bg-paper-2 transition-opacity",
                i === active ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : "opacity-70 hover:opacity-100",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
