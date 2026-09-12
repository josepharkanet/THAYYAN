import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { getSettings, getWorks } from "@/lib/settings";
import { whatsappLink } from "@/lib/utils";
import Reveal from "@/components/site/Reveal";
import SectionHeading from "@/components/site/SectionHeading";
import ProductGallery from "@/components/site/ProductGallery";
import { WhatsAppIcon } from "@/components/site/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Works",
  description:
    "Completed projects and installations by Stonic Export — church flooring, villa driveways, granite courtyards and natural-stone landscaping across Kerala and India.",
};

export default async function WorksPage() {
  const [settings, works] = await Promise.all([getSettings(), getWorks()]);

  return (
    <>
      {/* Hero */}
      <section className="bg-ink px-5 pb-20 pt-36 text-center sm:px-8 sm:pt-44 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-sage">
            Our Works
          </p>
          <h1 className="mt-5 font-serif text-[2.3rem] font-light leading-[1.04] text-paper sm:text-[3.2rem]">
            Projects &amp; Installations
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-paper/60">
            From sacred spaces to private residences, a look at the stone we have
            sourced, finished and laid, complete with expert installation and
            after-sales care.
          </p>
        </div>
      </section>

      {/* Projects */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <Reveal>
          <SectionHeading
            eyebrow="Selected Projects"
            title="Craftsmanship, laid in place"
          />
        </Reveal>

        {works.length === 0 ? (
          <p className="mt-16 text-center text-ink-2">Projects coming soon.</p>
        ) : (
          <div className="mt-16 space-y-20 sm:space-y-28">
            {works.map((w, index) => {
              const images = [w.imageUrl, ...w.gallery].filter(Boolean);
              const flipped = index % 2 === 1;
              return (
                <Reveal
                  key={w.id ?? w.slug}
                  className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
                >
                  <div className={flipped ? "lg:order-2" : ""}>
                    <ProductGallery images={images} alt={w.title} />
                  </div>
                  <div className={flipped ? "lg:order-1" : ""}>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-sage">
                        {w.category || "Project"}
                      </p>
                      {w.year ? (
                        <span className="text-[0.7rem] uppercase tracking-[0.16em] text-ink-3">
                          {w.year}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-4 font-serif text-[1.9rem] leading-tight text-ink sm:text-[2.5rem]">
                      {w.title}
                    </h3>
                    {w.location ? (
                      <p className="mt-3 inline-flex items-center gap-2 text-sm text-ink-2">
                        <MapPin size={15} strokeWidth={1.6} className="text-sage" />
                        {w.location}
                      </p>
                    ) : null}
                    <p className="mt-5 text-base leading-relaxed text-ink-2">
                      {w.description}
                    </p>
                    <a
                      href={whatsappLink(
                        settings.whatsappNumber,
                        `Hello Stonic Export! I'd like a project like "${w.title}".`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-7 inline-flex items-center gap-2.5 bg-ink px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-sage"
                    >
                      <WhatsAppIcon size={17} /> Discuss a similar project
                    </a>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-ink">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-28">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-serif text-[2.4rem] font-light leading-[1.05] text-paper sm:text-[3.2rem]">
              Have a project in mind?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-paper/60">
              We supply, lay and finish natural stone for homes, institutions and
              commercial spaces, with after-sales service you can rely on.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={whatsappLink(settings.whatsappNumber, "Hello Stonic Export! I'd like to discuss a project.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-whatsapp px-9 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:brightness-95"
              >
                <WhatsAppIcon size={19} /> Get a Quote
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-paper/25 px-9 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-paper/5"
              >
                Contact Us <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
