import Link from "next/link";
import BlogEditor from "@/components/admin/BlogEditor";

export default function NewBlogPage() {
  return (
    <main className="min-h-screen bg-ink px-6 md:px-12 py-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/blogs" className="font-mono text-xs text-muted hover:text-lime transition-colors block mb-6">
          ← BACK TO BLOGS
        </Link>
        <p className="font-mono text-[0.65rem] tracking-widest2 text-lime uppercase mb-1">WRITING SUITE</p>
        <h1 className="font-display text-3xl uppercase text-paper mb-8">Create New Article</h1>
        <BlogEditor mode="create" />
      </div>
    </main>
  );
}
