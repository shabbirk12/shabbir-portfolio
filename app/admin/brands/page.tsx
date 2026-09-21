"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Brand {
  id: number;
  name: string;
  category: string;
  logo_url: string | null;
  display_order: number;
  active: boolean;
}

const inputClass =
  "bg-transparent border-b border-line py-2 text-paper placeholder:text-muted/40 focus-visible:outline-none outline-none focus:border-mint transition-colors w-full font-mono text-sm";
const labelClass = "font-mono text-[0.6rem] tracking-widest2 text-muted uppercase";

function BrandRow({
  brand,
  onSave,
  onDelete,
}: {
  brand: Brand;
  onSave: (updated: Brand) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Brand>(brand);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function save() {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setEditing(false);
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (json.url) setDraft((d) => ({ ...d, logo_url: json.url }));
    setUploading(false);
    e.target.value = "";
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-4 border-b border-line last:border-b-0 px-5 py-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            {brand.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.logo_url} alt={brand.name} className="h-7 w-auto object-contain opacity-70" />
            ) : (
              <div className="h-7 w-20 bg-line/30 rounded flex items-center justify-center">
                <span className="font-mono text-[0.55rem] text-muted">NO LOGO</span>
              </div>
            )}
            <div>
              <p className="font-display text-base uppercase text-paper">{brand.name}</p>
              <p className="font-mono text-xs text-muted">{brand.category}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`font-mono text-[0.6rem] px-2 py-0.5 rounded-full ${
              brand.active ? "bg-lime/20 text-lime" : "bg-line text-muted"
            }`}
          >
            {brand.active ? "ACTIVE" : "HIDDEN"}
          </span>
          <span className="font-mono text-[0.6rem] text-muted">#{brand.display_order}</span>
          <button
            onClick={() => setEditing(true)}
            className="border border-line px-3 py-1.5 font-mono text-xs tracking-widest2 text-paper hover:border-mint hover:text-mint transition-colors"
          >
            EDIT
          </button>
          <button
            onClick={() => onDelete(brand.id)}
            className="font-mono text-xs tracking-widest2 text-red-400 hover:text-red-300 transition-colors"
          >
            DELETE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-line last:border-b-0 px-5 py-5 bg-surface/30">
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <span className={labelClass}>Brand Name</span>
          <input
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className={labelClass}>Category / Tagline</span>
          <input
            value={draft.category}
            onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
            className={inputClass}
            placeholder="e.g. Luxury Asset Brokerage · London"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className={labelClass}>Logo URL (or upload below)</span>
          <input
            value={draft.logo_url ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, logo_url: e.target.value || null }))}
            className={inputClass}
            placeholder="https://..."
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className={labelClass}>Display Order</span>
          <input
            type="number"
            value={draft.display_order}
            onChange={(e) => setDraft((d) => ({ ...d, display_order: Number(e.target.value) }))}
            className={inputClass}
          />
        </div>
      </div>

      {/* Logo preview + upload */}
      <div className="flex items-center gap-4 mb-4">
        {draft.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={draft.logo_url} alt="Preview" className="h-10 w-auto object-contain" />
        )}
        <label className="font-mono text-[0.65rem] tracking-widest2 text-lime hover:underline cursor-pointer">
          {uploading ? "UPLOADING…" : "+ UPLOAD LOGO IMAGE"}
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </label>
        {draft.logo_url && (
          <button
            type="button"
            onClick={() => setDraft((d) => ({ ...d, logo_url: null }))}
            className="font-mono text-[0.6rem] text-muted hover:text-red-400 transition-colors"
          >
            REMOVE LOGO
          </button>
        )}
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => setDraft((d) => ({ ...d, active: !d.active }))}
          className={`font-mono text-[0.65rem] tracking-widest2 px-3 py-1.5 border rounded transition-colors ${
            draft.active
              ? "border-lime text-lime bg-lime/10"
              : "border-line text-muted"
          }`}
        >
          {draft.active ? "ACTIVE (SHOWN)" : "HIDDEN"}
        </button>
        <span className="font-mono text-[0.6rem] text-muted">Toggle visibility in the marquee</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-lime text-lime-ink px-5 py-2 font-mono text-xs tracking-widest2 disabled:opacity-50"
        >
          {saving ? "SAVING…" : "SAVE"}
        </button>
        <button
          onClick={() => { setEditing(false); setDraft(brand); }}
          className="font-mono text-xs text-muted hover:text-paper transition-colors"
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}

export default function BrandsAdmin() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: "", category: "", logo_url: "", display_order: 0 });
  const [uploadingNew, setUploadingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const newFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/brands")
      .then((r) => r.json())
      .then((data) => {
        setBrands(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load brands.");
        setLoading(false);
      });
  }, []);

  async function handleSave(updated: Brand) {
    const res = await fetch(`/api/admin/brands/${updated.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    const data = await res.json();
    if (res.ok) {
      setBrands((prev) => prev.map((b) => (b.id === updated.id ? data : b)));
    } else {
      alert(data.error || "Save failed.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this brand?")) return;
    const res = await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBrands((prev) => prev.filter((b) => b.id !== id));
    } else {
      alert("Delete failed.");
    }
  }

  async function handleNewLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingNew(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (json.url) setNewBrand((d) => ({ ...d, logo_url: json.url }));
    setUploadingNew(false);
    e.target.value = "";
  }

  async function handleCreate() {
    if (!newBrand.name.trim()) { alert("Name is required."); return; }
    setSaving(true);
    const res = await fetch("/api/admin/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newBrand,
        logo_url: newBrand.logo_url || null,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setBrands((prev) => [...prev, data]);
      setNewBrand({ name: "", category: "", logo_url: "", display_order: 0 });
      setAdding(false);
    } else {
      alert(data.error || "Create failed.");
    }
    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-ink px-6 md:px-10 py-10">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="font-mono text-[0.65rem] tracking-widest2 text-lime mb-2">ADMIN</p>
          <h1 className="font-display text-3xl uppercase text-paper">Brands Marquee</h1>
          <p className="text-muted text-sm mt-1">Edit logos and brands shown in the scrolling marquee on the homepage.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="font-mono text-xs tracking-widest2 text-muted hover:text-lime transition-colors"
          >
            ← DASHBOARD
          </Link>
          <button
            onClick={() => { setAdding(true); }}
            className="rounded-full bg-lime text-lime-ink px-5 py-2.5 font-mono text-xs tracking-widest2 font-semibold hover:scale-105 transition-transform"
          >
            + ADD BRAND
          </button>
        </div>
      </div>

      {loading && <p className="font-mono text-sm text-muted">Loading…</p>}
      {error && <p className="font-mono text-sm text-red-400">{error}</p>}

      {/* Add new brand form */}
      {adding && (
        <div className="border border-lime/30 bg-lime/5 rounded p-5 mb-6">
          <p className="font-mono text-xs tracking-widest2 text-lime mb-4">NEW BRAND</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1">
              <span className={labelClass}>Name *</span>
              <input
                value={newBrand.name}
                onChange={(e) => setNewBrand((d) => ({ ...d, name: e.target.value }))}
                className={inputClass}
                placeholder="e.g. Studio Nine"
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className={labelClass}>Category</span>
              <input
                value={newBrand.category}
                onChange={(e) => setNewBrand((d) => ({ ...d, category: e.target.value }))}
                className={inputClass}
                placeholder="e.g. Creative Direction & Brand Identity"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className={labelClass}>Logo URL</span>
              <input
                value={newBrand.logo_url}
                onChange={(e) => setNewBrand((d) => ({ ...d, logo_url: e.target.value }))}
                className={inputClass}
                placeholder="https://... (or upload below)"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className={labelClass}>Display Order</span>
              <input
                type="number"
                value={newBrand.display_order}
                onChange={(e) => setNewBrand((d) => ({ ...d, display_order: Number(e.target.value) }))}
                className={inputClass}
              />
            </div>
          </div>

          {/* Logo upload */}
          <div className="flex items-center gap-4 mb-4">
            {newBrand.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={newBrand.logo_url} alt="Preview" className="h-10 w-auto object-contain" />
            )}
            <label className="font-mono text-[0.65rem] tracking-widest2 text-lime hover:underline cursor-pointer">
              {uploadingNew ? "UPLOADING…" : "+ UPLOAD LOGO"}
              <input
                ref={newFileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                onChange={handleNewLogoUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreate}
              disabled={saving}
              className="rounded-full bg-lime text-lime-ink px-5 py-2 font-mono text-xs tracking-widest2 disabled:opacity-50"
            >
              {saving ? "CREATING…" : "CREATE BRAND"}
            </button>
            <button
              onClick={() => { setAdding(false); setNewBrand({ name: "", category: "", logo_url: "", display_order: 0 }); }}
              className="font-mono text-xs text-muted hover:text-paper transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* Brands list */}
      {!loading && brands.length === 0 && !adding && (
        <p className="p-8 text-muted font-mono text-sm">No brands yet. Click &ldquo;+ ADD BRAND&rdquo; to add one.</p>
      )}
      {brands.length > 0 && (
        <div className="border border-line">
          {brands.map((brand) => (
            <BrandRow
              key={brand.id}
              brand={brand}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <p className="font-mono text-[0.6rem] text-muted/50 mt-6">
        {brands.length} brand{brands.length !== 1 ? "s" : ""} total · Changes are live instantly.
      </p>
    </main>
  );
}
