import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects, getProject } from "@/lib/projectsStore";
import HudBar from "@/components/HudBar";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProjectGallery from "@/components/ProjectGallery";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import HalftoneField from "@/components/HalftoneField";

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
    <main className="relative bg-ink min-h-screen">
      <HudBar section={`${item.index} — ${item.title.toUpperCase()}`} />
      <Nav />

      {/* Ambient background glow */}
      <div className="ambient-blob w-[500px] h-[500px] -top-20 -left-20 opacity-30 animate-float" aria-hidden="true" />
      <div
        className="ambient-blob w-[420px] h-[420px] top-[40%] -right-20 opacity-20 animate-float"
        style={{ animationDelay: "-4s" }}
        aria-hidden="true"
      />

      <article className="pt-36 md:pt-44 px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        {/* Navigation Breadcrumb Bar */}
        <Reveal className="flex items-center justify-between mb-8 pb-4 border-b border-line font-mono text-[0.68rem] tracking-widest2 text-muted">
          <Link
            href="/#work"
            className="flex items-center gap-2 text-paper hover:text-lime transition-colors group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>BACK TO ALL PROJECTS</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-lime">{item.index}</span>
            <span>/</span>
            <span className="text-paper">{item.year}</span>
            <span>/</span>
            <span className="uppercase">{item.tag}</span>
          </div>
        </Reveal>

        {/* Project Hero Title & Specs */}
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16 items-end pb-12">
          <Reveal>
            <span className="inline-block font-mono text-xs tracking-widest2 text-lime uppercase mb-3 border border-lime/30 px-3 py-1 rounded-full bg-lime/5">
              {item.tag}
            </span>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase leading-[0.98] text-paper">
              {item.title}
            </h1>
            <p className="font-display text-xl md:text-2xl text-muted mt-4 font-normal max-w-2xl leading-relaxed">
              {cs.heroLine}
            </p>
          </Reveal>

          {/* Quick Specs Cards Grid */}
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-3 p-4 border border-line bg-surface/40 backdrop-blur-sm rounded-lg">
              <div className="p-3 border-b sm:border-b-0 border-r border-line/60">
                <p className="font-mono text-[0.6rem] tracking-widest2 text-lime uppercase mb-1">ROLE</p>
                <p className="font-body text-sm text-paper">{cs.role || "Lead Designer & Dev"}</p>
              </div>
              <div className="p-3 border-b sm:border-b-0 border-line/60">
                <p className="font-mono text-[0.6rem] tracking-widest2 text-lime uppercase mb-1">TIMELINE</p>
                <p className="font-body text-sm text-paper">{cs.timeline || item.year}</p>
              </div>
              <div className="p-3 border-r border-line/60">
                <p className="font-mono text-[0.6rem] tracking-widest2 text-lime uppercase mb-1">STATUS</p>
                <p className="font-body text-sm text-paper flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                  {cs.status || "Production / Shipped"}
                </p>
              </div>
              <div className="p-3">
                <p className="font-mono text-[0.6rem] tracking-widest2 text-lime uppercase mb-1">CATEGORY</p>
                <p className="font-body text-sm text-paper">{item.tag}</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Hero Showcase Frame */}
        <Reveal delay={0.15} className="relative aspect-[16/9] w-full mb-20 border border-line rounded-lg overflow-hidden group shadow-2xl">
          <span className="corner-bracket top-4 left-4 border-t-2 border-l-2 border-lime z-10" />
          <span className="corner-bracket top-4 right-4 border-t-2 border-r-2 border-lime z-10" />
          <span className="corner-bracket bottom-4 left-4 border-b-2 border-l-2 border-lime z-10" />
          <span className="corner-bracket bottom-4 right-4 border-b-2 border-r-2 border-lime z-10" />

          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="100vw"
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none">
            <span className="font-mono text-xs tracking-widest2 text-paper bg-ink/70 backdrop-blur-sm px-3 py-1.5 border border-line rounded">
              {item.index} · OVERVIEW SHOWCASE
            </span>
            <Link
              href="/#contact"
              className="pointer-events-auto hidden sm:inline-flex items-center gap-2 rounded-full bg-lime text-lime-ink px-5 py-2.5 font-mono text-xs tracking-widest2 transition-transform hover:scale-105 hover:shadow-glow-lime"
            >
              DISCUSS SIMILAR PROJECT ↗
            </Link>
          </div>
        </Reveal>

        {/* 01 Context & Metrics */}
        <section className="mb-24">
          <Reveal className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs text-lime px-2 py-0.5 rounded border border-lime/30 bg-lime/5">01</span>
            <h2 className="eyebrow text-paper tracking-widest2">CONTEXT &amp; OBJECTIVE</h2>
          </Reveal>

          <div className="grid md:grid-cols-[1.4fr_1fr] gap-12 items-start">
            <Reveal delay={0.05}>
              <div className="border-l-2 border-lime pl-6 py-2">
                <p className="text-paper text-lg sm:text-xl leading-relaxed">
                  {cs.context.summary}
                </p>
              </div>
              <p className="text-muted text-sm leading-relaxed mt-6">
                {item.summary}
              </p>
            </Reveal>

            {/* Context Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {cs.context.stats.map((s, i) => (
                <Reveal key={s.label} delay={0.08 + i * 0.05} className="p-4 border border-line bg-surface/30 rounded">
                  <p className="font-display text-2xl sm:text-3xl text-lime font-bold">
                    <Counter value={s.value} />
                  </p>
                  <p className="font-mono text-[0.62rem] tracking-widest2 text-muted mt-2 uppercase">{s.label}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 02 The Challenge Callout */}
        <section className="mb-24 border-t border-line pt-16">
          <Reveal className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs text-lime px-2 py-0.5 rounded border border-lime/30 bg-lime/5">02</span>
            <h2 className="eyebrow text-paper tracking-widest2">THE CORE CHALLENGE</h2>
          </Reveal>

          <Reveal delay={0.05} className="relative p-8 md:p-12 border border-line bg-surface/40 rounded-lg overflow-hidden">
            <span className="corner-bracket top-3 left-3 border-t border-l" />
            <span className="corner-bracket bottom-3 right-3 border-b border-r" />

            <div className="max-w-3xl">
              <p className="font-display text-xl sm:text-2xl text-paper leading-relaxed font-normal">
                {cs.challenge}
              </p>
            </div>
          </Reveal>
        </section>

        {/* 03 What I Built / Technical Execution */}
        <section className="mb-24 border-t border-line pt-16">
          <Reveal className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs text-lime px-2 py-0.5 rounded border border-lime/30 bg-lime/5">03</span>
            <h2 className="eyebrow text-paper tracking-widest2">WHAT I BUILT &amp; DELIVERED</h2>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="text-paper text-lg sm:text-xl leading-relaxed max-w-3xl mb-10">
              {cs.build.summary}
            </p>
          </Reveal>

          {/* Feature Breakdown Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl">
            {cs.build.bullets.map((b, i) => (
              <Reveal
                key={b}
                delay={0.08 + i * 0.05}
                className="p-5 border border-line bg-surface/20 hover:border-lime/60 transition-colors rounded-lg flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-lime font-semibold">
                    0{i + 1}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-lime/40 group-hover:bg-lime transition-colors" />
                </div>
                <p className="text-sm md:text-base text-paper leading-relaxed">{b}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 04 Selected Views / Interactive Gallery */}
        <section className="mb-24 border-t border-line pt-16">
          <Reveal className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-lime px-2 py-0.5 rounded border border-lime/30 bg-lime/5">04</span>
              <h2 className="eyebrow text-paper tracking-widest2">SELECTED VIEWS &amp; SCREENS</h2>
            </div>
            <span className="font-mono text-xs text-muted hidden sm:inline">
              CLICK ANY IMAGE TO EXPAND
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <ProjectGallery gallery={cs.gallery} />
          </Reveal>
        </section>

        {/* 05 Results & Executive Pull Quote */}
        <section className="mb-24 border-t border-line pt-16">
          <Reveal className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs text-lime px-2 py-0.5 rounded border border-lime/30 bg-lime/5">05</span>
            <h2 className="eyebrow text-paper tracking-widest2">IMPACT &amp; RESULTS</h2>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="text-paper text-lg sm:text-xl leading-relaxed max-w-3xl mb-12">
              {cs.results.summary}
            </p>
          </Reveal>

          {/* Results Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {cs.results.stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={0.08 + i * 0.05}
                className="border border-line p-6 bg-surface/30 rounded-lg hover:border-lime transition-colors group"
              >
                <p className="font-display text-3xl sm:text-4xl text-lime font-bold group-hover:glow-text">
                  <Counter value={s.value} />
                </p>
                <p className="font-mono text-[0.65rem] tracking-widest2 text-muted mt-3 uppercase">{s.label}</p>
              </Reveal>
            ))}
          </div>

          {/* Executive Pull Quote */}
          {cs.results.quote && (
            <Reveal className="relative border border-lime/30 bg-gradient-to-r from-lime/5 via-surface/60 to-transparent p-8 md:p-14 rounded-lg">
              <span className="font-serif text-6xl text-lime opacity-30 absolute top-4 left-6">&ldquo;</span>
              <p className="font-display text-xl sm:text-3xl uppercase leading-snug text-lime relative z-10 pl-6 sm:pl-10">
                {cs.results.quote}
              </p>
            </Reveal>
          )}
        </section>
      </article>

      {/* Next Project Footer Bar */}
      <Link
        href={`/work/${next.slug}`}
        className="fill-hover group relative block border-t border-line px-6 md:px-12 py-16 md:py-24 bg-surface/30 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="font-mono text-xs tracking-widest2 text-muted uppercase block mb-3 transition-colors duration-300 group-hover:text-mint-ink/70">
              NEXT CASE STUDY →
            </span>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase transition-colors duration-300 group-hover:text-mint-ink">
              <span className="text-lime mr-4 transition-colors duration-300 group-hover:text-mint-ink">
                {next.index}
              </span>
              {next.title}
            </h2>
            <p className="text-muted text-sm mt-2 transition-colors duration-300 group-hover:text-mint-ink/80">
              {next.tag} · {next.year}
            </p>
          </div>

          {/* Next project thumbnail preview card */}
          {next.image && (
            <div className="relative w-44 h-28 border border-line rounded overflow-hidden shrink-0 hidden md:block group-hover:border-mint-ink transition-colors">
              <Image
                src={next.image}
                alt={next.title}
                fill
                sizes="180px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
        </div>
      </Link>

      <Footer />
    </main>
  );
}
