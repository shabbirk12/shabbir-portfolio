import { getToolkitCategories } from "@/lib/contentStore";
import ToolkitRow from "@/components/ToolkitRow";
import Reveal from "@/components/Reveal";

export default async function Toolkit() {
  const toolkitCategories = await getToolkitCategories();

  return (
    <section id="toolkit" className="relative px-6 md:px-10 py-24 md:py-32 border-t border-line">
      <Reveal className="flex items-center justify-between gap-6 mb-12 flex-wrap">
        <p className="eyebrow flex items-center gap-3">
          <span className="text-mint">(03)</span> TOOLKIT
        </p>
        <p className="font-mono text-[0.65rem] tracking-widest2 text-muted">
          TWO CRAFTS, ONE WORKFLOW
        </p>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
        {toolkitCategories.map((cat) => (
          <div key={cat.heading}>
            <div className="flex items-center justify-between border-b border-line pb-3 mb-2">
              <p className="font-mono text-xs tracking-widest2 text-muted">{cat.heading}</p>
              <p className="font-mono text-xs tracking-widest2 text-mint">{cat.tag}</p>
            </div>
            {cat.items.map((item, i) => (
              <ToolkitRow
                key={item.name}
                index={String(i + 1).padStart(2, "0")}
                name={item.name}
                tag={item.tag}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-12 flex items-end justify-between">
        <p className="font-mono text-[0.65rem] tracking-widest2 text-muted">
          ISLAMABAD · PK &nbsp; 33.7°N 73.0°E
        </p>
        <p className="hidden md:block font-mono text-[0.65rem] tracking-widest2 text-muted border-t border-mint pt-1">
          003 — TOOLKIT
        </p>
      </div>
    </section>
  );
}
