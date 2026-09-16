import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPublishedBlogs } from "@/lib/blogStore";
import HudBar from "@/components/HudBar";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Articles & Engineering Insights — Shabbir Khan",
  description: "Writings on brand identity systems, Next.js architecture, tactile print production, and creative engineering.",
};

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogs();

  return (
    <main className="relative bg-ink min-h-screen">
      <HudBar section="006 — ARTICLES &amp; INSIGHTS" />
      <Nav />

      {/* Ambient background glow */}
      <div className="ambient-blob w-[500px] h-[500px] -top-20 -left-20 opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="ambient-blob w-[400px] h-[400px] top-[40%] -right-20 opacity-15 pointer-events-none" aria-hidden="true" />

      <div className="pt-36 md:pt-44 px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        {/* Header */}
        <Reveal className="mb-16 border-b border-line pb-12">
          <p className="eyebrow mb-3">06 / THOUGHTS &amp; ARCHITECTURE</p>
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl uppercase leading-none text-paper mb-6">
            Articles &amp; <span className="font-script italic text-lime lowercase text-6xl sm:text-8xl md:text-9xl glow-text">insights.</span>
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-2xl leading-relaxed">
            Observations from the intersection of graphic design, creative engineering, and production web systems.
          </p>
        </Reveal>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08}>
              <Link
                href={`/blog/${post.slug}`}
                className="section-frame group block p-8 border border-line bg-surface/30 backdrop-blur-sm rounded-lg hover:border-lime transition-all duration-300 hover:shadow-glow-lime/10 flex flex-col justify-between h-full"
              >
                <span className="corner-bracket top-2 left-2 border-t border-l border-lime opacity-30" />
                <span className="corner-bracket top-2 right-2 border-t border-r border-lime opacity-30" />
                <span className="corner-bracket bottom-2 left-2 border-b border-l border-lime opacity-30" />
                <span className="corner-bracket bottom-2 right-2 border-b border-r border-lime opacity-30" />

                <div>
                  {/* Cover image if available */}
                  {post.cover_image && (
                    <div className="relative aspect-[16/9] w-full mb-6 border border-line/60 rounded overflow-hidden">
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3 font-mono text-[0.65rem] tracking-widest2 text-muted mb-3 flex-wrap">
                    <span className="text-lime">{post.read_time}</span>
                    <span>·</span>
                    <span>{new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl uppercase text-paper group-hover:text-lime transition-colors mb-3 leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-muted text-sm leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-line/60 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[0.6rem] tracking-wider text-muted px-2 py-0.5 rounded border border-line bg-surface"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-xs text-lime group-hover:translate-x-1 transition-transform">
                    READ ARTICLE →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
