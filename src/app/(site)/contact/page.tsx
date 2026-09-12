import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { whatsappLink } from "@/lib/utils";
import ContactForm from "@/components/site/ContactForm";
import { WhatsAppIcon } from "@/components/site/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Stonic Export for premium marble, granite and natural stone. WhatsApp, call or email us for pricing, samples and worldwide shipping.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      {/* Header */}
      <section className="border-b border-line bg-paper-2/40 px-5 pb-14 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-5 max-w-3xl font-serif text-[2.2rem] font-light leading-[1.04] text-ink sm:text-[3.1rem]">
            Let&rsquo;s talk stone
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-2">
            Tell us what you&rsquo;re looking for and we&rsquo;ll get back to you with pricing,
            samples and lead times. We reply fastest on WhatsApp.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Contact details */}
          <div className="lg:col-span-5">
            <a
              href={whatsappLink(settings.whatsappNumber, "Hello Stonic Export!")}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-whatsapp p-6 text-white transition-colors hover:brightness-95"
            >
              <WhatsAppIcon size={30} />
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.16em] text-white/80">Fastest reply</p>
                <p className="font-serif text-2xl">Chat on WhatsApp</p>
              </div>
            </a>

            <dl className="mt-10 space-y-8">
              <ContactRow icon={<Phone size={20} strokeWidth={1.5} />} label="Phone">
                <a href={`tel:${settings.contactPhone1.replace(/\s/g, "")}`} className="block text-lg text-ink transition-colors hover:text-sage">
                  {settings.contactPhone1}
                </a>
                <a href={`tel:${settings.contactPhone2.replace(/\s/g, "")}`} className="block text-lg text-ink transition-colors hover:text-sage">
                  {settings.contactPhone2}
                </a>
              </ContactRow>
              <ContactRow icon={<Mail size={20} strokeWidth={1.5} />} label="Email">
                <a href={`mailto:${settings.contactEmail}`} className="text-lg text-ink transition-colors hover:text-sage">
                  {settings.contactEmail}
                </a>
              </ContactRow>
              <ContactRow icon={<MapPin size={20} strokeWidth={1.5} />} label="Location">
                <p className="text-lg text-ink">{settings.address}</p>
              </ContactRow>
              <ContactRow icon={<Clock size={20} strokeWidth={1.5} />} label="Hours">
                <p className="text-lg text-ink">Mon – Sat · 9:00 – 19:00 IST</p>
              </ContactRow>
            </dl>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="border border-line bg-surface p-7 sm:p-10">
              <h2 className="font-serif text-[1.8rem] leading-tight text-ink sm:text-[2.2rem]">
                Send an enquiry
              </h2>
              <p className="mt-2 text-sm text-ink-2">
                Fill this in and choose how to send it, WhatsApp or email.
              </p>
              <div className="mt-8">
                <ContactForm
                  whatsappNumber={settings.whatsappNumber}
                  email={settings.contactEmail}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage">
        {icon}
      </span>
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.16em] text-ink-3">{label}</p>
        <div className="mt-1.5">{children}</div>
      </div>
    </div>
  );
}
