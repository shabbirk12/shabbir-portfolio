import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { hasValidSession } from "@/lib/adminAuth";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
  "image/gif",
];

export async function POST(req: Request) {
  if (!hasValidSession()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PNG, JPEG, WebP, SVG, or GIF images are allowed." },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File is too large — max 5MB." },
        { status: 400 }
      );
    }

    // If Vercel Blob is configured, upload to CDN
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const ext = file.name.split(".").pop() || "jpg";
      const blob = await put(`portfolio-${Date.now()}.${ext}`, file, {
        access: "public",
        addRandomSuffix: true,
      });
      return NextResponse.json({ ok: true, url: blob.url });
    }

    // Fallback: Convert to Base64 Data URL so upload works even without Vercel Blob configured
    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    return NextResponse.json({ ok: true, url: dataUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
