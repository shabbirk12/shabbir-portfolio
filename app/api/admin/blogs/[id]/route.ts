import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/adminAuth";
import { query } from "@/lib/db";
import { updateBlog, deleteBlog, BlogPost } from "@/lib/blogStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  if (!hasValidSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const id = parseInt(params.id, 10);
    const rows = await query<BlogPost>("SELECT * FROM blog_posts WHERE id = $1", [id]);
    if (!rows[0]) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ post: rows[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!hasValidSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const id = parseInt(params.id, 10);
    const body = await req.json();
    await updateBlog(id, body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update blog post." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!hasValidSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const id = parseInt(params.id, 10);
    await deleteBlog(id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete blog post." }, { status: 500 });
  }
}
