import { prisma } from "@/lib/db";
import ValueManager from "@/components/admin/ValueManager";

export default async function AdminValuesPage() {
  const values = await prisma.value.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <ValueManager
      values={values.map((v) => ({
        id: v.id,
        icon: v.icon,
        title: v.title,
        description: v.description,
        sortOrder: v.sortOrder,
      }))}
    />
  );
}
