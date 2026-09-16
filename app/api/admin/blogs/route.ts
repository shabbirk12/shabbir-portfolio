import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/adminAuth";
import { getAllBlogs, createBlog } from "@/lib/blogStore";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasValidSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const posts = await getAllBlogs();
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  if (!hasValidSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const body = await req.json();
    const { title, slug, excerpt, content, cover_image, tags, read_time, published } = body;
    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required." }, { status: 400 });
    }
    const post = await createBlog({
      title,
      slug,
      excerpt: excerpt || "",
      content,
      cover_image: cover_image || null,
      tags: tags || [],
      read_time: read_time || "4 min read",
      published: published ?? true,
    });
    return NextResponse.json({ ok: true, post });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create blog post." }, { status: 500 });
  }
}
