import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/db";

// Content is DB-backed and edited from the dashboard, always render fresh
// so Shijo's changes appear immediately (and the build never touches the DB).
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories] = await Promise.all([
    getSettings(),
    prisma.category
      .findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } })
      .catch(() => []),
  ]);

  return (
    <>
      <Header siteName={settings.siteName} whatsappNumber={settings.whatsappNumber} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} categories={categories} />
      <WhatsAppFloat number={settings.whatsappNumber} />
    </>
  );
}
