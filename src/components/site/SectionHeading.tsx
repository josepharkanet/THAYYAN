import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-4 font-serif text-[2rem] leading-[1.1] text-ink sm:text-[2.6rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-ink-2">{description}</p>
      ) : null}
    </div>
  );
}
