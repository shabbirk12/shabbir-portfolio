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
    const body = await req.json();
    const { title, avatarUrl, logoUrl } = body;

    const updates: Partial<{ title: string; avatarUrl: string | null; logoUrl: string | null }> = {};
    if (typeof title === "string" && title.trim().length > 0) {
      updates.title = title.trim();
    }
    if (avatarUrl !== undefined) {
      updates.avatarUrl = avatarUrl === "" ? null : avatarUrl;
    }
    if (logoUrl !== undefined) {
      updates.logoUrl = logoUrl === "" ? null : logoUrl;
    }

    await updateSiteSettings(updates);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Settings update error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
