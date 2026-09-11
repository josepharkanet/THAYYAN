import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import catalog from "./catalog.json";

const prisma = new PrismaClient();

async function main() {
  // 1) Admin user (always ensured; password only set on first creation)
  const email = (process.env.ADMIN_EMAIL || "shijo@stonicexport.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Stonic@2026";
  const name = process.env.ADMIN_NAME || "Shijo Thayyil";
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash, name },
    update: { name },
  });
  console.log(`✔ Admin user ready: ${email}`);

  // Only seed sample content into an EMPTY database, so redeploys never
  // overwrite Shijo's edits.
  const categoryCount = await prisma.category.count();
  if (categoryCount === 0) {
    for (const c of catalog.categories) {
      await prisma.category.create({
        data: {
          id: c.id,
          name: c.name,
          description: c.description,
          imageUrl: c.imageUrl,
          sortOrder: c.sortOrder,
        },
      });
    }
    console.log(`✔ ${catalog.categories.length} categories seeded`);
  } else {
    console.log(`• ${categoryCount} categories already present — skipping`);
  }

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    for (const p of catalog.products) {
      await prisma.product.create({
        data: {
          slug: p.slug,
          name: p.name,
          categoryId: p.categoryId,
          description: p.description,
          origin: p.origin,
          finish: p.finish,
          thickness: p.thickness,
          imageUrl: p.imageUrl,
          featured: p.featured,
          sortOrder: p.sortOrder,
          applications: JSON.stringify(p.applications),
          gallery: {
            create: (p.gallery || []).map((url: string, i: number) => ({
              url,
              sortOrder: i,
            })),
          },
        },
      });
    }
    console.log(`✔ ${catalog.products.length} products seeded`);
  } else {
    console.log(`• ${productCount} products already present — skipping`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
