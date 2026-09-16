import { notFound } from "next/navigation";
import Link from "next/link";
import { query } from "@/lib/db";
import type { BlogPost } from "@/lib/blogStore";
import BlogEditor from "@/components/admin/BlogEditor";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const rows = await query<BlogPost>("SELECT * FROM blog_posts WHERE id = $1", [id]);
  const post = rows[0];
  if (!post) return notFound();

  return (
    <main className="min-h-screen bg-ink px-6 md:px-12 py-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/blogs" className="font-mono text-xs text-muted hover:text-lime transition-colors block mb-6">
          ← BACK TO BLOGS
        </Link>
        <p className="font-mono text-[0.65rem] tracking-widest2 text-lime uppercase mb-1">EDITING POST</p>
        <h1 className="font-display text-3xl uppercase text-paper mb-8">{post.title}</h1>
        <BlogEditor initial={post} mode="edit" />
      </div>
    </main>
  );
}
