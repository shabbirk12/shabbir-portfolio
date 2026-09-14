import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { hasValidSession } from "@/lib/adminAuth";
import { isValidCollection } from "@/lib/contentStore";
import ListEditor from "@/components/admin/ListEditor";

export const dynamic = "force-dynamic";

const CONFIG: Record<
  string,
  { title: string; isStringArray?: boolean; arrayFields?: string[]; fields: { key: string; label: string; multiline?: boolean }[] }
> = {
  skills: {
    title: "Skill",
    isStringArray: true,
    fields: [],
  },
  services: {
    title: "Services",
    fields: [
      { key: "index", label: "Index (e.g. 01)" },
      { key: "title", label: "Title" },
      { key: "detail", label: "Detail", multiline: true },
      { key: "image", label: "Thumbnail Image" },
    ],
  },
  lab: {
    title: "Lab experiments",
    arrayFields: ["tags"],
    fields: [
      { key: "index", label: "Index (e.g. 001)" },
      { key: "title", label: "Title" },
      { key: "tags", label: "Tags" },
      { key: "detail", label: "Detail", multiline: true },
      { key: "link", label: "Link (e.g. github.com/you/repo)" },
    ],
  },
  stats: {
    title: "Stats",
    fields: [
      { key: "value", label: "Value (e.g. 25+)" },
      { key: "label", label: "Label" },
    ],
  },
  "about-details": {
    title: "About details",
    fields: [
      { key: "label", label: "Label (e.g. Role)" },
      { key: "value", label: "Value" },
    ],
  },
};

export default function ContentCollectionPage({ params }: { params: { collection: string } }) {
  if (!hasValidSession()) redirect("/admin/login");
  if (params.collection === "toolkit") redirect("/admin/content/toolkit/edit");
  if (!isValidCollection(params.collection) || !CONFIG[params.collection]) return notFound();

  const config = CONFIG[params.collection];

  return (
    <main className="min-h-screen bg-ink px-6 md:px-10 py-10">
      <Link href="/admin" className="font-mono text-xs text-muted hover:text-mint transition-colors">
        ← BACK TO DASHBOARD
      </Link>
      <p className="font-mono text-[0.65rem] tracking-widest2 text-mint mb-2 mt-6">ADMIN</p>
      <h1 className="font-display text-3xl uppercase text-paper mb-10">{config.title}</h1>

      <ListEditor
        collection={params.collection}
        title={config.title}
        fields={config.fields}
        isStringArray={config.isStringArray}
        arrayFields={config.arrayFields}
      />
    </main>
  );
}
