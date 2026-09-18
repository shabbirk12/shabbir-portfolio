"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/Reveal";
import type { Review } from "@/lib/reviewsStore";

export default function Reviews({ initialReviews = [] }: { initialReviews?: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) setReviews(data.reviews);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, company, rating, content, logo_url: logoUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to submit review.");
        return;
      }
      setSubmittedMessage(
        data.message ||
          "Thank you for putting your trust in my craft! Your review has been received with sincere gratitude and will appear live on the site as soon as it's verified."
      );
      setName("");
      setRole("");
      setCompany("");
      setLogoUrl("");
      setContent("");
      setRating(5);
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="testimonials" className="px-6 md:px-10 py-24 md:py-32 border-t border-line relative overflow-hidden">
      <span id="reviews" className="absolute -top-20" aria-hidden="true" />
      {/* Ambient glow */}
      <div className="ambient-blob w-[450px] h-[450px] -top-20 -right-20 opacity-20 pointer-events-none" aria-hidden="true" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <Reveal>
          <p className="eyebrow mb-3">04 / CLIENT VOICES &amp; TRUST</p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl uppercase leading-none">
            Client <span className="font-script italic text-lime text-5xl sm:text-6xl md:text-8xl lowercase">reviews.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true);
              setSubmittedMessage("");
              setErrorMsg("");
            }}
            className="inline-flex items-center gap-2 rounded-full border border-lime/40 bg-lime/10 px-5 py-2.5 font-mono text-xs tracking-widest2 text-lime hover:bg-lime hover:text-lime-ink transition-all hover:scale-105 hover:shadow-glow-lime"
          >
            + WRITE A REVIEW ↗
          </button>
        </Reveal>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="section-frame group relative p-7 sm:p-8 border border-line bg-surface/30 backdrop-blur-sm rounded-lg flex flex-col justify-between hover:border-lime transition-all duration-300 hover:shadow-glow-lime/10"
          >
            <span className="corner-bracket top-2 left-2 border-t border-l border-lime opacity-30" />
            <span className="corner-bracket top-2 right-2 border-t border-r border-lime opacity-30" />
            <span className="corner-bracket bottom-2 left-2 border-b border-l border-lime opacity-30" />
            <span className="corner-bracket bottom-2 right-2 border-b border-r border-lime opacity-30" />

            <div>
              {/* Stars */}
              <div className="flex items-center gap-1 mb-5 text-lime text-sm tracking-widest" aria-label={`${r.rating} stars`}>
                {Array.from({ length: 5 }).map((_, starIdx) => (
                  <span key={starIdx} className={starIdx < r.rating ? "text-lime opacity-100" : "text-muted/30"}>
                    ★
                  </span>
                ))}
                <span className="font-mono text-[0.6rem] text-muted ml-2 tracking-widest2">VERIFIED</span>
              </div>

              {/* Quote Content */}
              <p className="text-paper/90 text-sm sm:text-base leading-relaxed font-normal mb-8 italic">
                &ldquo;{r.content}&rdquo;
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-4 border-t border-line/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {r.logo_url ? (
                  <img
                    src={r.logo_url}
                    alt={r.name}
                    className="w-10 h-10 rounded-full object-cover border border-line/80 bg-surface shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-lime/10 border border-lime/30 text-lime font-mono text-xs flex items-center justify-center font-bold shrink-0">
                    {r.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-display text-sm font-semibold uppercase text-paper group-hover:text-lime transition-colors">
                    {r.name}
                  </p>
                  {(r.role || r.company) && (
                    <p className="font-mono text-[0.65rem] tracking-wider text-muted mt-0.5">
                      {r.role}
                      {r.role && r.company ? " · " : ""}
                      {r.company}
                    </p>
                  )}
                </div>
              </div>
              <span className="font-mono text-[0.6rem] text-muted/60 tracking-widest2 uppercase self-start mt-1 shrink-0">
                {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="p-12 text-center border border-line rounded bg-surface/20">
          <p className="font-mono text-xs tracking-widest2 text-muted uppercase">No reviews published yet.</p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-block font-mono text-xs text-lime underline"
          >
            Be the first to share your experience ↗
          </button>
        </div>
      )}

      {/* Review Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg p-6 sm:p-8 bg-surface border border-line rounded-xl shadow-2xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 font-mono text-xs text-muted hover:text-paper"
              >
                ✕ CLOSE
              </button>

              {submittedMessage ? (
                <div className="py-6 text-center">
                  <span className="text-4xl block mb-3">✨</span>
                  <h3 className="font-display text-2xl uppercase text-paper mb-3">REVIEW SUBMITTED</h3>
                  <p className="font-body text-sm text-lime/90 leading-relaxed max-w-sm mx-auto mb-6">
                    {submittedMessage}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-full bg-lime text-lime-ink px-6 py-2.5 font-mono text-xs tracking-widest2 font-semibold hover:scale-105 transition-transform"
                  >
                    RETURN TO PORTFOLIO
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <span className="font-mono text-[0.65rem] tracking-widest2 text-lime uppercase block mb-1">
                      CLIENT FEEDBACK
                    </span>
                    <h3 className="font-display text-2xl uppercase text-paper">Write a Review</h3>
                    <p className="text-muted text-xs mt-1">
                      Share your experience working on identity, design, or web engineering projects.
                    </p>
                  </div>

                  {/* Rating Selector */}
                  <div className="flex flex-col gap-1.5 mt-2">
                    <span className="font-mono text-[0.65rem] tracking-widest2 text-muted uppercase">RATING</span>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-2xl transition-transform hover:scale-125 focus:outline-none"
                        >
                          <span className={star <= rating ? "text-lime" : "text-line"}>★</span>
                        </button>
                      ))}
                      <span className="font-mono text-xs text-paper ml-2">{rating} / 5 Stars</span>
                    </div>
                  </div>

                  {/* Name */}
                  <label className="flex flex-col gap-1">
                    <span className="font-mono text-[0.65rem] tracking-widest2 text-muted uppercase">YOUR NAME *</span>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Henderson"
                      className="bg-ink border-b border-line py-2 px-1 text-sm text-paper placeholder:text-muted/40 focus:border-lime transition-colors"
                    />
                  </label>

                  {/* Role & Company */}
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="font-mono text-[0.65rem] tracking-widest2 text-muted uppercase">ROLE</span>
                      <input
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Founder"
                        className="bg-ink border-b border-line py-2 px-1 text-sm text-paper placeholder:text-muted/40 focus:border-lime transition-colors"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="font-mono text-[0.65rem] tracking-widest2 text-muted uppercase">COMPANY / PROJECT</span>
                      <input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Studio Nine"
                        className="bg-ink border-b border-line py-2 px-1 text-sm text-paper placeholder:text-muted/40 focus:border-lime transition-colors"
                      />
                    </label>
                  </div>

                  {/* Company Logo / Avatar URL */}
                  <label className="flex flex-col gap-1">
                    <span className="font-mono text-[0.65rem] tracking-widest2 text-muted uppercase">COMPANY LOGO OR AVATAR URL (OPTIONAL)</span>
                    <input
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="bg-ink border-b border-line py-2 px-1 text-sm text-paper placeholder:text-muted/40 focus:border-lime transition-colors"
                    />
                  </label>

                  {/* Review text */}
                  <label className="flex flex-col gap-1">
                    <span className="font-mono text-[0.65rem] tracking-widest2 text-muted uppercase">REVIEW BRIEF *</span>
                    <textarea
                      required
                      rows={3}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Describe the collaboration, deliverables, and outcome..."
                      className="bg-ink border-b border-line py-2 px-1 text-sm text-paper placeholder:text-muted/40 focus:border-lime transition-colors resize-none"
                    />
                  </label>

                  {errorMsg && <p className="font-mono text-xs text-red-400">{errorMsg}</p>}

                  <div className="flex items-center justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 font-mono text-xs tracking-widest2 text-muted hover:text-paper"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-full bg-lime text-lime-ink px-6 py-2.5 font-mono text-xs tracking-widest2 font-semibold hover:scale-105 transition-transform disabled:opacity-50"
                    >
                      {submitting ? "SUBMITTING…" : "SUBMIT REVIEW ↗"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
