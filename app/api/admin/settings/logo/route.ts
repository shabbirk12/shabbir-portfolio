import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { hasValidSession } from "@/lib/adminAuth";
import { updateSiteSettings } from "@/lib/siteSettings";

export const runtime = "nodejs";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];

export async function POST(req: Request) {
  if (!hasValidSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Logo upload isn't configured yet — add a Vercel Blob store and set BLOB_READ_WRITE_TOKEN. See EDITING_GUIDE.md.",
      },
      { status: 501 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PNG, JPEG, WebP, or SVG images are allowed." },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File is too large — max 2MB." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "png";
    const blob = await put(`site-logo-${Date.now()}.${ext}`, file, {
      access: "public",
      addRandomSuffix: false,
    });

    await updateSiteSettings({ logoUrl: blob.url });

    return NextResponse.json({ ok: true, logoUrl: blob.url });
  } catch (err) {
    console.error("Logo upload error:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
