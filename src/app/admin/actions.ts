"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  getSession,
  verifyPassword,
  createToken,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { SETTING_DEFAULTS, type SettingKey } from "@/lib/settings";

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

function revalidateSite() {
  revalidatePath("/", "layout");
}

/* ─────────────────────────────── Auth ─────────────────────────────── */

export async function login(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const from = String(formData.get("from") || "/admin");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Invalid email or password." };
  }

  const token = await createToken({
    sub: String(user.id),
    email: user.email,
    name: user.name,
  });
  await setSessionCookie(token);
  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/admin/login");
}

/* ───────────────────────────── Products ───────────────────────────── */

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional().default(""),
  origin: z.string().optional().default(""),
  finish: z.string().optional().default(""),
  thickness: z.string().optional().default(""),
  imageUrl: z.string().min(1, "A main image is required"),
  featured: z.boolean().optional().default(false),
  sortOrder: z.number().optional().default(0),
  applications: z.array(z.string()).optional().default([]),
  gallery: z.array(z.string()).optional().default([]),
});

export type ProductInput = z.input<typeof productSchema>;

async function uniqueSlug(base: string, ignoreId?: string) {
  let slug = slugify(base) || "product";
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing && existing.id !== ignoreId) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return slug;
}

export async function upsertProduct(input: ProductInput) {
  await requireAdmin();
  const data = productSchema.parse(input);

  const slug = await uniqueSlug(data.slug || data.name, data.id);
  const base = {
    name: data.name,
    slug,
    categoryId: data.categoryId,
    description: data.description || null,
    origin: data.origin || null,
    finish: data.finish || null,
    thickness: data.thickness || null,
    imageUrl: data.imageUrl,
    featured: data.featured,
    sortOrder: data.sortOrder,
    applications: JSON.stringify(data.applications ?? []),
  };

  const gallery = (data.gallery ?? []).filter(Boolean);

  if (data.id) {
    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: data.id } }),
      prisma.product.update({
        where: { id: data.id },
        data: {
          ...base,
          gallery: {
            create: gallery.map((url, i) => ({ url, sortOrder: i })),
          },
        },
      }),
    ]);
  } else {
    await prisma.product.create({
      data: {
        ...base,
        gallery: { create: gallery.map((url, i) => ({ url, sortOrder: i })) },
      },
    });
  }

  revalidateSite();
  return { ok: true };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidateSite();
  return { ok: true };
}

/* ──────────────────────────── Categories ──────────────────────────── */

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  sortOrder: z.number().optional().default(0),
});

export type CategoryInput = z.input<typeof categorySchema>;

export async function upsertCategory(input: CategoryInput) {
  await requireAdmin();
  const data = categorySchema.parse(input);

  const base = {
    name: data.name,
    description: data.description || null,
    imageUrl: data.imageUrl || null,
    sortOrder: data.sortOrder ?? 0,
  };

  if (data.id) {
    await prisma.category.update({ where: { id: data.id }, data: base });
  } else {
    const id = slugify(data.name);
    const exists = await prisma.category.findUnique({ where: { id } });
    if (exists) return { ok: false, error: "A category with that name exists." };
    await prisma.category.create({ data: { id, ...base } });
  }

  revalidateSite();
  return { ok: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return {
      ok: false,
      error: `Move or delete its ${count} product(s) first.`,
    };
  }
  await prisma.category.delete({ where: { id } });
  revalidateSite();
  return { ok: true };
}

/* ───────────────────────────── Settings ───────────────────────────── */

export async function saveSettings(values: Record<string, string>) {
  await requireAdmin();
  const keys = Object.keys(SETTING_DEFAULTS) as SettingKey[];

  await prisma.$transaction(
    keys
      .filter((k) => k in values)
      .map((k) =>
        prisma.setting.upsert({
          where: { key: k },
          create: { key: k, value: values[k] ?? "" },
          update: { value: values[k] ?? "" },
        }),
      ),
  );

  revalidateSite();
  return { ok: true };
}

/* ─────────────────────────── Blog posts ──────────────────────────── */

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  excerpt: z.string().optional().default(""),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional().default(""),
  keywords: z.string().optional().default(""),
  published: z.boolean().optional().default(true),
});

export type PostInput = z.input<typeof postSchema>;

async function uniquePostSlug(base: string, ignoreId?: string) {
  let slug = slugify(base) || "post";
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing && existing.id !== ignoreId) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return slug;
}

export async function upsertPost(input: PostInput) {
  await requireAdmin();
  const data = postSchema.parse(input);
  const slug = await uniquePostSlug(data.slug || data.title, data.id);

  const base = {
    title: data.title,
    slug,
    excerpt: data.excerpt || null,
    content: data.content,
    coverImage: data.coverImage || null,
    keywords: data.keywords || null,
    published: data.published,
  };

  if (data.id) {
    await prisma.post.update({ where: { id: data.id }, data: base });
  } else {
    await prisma.post.create({ data: { ...base, publishedAt: new Date() } });
  }

  revalidateSite();
  return { ok: true };
}

export async function deletePost(id: string) {
  await requireAdmin();
  await prisma.post.delete({ where: { id } });
  revalidateSite();
  return { ok: true };
}

/* ───────────────────────────── Services ───────────────────────────── */

const serviceSchema = z.object({
  id: z.string().optional(),
  icon: z.string().default("mountain"),
  subtitle: z.string().min(1, "Subtitle is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().min(1, "An image is required"),
  highlights: z.array(z.string()).optional().default([]),
  sortOrder: z.number().optional().default(0),
});
export type ServiceInput = z.input<typeof serviceSchema>;

export async function upsertService(input: ServiceInput) {
  await requireAdmin();
  const d = serviceSchema.parse(input);
  const data = {
    icon: d.icon,
    subtitle: d.subtitle,
    title: d.title,
    description: d.description,
    imageUrl: d.imageUrl,
    highlights: JSON.stringify(d.highlights ?? []),
    sortOrder: d.sortOrder ?? 0,
  };
  if (d.id) await prisma.service.update({ where: { id: d.id }, data });
  else await prisma.service.create({ data });
  revalidateSite();
  return { ok: true };
}

export async function deleteService(id: string) {
  await requireAdmin();
  await prisma.service.delete({ where: { id } });
  revalidateSite();
  return { ok: true };
}

/* ────────────────────────────── Values ────────────────────────────── */

const valueSchema = z.object({
  id: z.string().optional(),
  icon: z.string().default("gem"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  sortOrder: z.number().optional().default(0),
});
export type ValueInput = z.input<typeof valueSchema>;

export async function upsertValue(input: ValueInput) {
  await requireAdmin();
  const d = valueSchema.parse(input);
  const data = {
    icon: d.icon,
    title: d.title,
    description: d.description,
    sortOrder: d.sortOrder ?? 0,
  };
  if (d.id) await prisma.value.update({ where: { id: d.id }, data });
  else await prisma.value.create({ data });
  revalidateSite();
  return { ok: true };
}

export async function deleteValue(id: string) {
  await requireAdmin();
  await prisma.value.delete({ where: { id } });
  revalidateSite();
  return { ok: true };
}

/* ────────────────────────────── Works ─────────────────────────────── */

const workSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  category: z.string().optional().default(""),
  location: z.string().optional().default(""),
  year: z.string().optional().default(""),
  description: z.string().optional().default(""),
  imageUrl: z.string().min(1, "A cover image is required"),
  gallery: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  sortOrder: z.number().optional().default(0),
});
export type WorkInput = z.input<typeof workSchema>;

async function uniqueWorkSlug(base: string, ignoreId?: string) {
  let slug = slugify(base) || "project";
  const existing = await prisma.work.findUnique({ where: { slug } });
  if (existing && existing.id !== ignoreId) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return slug;
}

export async function upsertWork(input: WorkInput) {
  await requireAdmin();
  const d = workSchema.parse(input);
  const slug = await uniqueWorkSlug(d.slug || d.title, d.id);
  const data = {
    title: d.title,
    slug,
    category: d.category || "",
    location: d.location || null,
    year: d.year || null,
    description: d.description || null,
    imageUrl: d.imageUrl,
    gallery: JSON.stringify((d.gallery ?? []).filter(Boolean)),
    featured: d.featured,
    sortOrder: d.sortOrder ?? 0,
  };
  if (d.id) await prisma.work.update({ where: { id: d.id }, data });
  else await prisma.work.create({ data });
  revalidateSite();
  return { ok: true };
}

export async function deleteWork(id: string) {
  await requireAdmin();
  await prisma.work.delete({ where: { id } });
  revalidateSite();
  return { ok: true };
}
