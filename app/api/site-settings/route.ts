import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/siteSettings";

export const runtime = "nodejs";
export const revalidate = 0;

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}
