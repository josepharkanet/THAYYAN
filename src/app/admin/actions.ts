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
