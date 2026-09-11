import { cn } from "@/lib/utils";

const DEFAULT_ITEMS = [
  "Indian Marble",
  "Granite",
  "Kota Stone",
  "Cladding Stone",
  "Black Galaxy",
  "Tandoor",
  "Kadappa",
  "Italian Marble",
];

export default function Marquee({
  items = DEFAULT_ITEMS,
  dark = false,
}: {
  items?: string[];
  dark?: boolean;
}) {
  // Duplicate the set so the -50% translate loops seamlessly.
  const row = [...items, ...items];
  return (
    <div
      className={cn(
        "marquee border-y py-6",
        dark ? "border-paper/10 bg-ink" : "border-line bg-paper",
      )}
      aria-hidden="true"
    >
      <div className="marquee__track">
        {row.map((t, i) => (
          <span key={i} className="flex items-center">
            <span
              className={cn(
                "font-serif text-2xl font-light tracking-tight sm:text-3xl",
                dark ? "text-paper/90" : "text-ink",
              )}
            >
              {t}
            </span>
            <span className="mx-7 text-sage sm:mx-10" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
