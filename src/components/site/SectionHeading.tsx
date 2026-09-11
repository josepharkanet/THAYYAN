import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  index,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  index?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-left",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          align === "center" && "justify-center",
        )}
      >
        {index ? (
          <span className="font-serif text-sm font-medium text-sage">{index}</span>
        ) : null}
        <span className="h-px w-8 bg-sage/50" />
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      </div>
      <h2 className="mt-5 font-serif text-[2.3rem] font-light leading-[1.04] text-ink sm:text-[3.4rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-ink-2">{description}</p>
      ) : null}
    </div>
  );
}
