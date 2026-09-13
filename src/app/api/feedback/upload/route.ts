import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

// Public endpoint for customer feedback media. Kept tight: only images/videos,
// with size limits, to keep abuse surface small.
const MAX_IMAGE = 8 * 1024 * 1024; // 8 MB
const MAX_VIDEO = 40 * 1024 * 1024; // 40 MB
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

function uploadDir() {
  return path.resolve(process.cwd(), process.env.UPLOAD_DIR || "./public/uploads");
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  const ext = EXT[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Please upload an image or a video." }, { status: 415 });
  }
  const isVideo = file.type.startsWith("video/");
  const limit = isVideo ? MAX_VIDEO : MAX_IMAGE;
  if (file.size > limit) {
    return NextResponse.json(
      { error: `File too large (max ${isVideo ? "40" : "8"} MB).` },
      { status: 413 },
    );
  }

  const dir = uploadDir();
  await mkdir(dir, { recursive: true });
  const name = `fb-${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/media/${name}`, kind: isVideo ? "video" : "image" });
}
