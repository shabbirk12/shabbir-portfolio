"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    setLoading(true);
    const res = await fetch(`/api/admin/projects/${slug}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      const json = await res.json().catch(() => ({}));
      alert(json.error || "Failed to delete.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onDelete}
      disabled={loading}
      className="font-mono text-xs tracking-widest2 text-red-400/80 hover:text-red-400 transition-colors disabled:opacity-50"
    >
      {loading ? "…" : "DELETE"}
    </button>
  );
}
