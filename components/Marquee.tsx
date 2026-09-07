export default function Marquee({ text }: { text: string }) {
  const repeats = Array.from({ length: 8 });

  return (
    <div className="relative overflow-hidden border-y border-line py-4 bg-surface/30 select-none">
      <div className="flex w-max animate-marquee">
        {Array.from({ length: 2 }).map((_, group) => (
          <div key={group} className="flex items-center">
            {repeats.map((_, i) => (
              <span key={i} className="flex items-center pr-10 whitespace-nowrap">
                <span className="font-display text-2xl md:text-4xl uppercase text-mint">{text}</span>
                <span className="mx-10 w-1.5 h-1.5 rounded-full bg-muted" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
