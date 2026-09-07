import Image from "next/image";

export default function GalleryFrame({ label, image }: { label: string; image: string }) {
  return (
    <div className="section-frame relative border border-line overflow-hidden group">
      <span className="corner-bracket top-2 left-2 border-t border-l" />
      <span className="corner-bracket bottom-2 right-2 border-b border-r" />
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={image}
          alt={label}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
      </div>
      <p className="absolute bottom-4 left-4 font-mono text-[0.6rem] tracking-widest2 text-paper/90 uppercase">
        {label}
      </p>
    </div>
  );
}
