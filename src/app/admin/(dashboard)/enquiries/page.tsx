import { prisma } from "@/lib/db";
import EnquiryManager, { type AdminEnquiry } from "@/components/admin/EnquiryManager";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const rows = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });
  const newCount = rows.filter((r) => r.status === "new").length;

  const enquiries: AdminEnquiry[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    phone: r.phone,
    email: r.email,
    note: r.note,
    items: (() => {
      try {
        return JSON.parse(r.items);
      } catch {
        return [];
      }
    })(),
    status: r.status,
    reply: r.reply,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div>
      <p className="eyebrow">Ready Stock</p>
      <h1 className="mt-3 font-serif text-4xl font-light text-ink">Enquiries</h1>
      <p className="mt-2 text-ink-2">
        Customer ready-stock lists. Fill in prices and reply on WhatsApp.
        {newCount > 0 ? <span className="ml-2 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">{newCount} new</span> : null}
      </p>
      <EnquiryManager enquiries={enquiries} />
    </div>
  );
}
