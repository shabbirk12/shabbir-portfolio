import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects, getProject } from "@/lib/projectsStore";
import HudBar from "@/components/HudBar";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GalleryFrame from "@/components/GalleryFrame";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const item = await getProject(params.slug);
  if (!item) return {};
  return {
    title: `${item.title} — Shabbir Khan`,
    description: item.summary,
  };
}

export default async function WorkDetail({ params }: { params: { slug: string } }) {
  const work = await getProjects();
  const index = work.findIndex((w) => w.slug === params.slug);
  const item = work[index];
  if (!item) return notFound();

  const next = work[(index + 1) % work.length];
  const cs = item.caseStudy;

  return (
    <main>
      <HudBar section={`${item.index} — ${item.title.toUpperCase()}`} />
      <Nav />

      <article className="pt-40 md:pt-48 px-6 md:px-10 pb-24">
        {/* Breadcrumb */}
        <Reveal className="flex items-center justify-between mb-10 font-mono text-[0.65rem] tracking-widest2 text-muted">
          <Link href="/#work" className="hover:text-mint transition-colors">
            ← BACK TO WORK
          </Link>
          <span>
            WORK / {item.index} — {item.tag.toUpperCase()}
          </span>
        </Reveal>

        {/* Hero */}
        <div className="grid md:grid-cols-[1fr_260px] gap-10 md:gap-16 pb-10">
          <Reveal>
            <p className="eyebrow mb-4 text-mint">{item.tag}</p>
            <h1 className="font-display text-4xl md:text-6xl uppercase leading-[1.02]">
              {cs.heroLine}
            </h1>
          </Reveal>
          <Reveal delay={0.1} className="font-mono text-[0.65rem] tracking-widest2 text-muted space-y-5">
            <div>
              <p className="text-mint mb-1">ROLE</p>
              <p className="text-paper normal-case font-body text-sm tracking-normal">{cs.role}</p>
            </div>
            <div>
              <p className="text-mint mb-1">TIMELINE</p>
              <p className="text-paper normal-case font-body text-sm tracking-normal">{cs.timeline}</p>
            </div>
            <div>
              <p className="text-mint mb-1">STATUS</p>
              <p className="text-paper normal-case font-body text-sm tracking-normal">{cs.status}</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="relative aspect-[16/9] w-full mb-14 border border-line overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        </Reveal>

        {/* 01 Context */}
        <section className="mb-20">
          <Reveal className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xs text-mint">01</span>
            <p className="eyebrow">CONTEXT</p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-muted text-base md:text-lg leading-relaxed max-w-2xl mb-8">
              {cs.context.summary}
            </p>
          </Reveal>
          <div className="grid grid-cols-3 gap-4 max-w-lg border-t border-line pt-6">
            {cs.context.stats.map((s, i) => (
              <Reveal key={s.label} delay={0.08 + i * 0.05}>
                <p className="font-display text-xl md:text-2xl text-mint">
                  <Counter value={s.value} />
                </p>
                <p className="font-mono text-[0.6rem] tracking-widest2 text-muted mt-1">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 02 Challenge */}
        <section className="mb-20 border-t border-line pt-14">
          <Reveal className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xs text-mint">02</span>
            <p className="eyebrow">THE CHALLENGE</p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-muted text-base md:text-lg leading-relaxed max-w-2xl">{cs.challenge}</p>
          </Reveal>
        </section>

        {/* 03 What I built */}
        <section className="mb-20 border-t border-line pt-14">
          <Reveal className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xs text-mint">03</span>
            <p className="eyebrow">WHAT I BUILT</p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-muted text-base md:text-lg leading-relaxed max-w-2xl mb-8">
              {cs.build.summary}
            </p>
          </Reveal>
          <ul className="max-w-2xl">
            {cs.build.bullets.map((b, i) => (
              <Reveal key={b} delay={0.08 + i * 0.05}>
                <li className="flex gap-4 border-t border-line py-4 text-sm md:text-base text-paper">
                  <span className="font-mono text-xs text-mint shrink-0 pt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {b}
                </li>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* Gallery */}
        <section className="mb-20 border-t border-line pt-14">
          <Reveal className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs text-mint">·</span>
            <p className="eyebrow">SELECTED VIEWS</p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {cs.gallery.map((g, i) => (
              <Reveal key={g.label} delay={i * 0.08}>
                <GalleryFrame label={g.label} image={g.image} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Results */}
        <section className="mb-20 border-t border-line pt-14">
          <Reveal className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xs text-mint">04</span>
            <p className="eyebrow">RESULTS</p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-muted text-base md:text-lg leading-relaxed max-w-2xl mb-10">
              {cs.results.summary}
            </p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {cs.results.stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={0.08 + i * 0.05}
                className="border border-line p-6 card-glow"
              >
                <p className="font-display text-3xl md:text-4xl text-mint glow-text">
                  <Counter value={s.value} />
                </p>
                <p className="font-mono text-[0.6rem] tracking-widest2 text-muted mt-2">{s.label}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="border border-mint/30 bg-surface/60 p-8 md:p-12">
            <p className="font-display text-xl md:text-3xl uppercase leading-snug text-mint glow-text">
              &ldquo;{cs.results.quote}&rdquo;
            </p>
          </Reveal>
        </section>
      </article>

      {/* Next project */}
      <Link
        href={`/work/${next.slug}`}
        className="fill-hover group relative block border-t border-line px-6 md:px-10 py-16 md:py-20"
      >
        <p className="font-mono text-xs tracking-widest2 text-muted mb-4 transition-colors duration-300 group-hover:text-mint-ink/70">
          NEXT PROJECT
        </p>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-4xl md:text-6xl uppercase transition-colors duration-300 group-hover:text-mint-ink">
            <span className="text-mint mr-4 transition-colors duration-300 group-hover:text-mint-ink">
              {next.index}
            </span>
            {next.title}
          </h2>
          <span className="hidden md:block font-mono text-sm tracking-widest2 transition-colors duration-300 group-hover:text-mint-ink">
            →
          </span>
        </div>
      </Link>

      <Footer />
    </main>
  );
}
