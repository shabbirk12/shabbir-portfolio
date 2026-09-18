import { getProjects } from "@/lib/projectsStore";
import WorkRow from "@/components/WorkRow";
import Reveal from "@/components/Reveal";

export default async function Work() {
  const work = await getProjects();

  return (
    <section id="work" className="relative px-6 md:px-10 py-24 md:py-32 border-t border-line overflow-hidden">
      {/* Moody gradient ambience, echoing the reference layout */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(60% 50% at 10% 0%, rgba(198,255,61,0.07), transparent 70%), " +
            "radial-gradient(50% 40% at 90% 100%, rgba(195,255,252,0.06), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <Reveal className="relative flex items-end justify-between mb-10 pb-6 border-b border-line">
        <div>
          <p className="eyebrow mb-3">03 / {work.length} PROJECTS</p>
          <h2 className="font-display text-4xl md:text-6xl uppercase leading-none flex flex-wrap items-baseline gap-x-3">
            Selected
            <span className="font-script italic text-lime lowercase text-5xl md:text-7xl">work.</span>
          </h2>
        </div>
        <span className="hidden md:block font-mono text-xs text-muted tracking-widest2">
          HOVER TO PREVIEW
        </span>
      </Reveal>

      <div className="relative">
        {work.map((item, i) => (
          <WorkRow key={item.slug} item={item} delay={i * 0.06} />
        ))}
      </div>

      <a
        href="/#contact"
        className="mt-14 ml-auto flex w-fit items-center gap-2 rounded-full bg-lime px-6 py-3 font-mono text-xs tracking-widest2 text-lime-ink transition-transform hover:scale-105 hover:shadow-glow-lime"
      >
        CONTACT ME
      </a>
    </section>
  );
}
