import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_IMAGE = 8 * 1024 * 1024; // 8 MB
const MAX_VIDEO = 64 * 1024 * 1024; // 64 MB
const IMAGE_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};
const VIDEO_EXT: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};
const EXT: Record<string, string> = { ...IMAGE_EXT, ...VIDEO_EXT };

function uploadDir() {
  return path.resolve(process.cwd(), process.env.UPLOAD_DIR || "./public/uploads");
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  const ext = EXT[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Unsupported file type. Use an image (JPG/PNG/WEBP) or video (MP4/WEBM)." },
      { status: 415 },
    );
  }
  const isVideo = file.type.startsWith("video/");
  const limit = isVideo ? MAX_VIDEO : MAX_IMAGE;
  if (file.size > limit) {
    return NextResponse.json(
      { error: `File too large (max ${isVideo ? "64" : "8"} MB).` },
      { status: 413 },
    );
  }

  const dir = uploadDir();
  await mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/media/${name}` });
}
