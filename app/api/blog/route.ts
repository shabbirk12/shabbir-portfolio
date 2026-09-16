import { NextResponse } from "next/server";
import { getPublishedBlogs } from "@/lib/blogStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await getPublishedBlogs();
    return NextResponse.json({ posts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch blogs" }, { status: 500 });
  }
}
