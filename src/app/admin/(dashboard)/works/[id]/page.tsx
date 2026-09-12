import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseApplications } from "@/lib/utils";
import WorkForm from "@/components/admin/WorkForm";

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const work = await prisma.work.findUnique({ where: { id } });
  if (!work) notFound();

  return (
    <WorkForm
      work={{
        id: work.id,
        title: work.title,
        category: work.category,
        location: work.location ?? "",
        year: work.year ?? "",
        description: work.description ?? "",
        imageUrl: work.imageUrl,
        gallery: parseApplications(work.gallery),
        featured: work.featured,
        sortOrder: work.sortOrder,
      }}
    />
  );
}
