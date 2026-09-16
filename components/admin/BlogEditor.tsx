"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { BlogPost } from "@/lib/blogStore";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BlogEditor({
  initial,
  mode = "create",
}: {
  initial?: BlogPost;
  mode?: "create" | "edit";
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [content, setContent] = useState(initial?.content || "");
  const [coverImage, setCoverImage] = useState(initial?.cover_image || "");
  const [tagsInput, setTagsInput] = useState(initial?.tags?.join(", ") || "Branding, Web Development");
  const [readTime, setReadTime] = useState(initial?.read_time || "4 min read");
  const [published, setPublished] = useState(initial?.published ?? true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);

  // Gemini AI Assistant state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNote, setAiNote] = useState("");

  async function generateWithGemini() {
    if (!aiPrompt.trim() && !title.trim()) {
      alert("Please enter a topic or title for Gemini to write about!");
      return;
    }
    setAiLoading(true);
    setAiNote("");
    try {
      const res = await fetch("/api/admin/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "blog_draft",
          prompt: aiPrompt || title,
        }),
      });
      const data = await res.json();
      if (data.generatedText) {
        setContent(data.generatedText);
        if (!title) {
          setTitle(aiPrompt);
          setSlug(slugify(aiPrompt));
        }
        if (!excerpt) {
          setExcerpt(`Insights on ${aiPrompt || title} — exploring design systems, creative direction, and full-stack performance.`);
        }
        if (data.note) setAiNote(data.note);
      } else {
        alert(data.error || "Could not generate content.");
      }
    } catch {
      alert("Network error calling Gemini assistant.");
    } finally {
      setAiLoading(false);
    }
  }

  async function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.url) setCoverImage(json.url);
    } catch {
      alert("Upload failed.");
    } finally {
      setUploadingCover(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const body = {
      title,
      slug,
      excerpt,
      content,
      cover_image: coverImage || null,
      tags,
      read_time: readTime,
      published,
    };

    const url = mode === "create" ? "/api/admin/blogs" : `/api/admin/blogs/${initial!.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to save blog post.");
        return;
      }
      router.push("/admin/blogs");
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "bg-transparent border-b border-line py-2.5 text-paper placeholder:text-muted/40 focus:border-lime transition-colors w-full text-sm";
  const labelClass = "font-mono text-[0.65rem] tracking-widest2 text-muted block";

  return (
    <form onSubmit={onSubmit} className="max-w-3xl flex flex-col gap-6">
      {/* AI Assistant Banner */}
      <div className="p-5 border border-lime/30 bg-lime/5 rounded-lg">
        <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-lime text-base">✨</span>
            <span className="font-mono text-xs text-lime font-bold uppercase tracking-wider">
              Gemini AI Writing Assistant
            </span>
          </div>
          <button
            type="button"
            onClick={generateWithGemini}
            disabled={aiLoading}
            className="rounded-full bg-lime text-lime-ink px-4 py-1.5 font-mono text-xs tracking-widest2 font-semibold hover:scale-105 transition-transform disabled:opacity-50"
          >
            {aiLoading ? "GENERATING WITH GEMINI…" : "✨ WRITE DRAFT WITH GEMINI"}
          </button>
        </div>
        <p className="text-muted text-xs mb-3">
          Type an article topic or notes below, then click &quot;Write Draft with Gemini&quot; to auto-generate an article outline and content.
        </p>
        <input
          type="text"
          placeholder="e.g. Why dark mode and glowing accents dominate luxury tech web design"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          className="bg-ink/60 border border-line py-2 px-3 rounded text-sm text-paper placeholder:text-muted/40 w-full focus:border-lime"
        />
        {aiNote && <p className="font-mono text-[0.65rem] text-lime mt-2">{aiNote}</p>}
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>POST TITLE *</span>
        <input
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched && mode === "create") setSlug(slugify(e.target.value));
          }}
          placeholder="e.g. Designing for the Underground Hospitality Scene"
          className={inputClass}
        />
      </div>

      {/* Slug */}
      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>SLUG (URL KEY) *</span>
        <input
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          placeholder="designing-for-hospitality"
          className={inputClass}
        />
      </div>

      {/* Excerpt */}
      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>EXCERPT (SHORT SUMMARY FOR LISTINGS) *</span>
        <textarea
          required
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="A quick 1-2 sentence overview shown in blog cards..."
          className={inputClass + " resize-none"}
        />
      </div>

      {/* Cover Image */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className={labelClass}>COVER IMAGE (OPTIONAL)</span>
          <label className="font-mono text-[0.65rem] tracking-widest2 text-lime hover:underline cursor-pointer">
            {uploadingCover ? "UPLOADING…" : "+ UPLOAD COVER IMAGE"}
            <input type="file" accept="image/*" onChange={onCoverChange} className="hidden" />
          </label>
        </div>
        <input
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="URL or /images/work-camden.jpg"
          className={inputClass}
        />
      </div>

      {/* Tags & Read Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <span className={labelClass}>TAGS (COMMA SEPARATED)</span>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Design, Next.js, Branding"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className={labelClass}>ESTIMATED READ TIME</span>
          <input
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            placeholder="4 min read"
            className={inputClass}
          />
        </div>
      </div>

      {/* Content Markdown */}
      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>ARTICLE CONTENT (MARKDOWN SUPPORTED) *</span>
        <textarea
          required
          rows={14}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="# Article Heading

Write your thoughts, case study insights, or design philosophy here..."
          className={inputClass + " font-mono text-xs leading-relaxed"}
        />
      </div>

      {/* Published Toggle */}
      <label className="flex items-center gap-3 cursor-pointer py-2">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-4 h-4 rounded accent-lime cursor-pointer"
        />
        <span className="font-mono text-xs text-paper">
          PUBLISHED &amp; LIVE ON THE BLOG DIRECTORY
        </span>
      </label>

      {error && <p className="font-mono text-xs text-red-400">{error}</p>}

      <div className="flex items-center gap-4 pt-4 border-t border-line">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-lime text-lime-ink px-7 py-3 font-mono text-xs tracking-widest2 font-semibold hover:scale-105 transition-transform disabled:opacity-50"
        >
          {saving ? "SAVING…" : mode === "create" ? "PUBLISH ARTICLE ↗" : "UPDATE ARTICLE ↗"}
        </button>
        <Link href="/admin/blogs" className="font-mono text-xs text-muted hover:text-paper">
          CANCEL
        </Link>
      </div>
    </form>
  );
}
