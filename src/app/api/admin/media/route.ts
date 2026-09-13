import { NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IMG = /\.(jpe?g|png|webp|avif|gif)$/i;

function uploadDir() {
  return path.resolve(process.cwd(), process.env.UPLOAD_DIR || "./public/uploads");
}

// List files in a public/ subdir, returned as web paths.
async function listPublic(rel: string, pick?: (name: string) => boolean): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", rel);
  try {
    const names = await readdir(dir);
    return names
      .filter((n) => IMG.test(n) && (!pick || pick(n)))
      .map((n) => `/${rel}/${n}`.replace(/\/+/g, "/"));
  } catch {
    return [];
  }
}

// Scan one level of subfolders for a specific file (e.g. main.jpg / cover.jpg).
async function listNested(rel: string, file: string): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", rel);
  const out: string[] = [];
  try {
    for (const sub of await readdir(dir)) {
      try {
        const p = path.join(dir, sub, file);
        await stat(p);
        out.push(`/${rel}/${sub}/${file}`);
      } catch {
        /* no such file */
      }
    }
  } catch {
    /* no dir */
  }
  return out;
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1) Admin-uploaded media (persistent volume) — newest first
  let uploaded: string[] = [];
  try {
    const dir = uploadDir();
    const names = (await readdir(dir)).filter((n) => IMG.test(n));
    names.sort().reverse(); // filenames start with a timestamp
    uploaded = names.map((n) => `/media/${n}`);
  } catch {
    uploaded = [];
  }

  // 2) Static images already on the site
  const [products, collections, works, about, root] = await Promise.all([
    listNested("product-images", "main.jpg"),
    listPublic("collections"),
    listNested("works", "cover.jpg"),
    listPublic("about"),
    listPublic("", (n) => n !== "logo.png"),
  ]);

  const site = [...collections, ...works, ...about, ...root, ...products];
  // de-dupe, keep order (uploaded first)
  const images = Array.from(new Set([...uploaded, ...site]));

  return NextResponse.json({ images });
}
