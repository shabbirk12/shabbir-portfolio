"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import type { Review } from "@/lib/reviewsStore";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [loading, setLoading] = useState(true);

  // Manual review creator state
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [addMsg, setAddMsg] = useState("");

  async function loadReviews() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function setStatus(id: number, status: "approved" | "rejected" | "pending") {
    // Optimistic update
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    setReviews((prev) => prev.filter((r) => r.id !== id));
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
  }

  async function handleAddReview(e: FormEvent) {
    e.preventDefault();
    setAddMsg("");
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, company, rating, content, status: "approved" }),
      });
      const data = await res.json();
      if (res.ok) {
        setAddMsg("Review added and published live!");
        setName("");
        setRole("");
        setCompany("");
        setContent("");
        setRating(5);
        setShowAddForm(false);
        loadReviews();
      } else {
        setAddMsg(data.error || "Failed to add review.");
      }
    } catch {
      setAddMsg("Network error.");
    }
  }

  const filtered = reviews.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <main className="min-h-screen bg-ink px-6 md:px-12 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin" className="font-mono text-xs text-muted hover:text-lime transition-colors">
            ← BACK TO DASHBOARD
          </Link>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-full bg-lime text-lime-ink px-4 py-2 font-mono text-xs tracking-widest2 font-semibold hover:scale-105 transition-transform"
          >
            {showAddForm ? "CANCEL" : "+ ADD REVIEW MANUALLY"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-[0.65rem] tracking-widest2 text-lime uppercase mb-1">CLIENT TRUST</p>
            <h1 className="font-display text-3xl sm:text-4xl uppercase text-paper">Testimonials &amp; Reviews</h1>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-colors ${
                  filter === tab
                    ? "bg-lime text-lime-ink font-semibold"
                    : "border border-line text-muted hover:text-paper"
                }`}
              >
                {tab}
                {tab === "pending" && pendingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[0.6rem]">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Add Review Drawer */}
        {showAddForm && (
          <form onSubmit={handleAddReview} className="mb-10 p-6 border border-line bg-surface/60 rounded-lg flex flex-col gap-4">
            <h3 className="font-display text-lg uppercase text-paper">Create Approved Testimonial</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Client Name *"
                className="bg-transparent border-b border-line py-2 text-sm text-paper focus:border-lime"
              />
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role (e.g. Managing Director)"
                className="bg-transparent border-b border-line py-2 text-sm text-paper focus:border-lime"
              />
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company / Client Name"
                className="bg-transparent border-b border-line py-2 text-sm text-paper focus:border-lime"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted">Rating:</span>
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button" onClick={() => setRating(s)} className="text-xl">
                  <span className={s <= rating ? "text-lime" : "text-line"}>★</span>
                </button>
              ))}
            </div>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Full quote or testimonial text..."
              className="bg-transparent border-b border-line py-2 text-sm text-paper focus:border-lime resize-none"
            />
            <div className="flex items-center gap-3">
              <button type="submit" className="rounded-full bg-lime text-lime-ink px-5 py-2 font-mono text-xs tracking-widest2">
                SAVE &amp; PUBLISH LIVE
              </button>
              {addMsg && <span className="font-mono text-xs text-lime">{addMsg}</span>}
            </div>
          </form>
        )}

        {/* Reviews List */}
        {loading ? (
          <p className="font-mono text-xs text-muted py-12 text-center">Loading reviews...</p>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center border border-line rounded bg-surface/20">
            <p className="font-mono text-xs text-muted">No reviews in this category.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="p-6 border border-line bg-surface/40 rounded-lg flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lime text-sm">{"★".repeat(r.rating)}</span>
                    <span
                      className={`font-mono text-[0.65rem] tracking-widest2 px-2.5 py-0.5 rounded-full uppercase ${
                        r.status === "approved"
                          ? "bg-lime/10 text-lime border border-lime/30"
                          : r.status === "pending"
                          ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                          : "bg-red-500/10 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {r.status}
                    </span>
                    <span className="font-mono text-[0.65rem] text-muted">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-paper text-sm sm:text-base leading-relaxed italic mb-4">
                    &ldquo;{r.content}&rdquo;
                  </p>

                  <div className="flex items-center gap-2 font-mono text-xs text-paper">
                    <span className="font-bold">{r.name}</span>
                    {(r.role || r.company) && (
                      <span className="text-muted">
                        · {r.role} {r.company ? `(${r.company})` : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                  {r.status !== "approved" && (
                    <button
                      type="button"
                      onClick={() => setStatus(r.id, "approved")}
                      className="px-3 py-1.5 rounded bg-lime text-lime-ink font-mono text-xs font-semibold hover:scale-105 transition-transform"
                    >
                      ✓ APPROVE
                    </button>
                  )}
                  {r.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => setStatus(r.id, "rejected")}
                      className="px-3 py-1.5 rounded border border-line text-muted hover:text-paper font-mono text-xs transition-colors"
                    >
                      ✕ REJECT
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    className="px-3 py-1.5 rounded border border-line/60 text-muted hover:text-red-400 font-mono text-xs transition-colors"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
