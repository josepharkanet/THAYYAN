import { NextResponse } from "next/server";
import { readdir, stat, unlink } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IMG = /\.(jpe?g|png|webp|avif|gif)$/i;
const VID = /\.(mp4|webm|mov|m4v)$/i;

type MediaItem = { url: string; kind: "image" | "video"; deletable: boolean };

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

  // 1) Admin-uploaded media (persistent volume) — newest first, deletable
  let uploaded: MediaItem[] = [];
  try {
    const names = (await readdir(uploadDir())).filter((n) => IMG.test(n) || VID.test(n));
    names.sort().reverse(); // filenames start with a timestamp
    uploaded = names.map((n) => ({
      url: `/media/${n}`,
      kind: VID.test(n) ? "video" : "image",
      deletable: true,
    }));
  } catch {
    uploaded = [];
  }

  // 2) Static images already on the site (baked into the build — not deletable)
  const [products, collections, works, about, root] = await Promise.all([
    listNested("product-images", "main.jpg"),
    listPublic("collections"),
    listNested("works", "cover.jpg"),
    listPublic("about"),
    listPublic("", (n) => n !== "logo.png"),
  ]);
  const staticItems: MediaItem[] = [...collections, ...works, ...about, ...root, ...products].map(
    (url) => ({ url, kind: "image", deletable: false }),
  );

  // de-dupe by url, keep order (uploaded first)
  const seen = new Set<string>();
  const items = [...uploaded, ...staticItems].filter((it) =>
    seen.has(it.url) ? false : (seen.add(it.url), true),
  );

  return NextResponse.json({
    items,
    // backward-compatible list of image URLs
    images: items.filter((it) => it.kind === "image").map((it) => it.url),
  });
}

// Delete an admin-uploaded file from the persistent volume.
// Only files served from /media/ (i.e. inside UPLOAD_DIR) can be removed;
// static assets baked into the image are rejected.
export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let url = "";
  try {
    const body = await req.json();
    url = typeof body?.url === "string" ? body.url : "";
  } catch {
    /* no body */
  }

  if (!url.startsWith("/media/")) {
    return NextResponse.json(
      { error: "Only uploaded files can be deleted." },
      { status: 400 },
    );
  }

  // Resolve safely inside the upload dir — guard against path traversal.
  const name = path.basename(url.slice("/media/".length));
  const dir = uploadDir();
  const target = path.resolve(dir, name);
  if (path.dirname(target) !== path.resolve(dir)) {
    return NextResponse.json({ error: "Invalid path." }, { status: 400 });
  }

  try {
    await unlink(target);
  } catch (e) {
    const code = (e as NodeJS.ErrnoException)?.code;
    if (code === "ENOENT") return NextResponse.json({ ok: true }); // already gone
    return NextResponse.json({ error: "Could not delete file." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
