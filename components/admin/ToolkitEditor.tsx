"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Item = { name: string; tag: string };
type Category = { heading: string; tag: string; items: Item[] };
type SaveState = "idle" | "saving" | "saved" | "error";

const inputClass =
  "bg-transparent border-b border-line py-2 text-paper placeholder:text-muted/40 focus-visible:outline-none outline-none focus:border-mint transition-colors w-full text-sm";

export default function ToolkitEditor() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState("");
  const savedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function load() {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/admin/content/toolkit", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || json.error) {
        setLoadError(json.error || `Failed to load (status ${res.status}).`);
        return;
      }
      setCategories(json.data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Network error while loading.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function persist(next: Category[]) {
    setSaveState("saving");
    setSaveError("");
    try {
      const res = await fetch("/api/admin/content/toolkit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveState("error");
        setSaveError(json.error || `Save failed (status ${res.status}).`);
        return;
      }
      setSaveState("saved");
      if (savedTimeout.current) clearTimeout(savedTimeout.current);
      savedTimeout.current = setTimeout(() => setSaveState("idle"), 2000);
      router.refresh();
    } catch (err) {
      setSaveState("error");
      setSaveError(err instanceof Error ? err.message : "Network error while saving.");
    }
  }

  function updateCategoryLocal(ci: number, key: "heading" | "tag", value: string) {
    setCategories((prev) => {
      const next = [...prev];
      next[ci] = { ...next[ci], [key]: value };
      return next;
    });
  }

  function updateItemLocal(ci: number, ii: number, key: keyof Item, value: string) {
    setCategories((prev) => {
      const next = [...prev];
      const items = [...next[ci].items];
      items[ii] = { ...items[ii], [key]: value };
      next[ci] = { ...next[ci], items };
      return next;
    });
  }

  async function saveCategory(ci: number) {
    await persist(categories);
  }

  async function addItem(ci: number) {
    const next = [...categories];
    next[ci] = { ...next[ci], items: [...next[ci].items, { name: "", tag: "" }] };
    setCategories(next);
    await persist(next);
  }

  async function removeItem(ci: number, ii: number) {
    if (!confirm("Remove this item? This saves immediately.")) return;
    const next = [...categories];
    next[ci] = { ...next[ci], items: next[ci].items.filter((_, idx) => idx !== ii) };
    setCategories(next);
    await persist(next);
  }

  async function addCategory() {
    const next = [...categories, { heading: "NEW CATEGORY", tag: "/ TAG", items: [] }];
    setCategories(next);
    await persist(next);
  }

  async function removeCategory(ci: number) {
    if (!confirm("Remove this whole category? This saves immediately.")) return;
    const next = categories.filter((_, idx) => idx !== ci);
    setCategories(next);
    await persist(next);
  }

  if (loading) return <p className="font-mono text-sm text-muted p-8">Loading…</p>;

  if (loadError) {
    return (
      <div className="p-8 border border-red-400/30">
        <p className="font-mono text-sm text-red-400 mb-4">{loadError}</p>
        <button
          onClick={load}
          className="border border-line px-4 py-2 font-mono text-xs tracking-widest2 text-paper hover:border-mint hover:text-mint transition-colors"
        >
          RETRY
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-4 h-5 font-mono text-xs">
        {saveState === "saving" && <span className="text-muted">Saving…</span>}
        {saveState === "saved" && <span className="text-mint">Saved — live on the site.</span>}
        {saveState === "error" && <span className="text-red-400">{saveError}</span>}
      </div>

      <div className="flex flex-col gap-8">
        {categories.map((cat, ci) => (
          <div key={ci} className="border border-line p-5">
            <div className="grid sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-line">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[0.6rem] tracking-widest2 text-muted">HEADING</span>
                <input
                  value={cat.heading}
                  onChange={(e) => updateCategoryLocal(ci, "heading", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[0.6rem] tracking-widest2 text-muted">TAG (e.g. / SURFACE)</span>
                <input
                  value={cat.tag}
                  onChange={(e) => updateCategoryLocal(ci, "tag", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {cat.items.map((item, ii) => (
                <div key={ii} className="flex gap-4 items-end">
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="font-mono text-[0.6rem] tracking-widest2 text-muted">NAME</span>
                    <input
                      value={item.name}
                      onChange={(e) => updateItemLocal(ci, ii, "name", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="font-mono text-[0.6rem] tracking-widest2 text-muted">TAG</span>
                    <input
                      value={item.tag}
                      onChange={(e) => updateItemLocal(ci, ii, "tag", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(ci, ii)}
                    className="font-mono text-xs text-red-400/80 hover:text-red-400 transition-colors pb-2"
                  >
                    REMOVE
                  </button>
                </div>
              ))}
              {cat.items.length === 0 && (
                <p className="font-mono text-xs text-muted">No items in this category yet.</p>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => addItem(ci)}
                  className="font-mono text-xs tracking-widest2 text-mint hover:opacity-80 transition-opacity"
                >
                  + ADD ITEM
                </button>
                <button
                  type="button"
                  onClick={() => saveCategory(ci)}
                  className="font-mono text-xs tracking-widest2 text-paper hover:text-mint transition-colors"
                >
                  SAVE HEADING/ITEMS
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeCategory(ci)}
                className="font-mono text-xs tracking-widest2 text-red-400/80 hover:text-red-400 transition-colors"
              >
                REMOVE CATEGORY
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addCategory}
        className="mt-6 border border-line px-5 py-2.5 font-mono text-xs tracking-widest2 text-paper hover:border-mint hover:text-mint transition-colors"
      >
        + ADD CATEGORY
      </button>

      <p className="mt-6 text-muted text-xs max-w-md">
        Adding/removing categories and items saves immediately. After editing
        heading, tag, or name/tag text, click{" "}
        <span className="text-paper">SAVE HEADING/ITEMS</span> on that category.
      </p>
    </div>
  );
}
