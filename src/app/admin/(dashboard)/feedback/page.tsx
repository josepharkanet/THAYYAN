import { prisma } from "@/lib/db";
import FeedbackManager, { type AdminFeedback } from "@/components/admin/FeedbackManager";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  const rows = await prisma.feedback.findMany({
    orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
  });
  const pending = rows.filter((r) => !r.approved).length;

  const feedback: AdminFeedback[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    location: r.location,
    type: r.type,
    message: r.message,
    mediaUrl: r.mediaUrl,
    rating: r.rating,
    approved: r.approved,
  }));

  return (
    <div>
      <p className="eyebrow">Reviews</p>
      <h1 className="mt-3 font-serif text-4xl font-light text-ink">Customer Feedback</h1>
      <p className="mt-2 text-ink-2">
        Approve customer submissions to show them on the Reviews page, or add your own.
        {pending > 0 ? <span className="ml-2 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">{pending} pending</span> : null}
      </p>
      <FeedbackManager feedback={feedback} />
    </div>
  );
}
