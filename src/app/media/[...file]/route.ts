import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const CONTENT_TYPE: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

function uploadDir() {
  return path.resolve(process.cwd(), process.env.UPLOAD_DIR || "./public/uploads");
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ file: string[] }> },
) {
  const { file } = await params;
  // Only ever serve a single flat filename — reject any path traversal.
  const name = file[file.length - 1] ?? "";
  if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = path.extname(name).toLowerCase();
  const type = CONTENT_TYPE[ext];
  if (!type) return new NextResponse("Not found", { status: 404 });

  const filePath = path.join(uploadDir(), name);
  try {
    await stat(filePath);
    const data = await readFile(filePath);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
