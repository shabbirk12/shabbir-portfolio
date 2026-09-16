import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getBlogBySlug, getPublishedBlogs } from "@/lib/blogStore";
import HudBar from "@/components/HudBar";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — Shabbir Khan`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogBySlug(params.slug);
  if (!post || !post.published) return notFound();

  // Basic markdown paragraph formatter
  const paragraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <main className="relative bg-ink min-h-screen">
      <HudBar section={`ARTICLE · ${post.title.toUpperCase()}`} />
      <Nav />

      {/* Ambient background glow */}
      <div className="ambient-blob w-[500px] h-[500px] -top-20 -left-20 opacity-20 pointer-events-none" aria-hidden="true" />

      <article className="pt-36 md:pt-44 px-6 md:px-12 pb-24 max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <Reveal className="flex items-center justify-between mb-8 pb-4 border-b border-line font-mono text-[0.68rem] tracking-widest2 text-muted">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-paper hover:text-lime transition-colors group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>BACK TO ALL ARTICLES</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-lime">{post.read_time}</span>
            <span>·</span>
            <span>{new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        </Reveal>

        {/* Post Title */}
        <Reveal className="mb-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {post.tags.map((t) => (
              <span key={t} className="font-mono text-xs text-lime border border-lime/30 px-2.5 py-0.5 rounded-full bg-lime/5">
                {t}
              </span>
            ))}
          </div>
          <h1 className="font-display text-4xl sm:text-6xl uppercase text-paper leading-[1.05]">
            {post.title}
          </h1>
          <p className="text-muted text-lg mt-4 font-normal leading-relaxed">
            {post.excerpt}
          </p>
        </Reveal>

        {/* Cover image if available */}
        {post.cover_image && (
          <Reveal delay={0.1} className="relative aspect-[16/9] w-full mb-12 border border-line rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </Reveal>
        )}

        {/* Article Body */}
        <div className="prose prose-invert max-w-none text-paper/90 space-y-6 text-base sm:text-lg leading-relaxed pt-6 border-t border-line">
          {paragraphs.map((p, idx) => {
            if (p.startsWith("# ")) {
              return null; // already rendered as main title
            }
            if (p.startsWith("## ")) {
              return (
                <h2 key={idx} className="font-display text-2xl sm:text-3xl uppercase text-paper pt-8 pb-2 border-b border-line/60">
                  {p.replace("## ", "")}
                </h2>
              );
            }
            if (p.startsWith("- ")) {
              const items = p.split("\n").filter(Boolean);
              return (
                <ul key={idx} className="list-disc list-inside space-y-2 text-muted">
                  {items.map((it, iIdx) => (
                    <li key={iIdx}>{it.replace("- ", "")}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={idx} className="text-paper/85 leading-relaxed">
                {p}
              </p>
            );
          })}
        </div>

        {/* Article Author Footer */}
        <Reveal delay={0.15} className="mt-16 p-8 border border-line bg-surface/40 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[0.65rem] tracking-widest2 text-lime uppercase mb-1">WRITTEN BY</p>
            <h3 className="font-display text-xl uppercase text-paper">Shabbir Khan</h3>
            <p className="text-muted text-xs mt-1">
              Freelance designer &amp; creative full-stack developer available for client commissions.
            </p>
          </div>
          <Link
            href="/#contact"
            className="rounded-full bg-lime text-lime-ink px-6 py-2.5 font-mono text-xs tracking-widest2 font-semibold hover:scale-105 transition-transform shrink-0"
          >
            DISCUSS A PROJECT ↗
          </Link>
        </Reveal>
      </article>

      <Footer />
    </main>
  );
}
