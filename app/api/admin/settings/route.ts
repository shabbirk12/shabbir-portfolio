import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/adminAuth";
import { getSiteSettings, updateSiteSettings } from "@/lib/siteSettings";

export const runtime = "nodejs";

export async function GET() {
  if (!hasValidSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  if (!hasValidSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const { title } = await req.json();
    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    await updateSiteSettings({ title: title.trim() });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Settings update error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
