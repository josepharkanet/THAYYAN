export type HexImage = { url: string; name?: string };

export default function HexGallery({ images }: { images: HexImage[] }) {
  const imgs = images.slice(0, 9);

  // A "stone gallery" label hex followed by up to 9 photo hexes, laid out 3-4-3.
  const cells: React.ReactNode[] = [
    <div key="label" className="hexcell hexcell--label">
      <div className="px-2">
        <span className="block font-serif text-lg font-bold leading-none text-paper sm:text-xl">
          STONE
        </span>
        <span className="mt-1.5 block text-[0.58rem] font-light uppercase tracking-[0.28em] text-paper/70">
          Gallery
        </span>
      </div>
    </div>,
    ...imgs.map((im, i) => (
      <div key={i} className="hexcell">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={im.url} alt={im.name ?? ""} loading="lazy" decoding="async" />
      </div>
    )),
  ];

  const rows = [cells.slice(0, 3), cells.slice(3, 7), cells.slice(7, 10)];

  return (
    <div className="honeycomb">
      {rows.map((row, ri) => (
        <div key={ri} className="hc-row">
          {row}
        </div>
      ))}
    </div>
  );
}
