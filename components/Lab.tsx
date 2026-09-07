import { getLab } from "@/lib/contentStore";
import LabRow from "@/components/LabRow";
import Reveal from "@/components/Reveal";

export default async function Lab() {
  const lab = await getLab();

  return (
    <section id="lab" className="px-6 md:px-10 py-24 md:py-32 border-t border-line">
      <Reveal className="mb-14">
        <p className="eyebrow mb-3">04 / PROOF OF BUILD</p>
        <h2 className="font-display text-4xl md:text-6xl uppercase">Experiment Lab</h2>
      </Reveal>

      <div className="flex flex-col gap-4">
        {lab.map((item, i) => (
          <LabRow key={item.index} item={item} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}
