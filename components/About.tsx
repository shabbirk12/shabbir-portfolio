"use client";

import { motion } from "framer-motion";
import { experience, foundations, profile } from "@/lib/data";
import DotPortrait from "@/components/DotPortrait";
import Reveal from "@/components/Reveal";
import type { AboutDetailItem } from "@/lib/contentStore";

export default function About({
  aboutDetails,
  avatarUrl,
}: {
  aboutDetails: AboutDetailItem[];
  avatarUrl?: string | null;
}) {
  return (
    <section id="about" className="px-6 md:px-10 py-24 md:py-32">
      <Reveal className="mb-14">
        <p className="eyebrow mb-3">01 / ABOUT ME</p>
        <h2 className="font-display text-4xl md:text-6xl uppercase">About</h2>
      </Reveal>

      {/* Description + details / portrait */}
      <div className="grid md:grid-cols-[1fr_1.15fr] gap-10 md:gap-16 mb-20 items-center">
        <div>
          <p className="text-muted text-xl md:text-2xl leading-relaxed mb-12 max-w-lg">
            {profile.intro}
          </p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-w-lg">
            {aboutDetails.map((d) => (
              <div key={d.label} className="border-b border-line pb-4">
                <p className="text-muted text-xs tracking-wide mb-1.5">{d.label}</p>
                <p className="text-paper text-base md:text-lg">{d.value}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="section-frame relative border border-line aspect-[4/5] w-full max-w-md mx-auto md:mx-0 md:ml-auto"
        >
          <span className="corner-bracket top-3 left-3 border-t border-l" />
          <span className="corner-bracket top-3 right-3 border-t border-r" />
          <span className="corner-bracket bottom-3 left-3 border-b border-l" />
          <span className="corner-bracket bottom-3 right-3 border-b border-r" />
          <DotPortrait src={avatarUrl || "/images/profile.jpg"} className="h-full w-full" />
        </motion.div>
      </div>

      {/* Foundations */}
      <div className="grid md:grid-cols-4 gap-px bg-line mb-20">
        {foundations.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="bg-ink p-6 hover:bg-surface/60 transition-colors group"
          >
            <span className="font-mono text-xs text-mint group-hover:glow-text">0{i + 1}</span>
            <h3 className="font-display text-base uppercase mt-3 mb-2 group-hover:text-mint transition-colors">
              {f.title}
            </h3>
            <p className="text-muted text-sm leading-relaxed">{f.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* Career timeline */}
      <div>
        <p className="eyebrow mb-6">WORK</p>
        <ul>
          {experience.map((e) => (
            <li key={e.role} className="border-b border-line py-4">
              <a
                href="#work"
                className="flex items-baseline justify-between gap-4 group"
              >
                <div className="transition-transform duration-300 group-hover:translate-x-4">
                  <p className="font-display uppercase text-sm md:text-base group-hover:text-mint transition-colors">
                    {e.role}
                  </p>
                  <p className="text-muted text-xs md:text-sm mt-1">{e.org}</p>
                </div>
                <span className="font-mono text-xs text-muted whitespace-nowrap transition-all duration-300 group-hover:-translate-x-4 group-hover:text-mint">
                  {e.years}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
