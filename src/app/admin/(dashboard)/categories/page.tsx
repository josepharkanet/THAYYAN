import { prisma } from "@/lib/db";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <CategoryManager
      categories={categories.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description ?? "",
        imageUrl: c.imageUrl ?? "",
        sortOrder: c.sortOrder,
        productCount: c._count.products,
      }))}
    />
  );
}
