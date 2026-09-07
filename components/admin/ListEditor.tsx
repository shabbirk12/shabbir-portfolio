"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Field = { key: string; label: string; multiline?: boolean };
type Row = Record<string, string>;

const inputClass =
  "bg-transparent border-b border-line py-2 text-paper placeholder:text-muted/40 focus-visible:outline-none outline-none focus:border-mint transition-colors w-full text-sm";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function ListEditor({
  collection,
  title,
  fields,
  isStringArray = false,
  arrayFields = [],
}: {
  collection: string;
  title: string;
  fields: Field[];
  /** True for collections that are just string[] (e.g. skills) rather than object[]. */
  isStringArray?: boolean;
  /** Field keys whose values are string[] in storage, edited here as a comma-separated string. */
  arrayFields?: string[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState("");
  const savedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeFields: Field[] = isStringArray ? [{ key: "value", label: title }] : fields;

  function toRows(data: unknown[]): Row[] {
    if (isStringArray) {
      return (data as string[]).map((v) => ({ value: v }));
    }
    return (data as Record<string, unknown>[]).map((item) => {
      const row: Row = {};
      for (const f of fields) {
        const v = item[f.key];
        row[f.key] = arrayFields.includes(f.key) && Array.isArray(v) ? v.join(", ") : String(v ?? "");
      }
      return row;
    });
  }

  function toPayload(list: Row[]): unknown[] {
    if (isStringArray) return list.map((r) => r.value);
    return list.map((r) => {
      const obj: Record<string, unknown> = {};
      for (const f of fields) {
        obj[f.key] = arrayFields.includes(f.key)
          ? r[f.key].split(",").map((s) => s.trim()).filter(Boolean)
          : r[f.key];
      }
      return obj;
    });
  }

  async function load() {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch(`/api/admin/content/${collection}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || json.error) {
        setLoadError(json.error || `Failed to load (status ${res.status}).`);
        setRows([]);
        return;
      }
      setRows(toRows(json.data));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Network error while loading.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  /** Persists the given row list immediately and reports success/failure inline. */
  async function persist(nextRows: Row[]) {
    setSaveState("saving");
    setSaveError("");
    try {
      const res = await fetch(`/api/admin/content/${collection}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(nextRows)),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveState("error");
        setSaveError(json.error || `Save failed (status ${res.status}).`);
        return false;
      }
      setSaveState("saved");
      if (savedTimeout.current) clearTimeout(savedTimeout.current);
      savedTimeout.current = setTimeout(() => setSaveState("idle"), 2000);
      router.refresh();
      return true;
    } catch (err) {
      setSaveState("error");
      setSaveError(err instanceof Error ? err.message : "Network error while saving.");
      return false;
    }
  }

  /** Adds a new row and saves immediately — mirrors "+ New Project" creating right away. */
  async function addRow() {
    const empty: Row = {};
    activeFields.forEach((f) => (empty[f.key] = ""));
    const next = [...rows, empty];
    setRows(next);
    await persist(next);
  }

  function updateRowLocal(i: number, key: string, value: string) {
    setRows((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [key]: value };
      return next;
    });
  }

  /** Saves just this row's current values (and everything else as-is). */
  async function saveRow(i: number) {
    await persist(rows);
  }

  async function removeRow(i: number) {
    if (!confirm("Remove this row? This saves immediately.")) return;
    const next = rows.filter((_, idx) => idx !== i);
    setRows(next);
    await persist(next);
  }

  async function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
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
    <div className="max-w-3xl">
      {/* Persistent save-state indicator so it's always obvious whether the last
          action actually reached the server. */}
      <div className="mb-4 h-5 font-mono text-xs">
        {saveState === "saving" && <span className="text-muted">Saving…</span>}
        {saveState === "saved" && <span className="text-mint">Saved — live on the site.</span>}
        {saveState === "error" && <span className="text-red-400">{saveError}</span>}
      </div>

      {rows.length === 0 && (
        <p className="font-mono text-sm text-muted mb-4">
          No rows yet. Click &ldquo;+ ADD {title.toUpperCase()}&rdquo; below to create one.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {rows.map((row, i) => (
          <div key={i} className="border border-line p-4 flex gap-4 items-start">
            <div className="flex flex-col gap-1 pt-1 shrink-0">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="text-muted hover:text-mint text-xs font-mono disabled:opacity-30"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === rows.length - 1}
                className="text-muted hover:text-mint text-xs font-mono disabled:opacity-30"
                aria-label="Move down"
              >
                ↓
              </button>
            </div>

            <div className="flex-1 grid sm:grid-cols-2 gap-4">
              {activeFields.map((f) => (
                <div
                  key={f.key}
                  className={`flex flex-col gap-1 ${f.multiline ? "sm:col-span-2" : ""}`}
                >
                  <span className="font-mono text-[0.6rem] tracking-widest2 text-muted">
                    {f.label.toUpperCase()}
                    {arrayFields.includes(f.key) && " (comma-separated)"}
                  </span>
                  {f.multiline ? (
                    <textarea
                      rows={2}
                      value={row[f.key] ?? ""}
                      onChange={(e) => updateRowLocal(i, f.key, e.target.value)}
                      className={inputClass + " resize-none"}
                    />
                  ) : (
                    <input
                      value={row[f.key] ?? ""}
                      onChange={(e) => updateRowLocal(i, f.key, e.target.value)}
                      className={inputClass}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 shrink-0 items-end">
              <button
                type="button"
                onClick={() => saveRow(i)}
                className="font-mono text-xs tracking-widest2 text-mint hover:opacity-80 transition-opacity whitespace-nowrap"
              >
                SAVE
              </button>
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="font-mono text-xs text-red-400/80 hover:text-red-400 transition-colors whitespace-nowrap"
              >
                REMOVE
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-4 border border-line px-5 py-2.5 font-mono text-xs tracking-widest2 text-paper hover:border-mint hover:text-mint transition-colors"
      >
        + ADD {title.toUpperCase()}
      </button>

      <p className="mt-6 text-muted text-xs max-w-md">
        Changes save immediately — adding, removing, and reordering all save on
        their own. Use each row&apos;s <span className="text-mint">SAVE</span>{" "}
        button after editing its text fields.
      </p>
    </div>
  );
}
