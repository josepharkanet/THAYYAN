import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { renderMarkdown } from "@/lib/markdown";
import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/site/icons";

async function getPost(slug: string) {
  return prisma.post.findFirst({ where: { slug, published: true } });
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    keywords: post.keywords ?? undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
      publishedTime: post.publishedAt.toISOString(),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPost(slug), getSettings()]);
  if (!post) notFound();

  const [related, html] = await Promise.all([
    prisma.post.findMany({
      where: { published: true, NOT: { id: post.id } },
      orderBy: { publishedAt: "desc" },
      take: 2,
    }),
    Promise.resolve(renderMarkdown(post.content)),
  ]);

  const tags = (post.keywords ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "Stonic Export" },
    publisher: { "@type": "Organization", name: "Stonic Export" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-5 pb-16 pt-28 sm:px-8 sm:pt-36">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.14em] text-ink-3 transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} /> Blog
        </Link>

        <p className="mt-8 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-sage">
          {formatDate(post.publishedAt)}
        </p>
        <h1 className="mt-4 font-serif text-[2rem] font-light leading-[1.1] text-ink sm:text-[2.6rem]">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="mt-5 text-lg leading-relaxed text-ink-2">{post.excerpt}</p>
        ) : null}

        {post.coverImage ? (
          <div className="mt-8 aspect-[16/9] overflow-hidden bg-paper-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
          </div>
        ) : null}

        <div
          className="prose mt-10"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {tags.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-line pt-8">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-line bg-paper-2/60 px-3.5 py-1.5 text-xs text-ink-2"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {/* CTA */}
        <div className="mt-10 flex flex-col items-start gap-4 bg-ink p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-2xl text-paper">Have a project in mind?</p>
            <p className="mt-1 text-sm text-paper/60">
              Quarry-direct stone, delivered across Kerala &amp; India, with laying and after-sales service.
            </p>
          </div>
          <a
            href={whatsappLink(settings.whatsappNumber, "Hello Stonic Export! I read your article and have a question.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2.5 bg-whatsapp px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:brightness-95"
          >
            <WhatsAppIcon size={18} /> Ask us
          </a>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-line bg-paper-2/40">
          <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
            <h2 className="font-serif text-2xl text-ink">Keep reading</h2>
            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
                    {r.coverImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={r.coverImage} alt={r.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : null}
                  </div>
                  <h3 className="mt-4 font-serif text-xl leading-snug text-ink transition-colors group-hover:text-sage">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
