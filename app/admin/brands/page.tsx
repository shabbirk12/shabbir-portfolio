"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";

interface Brand {
  id: number;
  name: string;
  category: string;
  logo_url: string;
  sort_order: number;
}

const inputClass =
  "bg-transparent border-b border-line py-2.5 text-paper placeholder:text-muted/40 focus-visible:outline-none outline-none focus:border-mint transition-colors w-full";
const labelClass = "font-mono text-[0.65rem] tracking-widest2 text-muted";

export default function BrandsAdminPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  /* form state */
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  async function fetchBrands() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/brands");
      const data = await res.json();
      setBrands(Array.isArray(data) ? data : []);
    } catch {
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBrands();
  }, []);

  function resetForm() {
    setEditingId(null);
    setName("");
    setCategory("");
    setLogoUrl("");
    setSortOrder(0);
    setMsg("");
  }

  function startEdit(b: Brand) {
    setEditingId(b.id);
    setName(b.name);
    setCategory(b.category);
    setLogoUrl(b.logo_url);
    setSortOrder(b.sort_order);
    setMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setLogoUrl(json.url);
      setMsg("Logo uploaded!");
    } catch (err: any) {
      setMsg(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setMsg("");

    const payload = {
      name: name.trim(),
      category: category.trim(),
      logo_url: logoUrl.trim(),
      sort_order: sortOrder,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/brands/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Save failed.");
        setMsg("Brand updated!");
      } else {
        const res = await fetch("/api/admin/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Create failed.");
        setMsg("Brand added!");
      }
      resetForm();
      fetchBrands();
    } catch (err: any) {
      setMsg(err.message || "Error.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: number, brandName: string) {
    if (!confirm(`Delete "${brandName}"? This can't be undone.`)) return;
    try {
      await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
      fetchBrands();
    } catch {
      alert("Delete failed.");
    }
  }

  return (
    <main className="min-h-screen bg-ink px-6 md:px-10 py-10">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="font-mono text-[0.65rem] tracking-widest2 text-lime mb-2">ADMIN</p>
          <h1 className="font-display text-3xl uppercase text-paper">Brands Marquee</h1>
        </div>
        <Link
          href="/admin"
          className="font-mono text-xs tracking-widest2 text-muted hover:text-lime transition-colors"
        >
          ← DASHBOARD
        </Link>
      </div>

      {/* Add / Edit Form */}
      <form
        onSubmit={onSubmit}
        className="border border-line p-6 rounded bg-surface/30 mb-10 max-w-2xl flex flex-col gap-5"
      >
        <p className="font-mono text-xs tracking-widest2 text-mint">
          {editingId ? "EDIT BRAND" : "ADD NEW BRAND"}
        </p>

        <div className="flex flex-col gap-2">
          <span className={labelClass}>BRAND NAME *</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. The Camden Brokers"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className={labelClass}>CATEGORY (subtitle)</span>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Luxury Asset Brokerage · London"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className={labelClass}>LOGO URL</span>
            <label className="font-mono text-[0.65rem] tracking-widest2 text-lime hover:underline cursor-pointer">
              {uploading ? "UPLOADING…" : "+ UPLOAD LOGO"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                onChange={onLogoUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          <input
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://... or upload above"
            className={inputClass}
          />
          {logoUrl && (
            <div className="flex items-center gap-3 mt-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Logo preview"
                className="h-10 w-auto max-w-[120px] object-contain bg-white/10 rounded p-1"
              />
              <span className="font-mono text-[0.6rem] text-muted">Preview</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className={labelClass}>SORT ORDER (lower = first)</span>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
            className={inputClass + " max-w-[120px]"}
          />
        </div>

        {msg && <p className="font-mono text-xs text-mint">{msg}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-lime text-lime-ink px-5 py-2.5 font-mono text-xs tracking-widest2 font-semibold disabled:opacity-50"
          >
            {saving ? "SAVING…" : editingId ? "SAVE CHANGES" : "+ ADD BRAND"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="font-mono text-xs tracking-widest2 text-muted hover:text-paper transition-colors"
            >
              CANCEL EDIT
            </button>
          )}
        </div>
      </form>

      {/* Brands List */}
      <div className="border border-line rounded">
        {loading ? (
          <p className="p-6 text-muted font-mono text-sm">Loading…</p>
        ) : brands.length === 0 ? (
          <p className="p-6 text-muted font-mono text-sm">No brands yet. Add one above.</p>
        ) : (
          brands.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between gap-4 border-b border-line last:border-b-0 p-5"
            >
              <div className="flex items-center gap-4 min-w-0">
                {b.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={b.logo_url}
                    alt={b.name}
                    className="h-8 w-auto max-w-[80px] object-contain bg-white/10 rounded p-1 shrink-0"
                  />
                ) : (
                  <div className="h-8 w-12 bg-surface rounded flex items-center justify-center shrink-0">
                    <span className="text-muted text-[0.6rem]">NO IMG</span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-display text-sm uppercase text-paper truncate">{b.name}</p>
                  {b.category && (
                    <p className="text-muted text-xs truncate">{b.category}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-[0.6rem] text-muted">#{b.sort_order}</span>
                <button
                  onClick={() => startEdit(b)}
                  className="border border-line px-3 py-1.5 font-mono text-[0.65rem] tracking-widest2 text-paper hover:border-lime hover:text-lime transition-colors"
                >
                  EDIT
                </button>
                <button
                  onClick={() => onDelete(b.id, b.name)}
                  className="border border-line px-3 py-1.5 font-mono text-[0.65rem] tracking-widest2 text-red-400 hover:border-red-400 transition-colors"
                >
                  DELETE
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
