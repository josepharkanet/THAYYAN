import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseApplications } from "@/lib/utils";
import ServiceForm from "@/components/admin/ServiceForm";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <ServiceForm
      service={{
        id: service.id,
        icon: service.icon,
        subtitle: service.subtitle,
        title: service.title,
        description: service.description,
        imageUrl: service.imageUrl,
        highlights: parseApplications(service.highlights),
        sortOrder: service.sortOrder,
      }}
    />
  );
}
