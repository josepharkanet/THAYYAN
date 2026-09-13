import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Star, Quote } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import FeedbackSubmit from "@/components/site/FeedbackSubmit";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description:
    "Real feedback from Stonic Export customers — photos, videos and stories from homes, builders and projects across Kerala, India and beyond.",
};

type FB = {
  id: string;
  name: string;
  location: string | null;
  type: string;
  message: string | null;
  mediaUrl: string | null;
  rating: number | null;
};

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={15} className={i <= n ? "fill-amber-400 text-amber-400" : "text-line"} />
      ))}
    </div>
  );
}

function Card({ f }: { f: FB }) {
  return (
    <div className="mb-6 break-inside-avoid overflow-hidden rounded-md border border-line bg-paper">
      {f.type === "video" && f.mediaUrl ? (
        <video src={f.mediaUrl} className="w-full" controls playsInline preload="metadata" />
      ) : null}
      {f.type === "image" && f.mediaUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={f.mediaUrl} alt={`Feedback from ${f.name}`} loading="lazy" className="w-full object-cover" />
      ) : null}
      <div className="p-6">
        {f.rating ? <Stars n={f.rating} /> : null}
        {f.message ? (
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">
            {f.type === "text" ? <Quote size={18} className="mb-1 inline text-sage" /> : null} {f.message}
          </p>
        ) : null}
        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-soft font-serif text-sage">
            {f.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{f.name}</p>
            {f.location ? <p className="text-xs text-ink-3">{f.location}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function FeedbackPage() {
  const items = (await prisma.feedback
    .findMany({
      where: { approved: true },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    })
    .catch(() => [])) as FB[];

  return (
    <>
      {/* Hero */}
      <section className="bg-ink px-5 pb-20 pt-36 text-center sm:px-8 sm:pt-44 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-sage">Customer Stories</p>
          <h1 className="mt-5 font-serif text-[2.3rem] font-light leading-[1.04] text-paper sm:text-[3.2rem]">
            What our clients say
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-paper/60">
            Homes, builders and projects across Kerala, India and beyond, in their own words, photos and videos.
          </p>
          <div className="mt-8 flex justify-center">
            <FeedbackSubmit variant="outline" />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif text-3xl text-ink">Be the first to share</p>
            <p className="mx-auto mt-3 max-w-md text-ink-2">
              We&rsquo;d love to hear about your experience with Stonic Export.
            </p>
            <div className="mt-7 flex justify-center">
              <FeedbackSubmit />
            </div>
          </div>
        ) : (
          <Reveal>
            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
              {items.map((f) => (
                <Card key={f.id} f={f} />
              ))}
            </div>
          </Reveal>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-paper-2/40">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
          <h2 className="font-serif text-[1.9rem] font-light leading-tight text-ink sm:text-[2.4rem]">
            Worked with us? Share your experience
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-ink-2">
            Post a review with a photo or video, it helps other customers choose with confidence.
          </p>
          <div className="mt-7 flex justify-center">
            <FeedbackSubmit />
          </div>
        </div>
      </section>
    </>
  );
}
