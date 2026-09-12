import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/db";
import Reveal from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: "Stone Guides & Insights",
  description:
    "Guides on marble, granite and natural stone for Indian homes, prices, buying tips, flooring and cladding ideas, and how to buy quarry-direct with doorstep delivery across Kerala & India.",
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <section className="border-b border-line bg-paper-2/40 px-5 pb-14 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Blog</p>
          <h1 className="mt-5 max-w-3xl font-serif text-[2.2rem] font-light leading-[1.04] text-ink sm:text-[3.1rem]">
            Stone guides &amp; insights
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-2">
            Practical advice on marble, granite and natural stone for Indian homes
, prices, buying tips, and design ideas from the Stonic team.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        {posts.length === 0 ? (
          <p className="py-20 text-center text-ink-2">Articles are coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 90}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
                    {post.coverImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <p className="mt-5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-sage">
                    {formatDate(post.publishedAt)}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl leading-snug text-ink transition-colors group-hover:text-sage">
                    {post.title}
                  </h2>
                  {post.excerpt ? (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-2">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <span className="mt-3 inline-flex items-center gap-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink">
                    Read more <ArrowUpRight size={14} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
