import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseApplications } from "@/lib/utils";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { gallery: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <ProductForm
      categories={categories}
      product={{
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,
        description: product.description ?? "",
        origin: product.origin ?? "",
        finish: product.finish ?? "",
        thickness: product.thickness ?? "",
        imageUrl: product.imageUrl,
        featured: product.featured,
        readyStock: product.readyStock,
        sortOrder: product.sortOrder,
        applications: parseApplications(product.applications),
        gallery: product.gallery.map((g) => g.url),
      }}
    />
  );
}
