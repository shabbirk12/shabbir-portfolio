"use client";

import { useState, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import type { WorkItem, WorkStat } from "@/lib/types";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function emptyStats(n: number): WorkStat[] {
  return Array.from({ length: n }, () => ({ value: "", label: "" }));
}

function emptyProject(): WorkItem {
  return {
    index: "07",
    year: String(new Date().getFullYear()),
    tag: "",
    title: "",
    slug: "",
    summary: "",
    image: "",
    liveUrl: "",
    stats: emptyStats(3),
    caseStudy: {
      role: "",
      timeline: "",
      status: "",
      heroLine: "",
      liveUrl: "",
      context: { summary: "", stats: emptyStats(3) },
      challenge: "",
      build: { summary: "", bullets: [""] },
      gallery: [
        { label: "", image: "" },
        { label: "", image: "" },
        { label: "", image: "" },
      ],
      results: { summary: "", stats: emptyStats(4), quote: "" },
    },
  };
}

const inputClass =
  "bg-transparent border-b border-line py-2.5 text-paper placeholder:text-muted/40 focus-visible:outline-none outline-none focus:border-mint transition-colors w-full";
const labelClass = "font-mono text-[0.65rem] tracking-widest2 text-muted";
const fieldWrap = "flex flex-col gap-2";
const sectionTitle = "font-mono text-xs tracking-widest2 text-mint border-t border-line pt-6 mt-2";

export default function ProjectForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: WorkItem;
}) {
  const router = useRouter();
  const [item, setItem] = useState<WorkItem>(initial ?? emptyProject());
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [thumbMsg, setThumbMsg] = useState("");
  const [uploadingGalleryIdx, setUploadingGalleryIdx] = useState<number | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [summaryCmd, setSummaryCmd] = useState("");
  const [summaryCmdOpen, setSummaryCmdOpen] = useState(false);
  const [heroCmd, setHeroCmd] = useState("");
  const [heroCmdOpen, setHeroCmdOpen] = useState(false);
  const summaryCmdRef = useRef<HTMLInputElement>(null);
  const heroCmdRef = useRef<HTMLInputElement>(null);

  async function generateWithGemini(
    task: "project_summary" | "project_hero",
    customInstruction?: string
  ) {
    const basis = item.title || item.tag || item.summary;
    if (!basis.trim()) {
      alert("Please enter a Project Title or Tag first so Gemini has context!");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch("/api/admin/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          prompt: customInstruction
            ? `${customInstruction}\n\nProject: ${item.title} (${item.tag || "Creative Design & Engineering"})\nExisting summary: ${item.summary}`
            : `${item.title} (${item.tag || "Creative Design & Engineering"})`,
          customInstruction,
        }),
      });
      const data = await res.json();
      if (data.generatedText) {
        if (task === "project_summary") {
          set("summary", data.generatedText);
        } else if (task === "project_hero") {
          setCS("heroLine", data.generatedText);
        }
      } else {
        alert(data.error || "AI generation failed.");
      }
    } catch {
      alert("Network error calling Gemini AI assistant.");
    } finally {
      setAiLoading(false);
    }
  }

  async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "Upload failed.");
    }
    return json.url;
  }

  async function onThumbChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumb(true);
    setThumbMsg("");
    try {
      const url = await uploadFile(file);
      set("image", url);
      setThumbMsg("Thumbnail uploaded successfully!");
    } catch (err: any) {
      setThumbMsg(err.message || "Upload failed.");
    } finally {
      setUploadingThumb(false);
      e.target.value = "";
    }
  }

  async function onGalleryChange(idx: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGalleryIdx(idx);
    try {
      const url = await uploadFile(file);
      const next = [...item.caseStudy.gallery];
      next[idx] = { ...next[idx], image: url };
      setCS("gallery", next);
    } catch (err: any) {
      alert(err.message || "Upload failed.");
    } finally {
      setUploadingGalleryIdx(null);
      e.target.value = "";
    }
  }

  function set<K extends keyof WorkItem>(key: K, value: WorkItem[K]) {
    setItem((prev) => ({ ...prev, [key]: value }));
  }

  function setCS<K extends keyof WorkItem["caseStudy"]>(key: K, value: WorkItem["caseStudy"][K]) {
    setItem((prev) => ({ ...prev, caseStudy: { ...prev.caseStudy, [key]: value } }));
  }

  function setStat(list: WorkStat[], i: number, field: "value" | "label", val: string): WorkStat[] {
    const next = [...list];
    next[i] = { ...next[i], [field]: val };
    return next;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${initial!.slug}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to save.");
        setSaving(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error — try again.");
      setSaving(false);
    }
  }

  const StatRow = ({
    stats,
    onChange,
  }: {
    stats: WorkStat[];
    onChange: (next: WorkStat[]) => void;
  }) => (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="flex flex-col gap-1">
          <input
            placeholder="Value (e.g. 25+)"
            value={s.value}
            onChange={(e) => onChange(setStat(stats, i, "value", e.target.value))}
            className={inputClass}
          />
          <input
            placeholder="Label"
            value={s.label}
            onChange={(e) => onChange(setStat(stats, i, "label", e.target.value))}
            className={inputClass}
          />
        </div>
      ))}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8 max-w-3xl">
      <div className={sectionTitle}>CARD</div>

      <div className={fieldWrap}>
        <span className={labelClass}>TITLE</span>
        <input
          required
          value={item.title}
          onChange={(e) => {
            set("title", e.target.value);
            if (!slugTouched) set("slug", slugify(e.target.value));
          }}
          className={inputClass}
        />
      </div>

      <div className={fieldWrap}>
        <span className={labelClass}>SLUG (URL — lowercase, hyphens only)</span>
        <input
          required
          value={item.slug}
          onChange={(e) => {
            setSlugTouched(true);
            set("slug", e.target.value);
          }}
          pattern="^[a-z0-9]+(-[a-z0-9]+)*$"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className={fieldWrap}>
          <span className={labelClass}>INDEX (e.g. 07)</span>
          <input required value={item.index} onChange={(e) => set("index", e.target.value)} className={inputClass} />
        </div>
        <div className={fieldWrap}>
          <span className={labelClass}>YEAR</span>
          <input required value={item.year} onChange={(e) => set("year", e.target.value)} className={inputClass} />
        </div>
        <div className={fieldWrap}>
          <span className={labelClass}>TAG (category)</span>
          <input required value={item.tag} onChange={(e) => set("tag", e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className={fieldWrap}>
        <div className="flex items-center justify-between">
          <span className={labelClass}>SUMMARY (card description, one line)</span>
          <button
            type="button"
            onClick={() => {
              setSummaryCmdOpen((v) => !v);
              setTimeout(() => summaryCmdRef.current?.focus(), 50);
            }}
            disabled={aiLoading}
            className="font-mono text-[0.65rem] tracking-widest2 text-lime hover:underline cursor-pointer disabled:opacity-50"
          >
            {aiLoading ? "GENERATING…" : "✨ AI"}
          </button>
        </div>

        {/* Inline mini AI command center */}
        {summaryCmdOpen && (
          <div className="flex items-stretch gap-2 border border-lime/30 bg-lime/5 rounded px-3 py-2">
            <input
              ref={summaryCmdRef}
              type="text"
              value={summaryCmd}
              onChange={(e) => setSummaryCmd(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  generateWithGemini("project_summary", summaryCmd || undefined);
                  setSummaryCmdOpen(false);
                  setSummaryCmd("");
                }
              }}
              placeholder="e.g. Write a punchy one-liner for this branding project…"
              className="flex-1 bg-transparent text-[0.7rem] font-mono text-paper placeholder:text-muted/40 focus-visible:outline-none"
            />
            <button
              type="button"
              disabled={aiLoading}
              onClick={() => {
                generateWithGemini("project_summary", summaryCmd || undefined);
                setSummaryCmdOpen(false);
                setSummaryCmd("");
              }}
              className="font-mono text-[0.65rem] tracking-widest2 text-lime-ink bg-lime px-3 py-1 rounded disabled:opacity-50 shrink-0"
            >
              {aiLoading ? "…" : "RUN"}
            </button>
          </div>
        )}

        <textarea
          required
          rows={2}
          value={item.summary}
          onChange={(e) => set("summary", e.target.value)}
          className={inputClass + " resize-none"}
        />
      </div>

      <div className={fieldWrap}>
        <span className={labelClass}>LIVE PROJECT / WEBSITE URL (optional)</span>
        <input
          type="url"
          placeholder="https://example.com"
          value={item.liveUrl || item.caseStudy?.liveUrl || ""}
          onChange={(e) => {
            const val = e.target.value;
            set("liveUrl", val);
            setCS("liveUrl", val);
          }}
          className={inputClass}
        />
        <span className="font-mono text-[0.6rem] text-muted">
          Displays a &quot;VISIT LIVE SITE ↗&quot; button for clients on the project case study page.
        </span>
      </div>

      <div className={fieldWrap}>
        <div className="flex items-center justify-between">
          <span className={labelClass}>PROJECT THUMBNAIL</span>
          <label className="font-mono text-[0.65rem] tracking-widest2 text-lime hover:underline cursor-pointer">
            {uploadingThumb ? "UPLOADING…" : "+ UPLOAD NEW THUMBNAIL"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
              onChange={onThumbChange}
              disabled={uploadingThumb}
              className="hidden"
            />
          </label>
        </div>

        {item.image && (
          <div className="relative w-56 h-36 border border-line bg-surface overflow-hidden rounded my-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt="Project thumbnail preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <input
          required
          value={item.image}
          onChange={(e) => set("image", e.target.value)}
          placeholder="https://... or click upload above"
          className={inputClass}
        />
        {thumbMsg && <p className="font-mono text-xs text-mint">{thumbMsg}</p>}
        <p className="text-muted text-xs">
          Upload an image from your computer, or paste any image URL.
        </p>
      </div>

      <div className={fieldWrap}>
        <span className={labelClass}>CARD STATS (3)</span>
        <StatRow stats={item.stats} onChange={(next) => set("stats", next)} />
      </div>

      <div className={sectionTitle}>CASE STUDY</div>

      <div className="grid grid-cols-3 gap-4">
        <div className={fieldWrap}>
          <span className={labelClass}>ROLE</span>
          <input value={item.caseStudy.role} onChange={(e) => setCS("role", e.target.value)} className={inputClass} />
        </div>
        <div className={fieldWrap}>
          <span className={labelClass}>TIMELINE</span>
          <input
            value={item.caseStudy.timeline}
            onChange={(e) => setCS("timeline", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className={fieldWrap}>
          <span className={labelClass}>STATUS</span>
          <input
            value={item.caseStudy.status}
            onChange={(e) => setCS("status", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className={fieldWrap}>
        <div className="flex items-center justify-between">
          <span className={labelClass}>HERO LINE (big case-study headline)</span>
          <button
            type="button"
            onClick={() => {
              setHeroCmdOpen((v) => !v);
              setTimeout(() => heroCmdRef.current?.focus(), 50);
            }}
            disabled={aiLoading}
            className="font-mono text-[0.65rem] tracking-widest2 text-lime hover:underline cursor-pointer disabled:opacity-50"
          >
            {aiLoading ? "GENERATING…" : "✨ AI"}
          </button>
        </div>

        {/* Inline mini AI command center */}
        {heroCmdOpen && (
          <div className="flex items-stretch gap-2 border border-lime/30 bg-lime/5 rounded px-3 py-2">
            <input
              ref={heroCmdRef}
              type="text"
              value={heroCmd}
              onChange={(e) => setHeroCmd(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  generateWithGemini("project_hero", heroCmd || undefined);
                  setHeroCmdOpen(false);
                  setHeroCmd("");
                }
              }}
              placeholder="e.g. Write a bold, short headline for the case study hero…"
              className="flex-1 bg-transparent text-[0.7rem] font-mono text-paper placeholder:text-muted/40 focus-visible:outline-none"
            />
            <button
              type="button"
              disabled={aiLoading}
              onClick={() => {
                generateWithGemini("project_hero", heroCmd || undefined);
                setHeroCmdOpen(false);
                setHeroCmd("");
              }}
              className="font-mono text-[0.65rem] tracking-widest2 text-lime-ink bg-lime px-3 py-1 rounded disabled:opacity-50 shrink-0"
            >
              {aiLoading ? "…" : "RUN"}
            </button>
          </div>
        )}

        <textarea
          rows={2}
          value={item.caseStudy.heroLine}
          onChange={(e) => setCS("heroLine", e.target.value)}
          className={inputClass + " resize-none"}
        />
      </div>

      <div className={fieldWrap}>
        <span className={labelClass}>CONTEXT — SUMMARY</span>
        <textarea
          rows={3}
          value={item.caseStudy.context.summary}
          onChange={(e) => setCS("context", { ...item.caseStudy.context, summary: e.target.value })}
          className={inputClass + " resize-none"}
        />
        <span className={labelClass}>CONTEXT — STATS (3)</span>
        <StatRow
          stats={item.caseStudy.context.stats}
          onChange={(next) => setCS("context", { ...item.caseStudy.context, stats: next })}
        />
      </div>

      <div className={fieldWrap}>
        <span className={labelClass}>THE CHALLENGE</span>
        <textarea
          rows={3}
          value={item.caseStudy.challenge}
          onChange={(e) => setCS("challenge", e.target.value)}
          className={inputClass + " resize-none"}
        />
      </div>

      <div className={fieldWrap}>
        <span className={labelClass}>WHAT I BUILT — SUMMARY</span>
        <textarea
          rows={2}
          value={item.caseStudy.build.summary}
          onChange={(e) => setCS("build", { ...item.caseStudy.build, summary: e.target.value })}
          className={inputClass + " resize-none"}
        />
        <span className={labelClass}>WHAT I BUILT — BULLETS (one per line)</span>
        <textarea
          rows={4}
          value={item.caseStudy.build.bullets.join("\n")}
          onChange={(e) =>
            setCS("build", { ...item.caseStudy.build, bullets: e.target.value.split("\n") })
          }
          className={inputClass + " resize-none"}
        />
      </div>

      <div className={fieldWrap}>
        <span className={labelClass}>GALLERY (3 images)</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          {item.caseStudy.gallery.map((g, i) => (
            <div key={i} className="flex flex-col gap-2 p-3 border border-line/60 rounded bg-ink/40">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.65rem] text-muted tracking-widest2">FRAME 0{i + 1}</span>
                <label className="font-mono text-[0.65rem] tracking-widest2 text-mint hover:underline cursor-pointer">
                  {uploadingGalleryIdx === i ? "UPLOADING…" : "+ UPLOAD"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                    onChange={(e) => onGalleryChange(i, e)}
                    disabled={uploadingGalleryIdx === i}
                    className="hidden"
                  />
                </label>
              </div>

              {g.image && (
                <div className="relative w-full h-24 border border-line bg-surface overflow-hidden rounded">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.image}
                    alt={g.label || `Frame ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <input
                placeholder="Caption (e.g. Identity System)"
                value={g.label}
                onChange={(e) => {
                  const next = [...item.caseStudy.gallery];
                  next[i] = { ...next[i], label: e.target.value };
                  setCS("gallery", next);
                }}
                className={inputClass}
              />
              <input
                placeholder="Image URL"
                value={g.image}
                onChange={(e) => {
                  const next = [...item.caseStudy.gallery];
                  next[i] = { ...next[i], image: e.target.value };
                  setCS("gallery", next);
                }}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={fieldWrap}>
        <span className={labelClass}>RESULTS — SUMMARY</span>
        <textarea
          rows={3}
          value={item.caseStudy.results.summary}
          onChange={(e) => setCS("results", { ...item.caseStudy.results, summary: e.target.value })}
          className={inputClass + " resize-none"}
        />
        <span className={labelClass}>RESULTS — STATS (4)</span>
        <StatRow
          stats={item.caseStudy.results.stats}
          onChange={(next) => setCS("results", { ...item.caseStudy.results, stats: next })}
        />
        <span className={labelClass}>RESULTS — PULL QUOTE</span>
        <textarea
          rows={2}
          value={item.caseStudy.results.quote}
          onChange={(e) => setCS("results", { ...item.caseStudy.results, quote: e.target.value })}
          className={inputClass + " resize-none"}
        />
      </div>

      {error && <p className="font-mono text-xs text-red-400">{error}</p>}

      <div className="flex items-center gap-4 border-t border-line pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-mint text-mint-ink px-6 py-3 font-mono text-xs tracking-widest2 disabled:opacity-50"
        >
          {saving ? "SAVING…" : mode === "create" ? "CREATE PROJECT" : "SAVE CHANGES"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="font-mono text-xs tracking-widest2 text-muted hover:text-paper transition-colors"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}
