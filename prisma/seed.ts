import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import catalog from "./catalog.json";
import { POSTS } from "./blog-data";

const prisma = new PrismaClient();

const services = [
  {
    icon: "mountain",
    subtitle: "From the Source",
    title: "Quarry-Direct Sourcing",
    imageUrl: "/product-images/katni-marble/main.jpg",
    description:
      "True quality control begins at the source. Based in India's key stone hubs, including Kishangarh, our team regularly visits renowned quarries to handpick the finest raw blocks, eliminating middlemen to ensure premium quality and competitive pricing.",
    highlights: ["Kishangarh, India", "Handpicked Raw Blocks", "No Middlemen", "Competitive Pricing"],
  },
  {
    icon: "factory",
    subtitle: "State-of-the-Art Factories",
    title: "Precision Processing & Finishing",
    imageUrl: "/product-images/morwad-white-marble/main.jpg",
    description:
      "Carefully selected materials are brought to state-of-the-art factories, where they undergo precise cutting, polishing and finishing processes, every slab prepared to meet strict international export standards.",
    highlights: ["Precision Cutting", "Polishing & Finishing", "Export Standards", "Strict Quality Control"],
  },
  {
    icon: "ship",
    subtitle: "End-to-End Delivery",
    title: "Global Export & Logistics",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1400",
    description:
      "Delivering heavy natural stone across continents requires unparalleled logistics expertise. We adhere to robust wooden packaging protocols and international shipping standards, guaranteeing safe, secure and timely delivery to the Middle East and our new routes to China and Canada.",
    highlights: ["Wooden-Crate Packaging", "International Shipping", "Middle East & Beyond", "Safe, Timely Delivery"],
  },
];

const values = [
  { icon: "mountain", title: "Quarry-Direct", description: "Handpicked at the source across India, no middlemen, better value." },
  { icon: "globe", title: "Global Export Network", description: "Trusted supply across the Middle East, expanding to China & Canada." },
  { icon: "gem", title: "Export-Grade Quality", description: "Every slab finished to strict international standards." },
  { icon: "award", title: "12 Years of Expertise", description: "Over a decade sourcing and finishing the finest natural stone." },
];

const works = [
  {
    slug: "sacred-heart-church",
    title: "Sacred Heart Church",
    category: "Institutional Flooring",
    location: "Kerala, India",
    year: "2024",
    description:
      "A landmark church interior and forecourt finished in polished granite and honed natural stone — from the grass-jointed courtyard paving that welcomes the congregation to the mirror-polished aisle flooring that anchors the sanctuary.",
    imageUrl: "/works/sacred-heart-church/cover.jpg",
    gallery: ["/works/sacred-heart-church/g1.jpg", "/works/sacred-heart-church/g2.jpg"],
    featured: true,
  },
  {
    slug: "hillside-villa",
    title: "Hillside Villa Driveway & Landscape",
    category: "Landscaping",
    location: "Kerala, India",
    year: "2024",
    description:
      "A private residence framed by black Kadappa stone and grey granite pavers set in manicured lawn — a grand entrance driveway and garden walkways laid for durability and timeless kerb appeal.",
    imageUrl: "/works/hillside-villa/cover.jpg",
    gallery: ["/works/hillside-villa/g1.jpg"],
    featured: true,
  },
  {
    slug: "granite-courtyard",
    title: "Granite Courtyard Paving",
    category: "Paving",
    location: "Bangalore, India",
    year: "2023",
    description:
      "A wide residential courtyard paved in leather-finish grey granite with charcoal borders and grass joints — engineered for heavy use while keeping a clean, contemporary rhythm underfoot.",
    imageUrl: "/works/granite-courtyard/cover.jpg",
    gallery: ["/works/granite-courtyard/g1.jpg", "/works/granite-courtyard/g2.jpg"],
    featured: false,
  },
  {
    slug: "cobblestone-plaza",
    title: "Cobblestone Plaza",
    category: "Public Landscaping",
    location: "India",
    year: "2023",
    description:
      "A sweeping public plaza laid in tumbled natural-stone cobbles — fan-patterned setts in mixed granite tones that turn a large civic space into a hard-wearing, characterful walkway.",
    imageUrl: "/works/cobblestone-plaza/cover.jpg",
    gallery: ["/works/cobblestone-plaza/g1.jpg", "/works/cobblestone-plaza/g2.jpg"],
    featured: false,
  },
];

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

  const postCount = await prisma.post.count();
  if (postCount === 0) {
    const now = Date.now();
    for (let i = 0; i < POSTS.length; i++) {
      const p = POSTS[i];
      await prisma.post.create({
        data: {
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          content: p.content,
          coverImage: p.coverImage,
          keywords: p.keywords,
          published: true,
          // stagger publish dates so ordering looks natural
          publishedAt: new Date(now - i * 3 * 24 * 60 * 60 * 1000),
        },
      });
    }
    console.log(`✔ ${POSTS.length} blog posts seeded`);
  } else {
    console.log(`• ${postCount} blog posts already present — skipping`);
  }

  if ((await prisma.service.count()) === 0) {
    for (let i = 0; i < services.length; i++) {
      const s = services[i];
      await prisma.service.create({
        data: {
          icon: s.icon,
          subtitle: s.subtitle,
          title: s.title,
          description: s.description,
          imageUrl: s.imageUrl,
          highlights: JSON.stringify(s.highlights),
          sortOrder: i,
        },
      });
    }
    console.log(`✔ ${services.length} services seeded`);
  } else {
    console.log(`• services already present — skipping`);
  }

  if ((await prisma.value.count()) === 0) {
    for (let i = 0; i < values.length; i++) {
      const v = values[i];
      await prisma.value.create({
        data: { icon: v.icon, title: v.title, description: v.description, sortOrder: i },
      });
    }
    console.log(`✔ ${values.length} values seeded`);
  } else {
    console.log(`• values already present — skipping`);
  }

  if ((await prisma.work.count()) === 0) {
    for (let i = 0; i < works.length; i++) {
      const w = works[i];
      await prisma.work.create({
        data: {
          slug: w.slug,
          title: w.title,
          category: w.category,
          location: w.location,
          year: w.year,
          description: w.description,
          imageUrl: w.imageUrl,
          gallery: JSON.stringify(w.gallery),
          featured: w.featured,
          sortOrder: i,
        },
      });
    }
    console.log(`✔ ${works.length} works seeded`);
  } else {
    console.log(`• works already present — skipping`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
