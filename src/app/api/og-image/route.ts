import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serve a WhatsApp/social-friendly Open Graph image: a 1200×630 JPEG, well
 * under the ~1 MB that link-preview crawlers will render. Source photos are
 * often multi-MB PNGs that WhatsApp silently drops — this resizes them.
 * `?src=` is a local web path (/media/… upload, or something under /public).
 */
function resolveLocal(src: string): string | null {
  if (!src || !src.startsWith("/")) return null;
  if (src.startsWith("/media/")) {
    const dir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "./public/uploads");
    const name = path.basename(src.slice("/media/".length));
    const p = path.resolve(dir, name);
    return path.dirname(p) === path.resolve(dir) ? p : null;
  }
  const pub = path.resolve(process.cwd(), "public");
  const p = path.resolve(pub, "." + src);
  return p === pub || p.startsWith(pub + path.sep) ? p : null;
}

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("src") || "";
  const file = resolveLocal(src);

  // Unknown / external source: send the crawler to the original.
  if (!file) {
    const fallback = src.startsWith("http") ? src : "/hero-poster.jpg";
    return NextResponse.redirect(new URL(fallback, req.url), 302);
  }

  try {
    const input = await readFile(file);
    const out = await sharp(input)
      .resize(1200, 630, { fit: "cover", position: "attention" })
      .flatten({ background: "#f4f1ea" })
      .jpeg({ quality: 80, progressive: true })
      .toBuffer();
    return new NextResponse(out, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": String(out.length),
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch {
    // If optimisation fails, fall back to the original file (served elsewhere).
    return NextResponse.redirect(new URL(src, req.url), 302);
  }
}
