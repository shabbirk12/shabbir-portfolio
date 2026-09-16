"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blogStore";

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      if (data.posts) setPosts(data.posts);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function togglePublish(post: BlogPost) {
    const next = !post.published;
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, published: next } : p)));
    await fetch(`/api/admin/blogs/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: next }),
    });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this blog post permanently?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
  }

  return (
    <main className="min-h-screen bg-ink px-6 md:px-12 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin" className="font-mono text-xs text-muted hover:text-lime transition-colors">
            ← BACK TO DASHBOARD
          </Link>
          <Link
            href="/admin/blogs/new"
            className="rounded-full bg-lime text-lime-ink px-5 py-2.5 font-mono text-xs tracking-widest2 font-semibold hover:scale-105 transition-transform"
          >
            + WRITE NEW POST ↗
          </Link>
        </div>

        <div className="mb-8">
          <p className="font-mono text-[0.65rem] tracking-widest2 text-lime uppercase mb-1">WRITING &amp; INSIGHTS</p>
          <h1 className="font-display text-3xl sm:text-4xl uppercase text-paper">Blog Posts Management</h1>
        </div>

        {loading ? (
          <p className="font-mono text-xs text-muted py-12 text-center">Loading articles...</p>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center border border-line rounded bg-surface/20">
            <p className="font-mono text-xs text-muted mb-4">No articles created yet.</p>
            <Link
              href="/admin/blogs/new"
              className="rounded-full bg-lime text-lime-ink px-5 py-2 font-mono text-xs tracking-widest2 font-semibold inline-block"
            >
              Write First Post with Gemini ↗
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((p) => (
              <div
                key={p.id}
                className="p-6 border border-line bg-surface/40 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-lime/60 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span
                      className={`font-mono text-[0.65rem] tracking-widest2 px-2.5 py-0.5 rounded-full uppercase ${
                        p.published
                          ? "bg-lime/10 text-lime border border-lime/30"
                          : "bg-muted/10 text-muted border border-muted/30"
                      }`}
                    >
                      {p.published ? "PUBLISHED" : "DRAFT"}
                    </span>
                    <span className="font-mono text-[0.65rem] text-muted">{p.read_time}</span>
                    <span className="font-mono text-[0.65rem] text-muted">
                      {new Date(p.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl uppercase text-paper mb-1">{p.title}</h3>
                  <p className="text-muted text-xs line-clamp-2 max-w-2xl">{p.excerpt}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => togglePublish(p)}
                    className="px-3 py-1.5 rounded border border-line text-xs font-mono text-muted hover:text-paper"
                  >
                    {p.published ? "UNPUBLISH" : "PUBLISH"}
                  </button>
                  <Link
                    href={`/admin/blogs/${p.id}/edit`}
                    className="px-3 py-1.5 rounded bg-surface border border-line text-xs font-mono text-lime hover:border-lime"
                  >
                    EDIT ✎
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1.5 rounded border border-line/60 text-xs font-mono text-muted hover:text-red-400"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
