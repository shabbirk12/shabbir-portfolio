"use client";

import { motion } from "framer-motion";
import Counter from "@/components/Counter";
import type { StatItem } from "@/lib/contentStore";

export default function Stats({ stats }: { stats: StatItem[] }) {
  return (
    <section className="px-6 md:px-10 pb-24 md:pb-32">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 border-t border-line pt-14">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <p className="font-display text-5xl md:text-7xl leading-none text-paper">
              <Counter value={s.value} />
            </p>
            <p className="text-muted text-sm md:text-base leading-snug mt-4 max-w-[16ch]">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
