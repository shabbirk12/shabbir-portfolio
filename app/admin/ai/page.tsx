"use client";

import { useState } from "react";
import Link from "next/link";

const QUICK_ACTIONS = [
  { label: "Draft Case Study", prompt: "Write a compelling case study for a recent web/brand project. Include: client overview, challenge, solution, results. Use a professional, storytelling tone." },
  { label: "Write Blog Post", prompt: "Write a detailed blog post for a web developer & graphic designer's portfolio. Topic: " },
  { label: "Punchy Headlines", prompt: "Generate 8 punchy, memorable headlines for a web developer & brand designer's portfolio website. They should be bold, modern, and conversion-focused." },
  { label: "Bio Polish", prompt: "Polish and rewrite the following bio for a web developer & graphic designer portfolio. Make it compelling, confident, and unique:\n\n" },
  { label: "Instagram Caption", prompt: "Write 3 Instagram caption options for a web/brand design project post. Make them engaging, with relevant hashtags.\n\nProject description: " },
  { label: "Service Description", prompt: "Write a professional, conversion-focused service description for a portfolio website. Service: " },
];

export default function AICommandCenterPage() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput("");
    setError("");
    setCopied(false);

    try {
      const res = await fetch("/api/admin/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate.");
        return;
      }
      setOutput(data.text || "");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-ink px-6 md:px-12 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin" className="font-mono text-xs text-muted hover:text-lime transition-colors">
            ← BACK TO DASHBOARD
          </Link>
        </div>

        <div className="mb-8">
          <p className="font-mono text-[0.65rem] tracking-widest2 text-lime uppercase mb-1">ADMIN TOOL</p>
          <h1 className="font-display text-3xl sm:text-4xl uppercase text-paper">
            Gemini AI Command Center
          </h1>
          <p className="text-muted text-sm mt-2">
            Command Gemini to draft copy, polish text, write blogs, generate captions, or anything else. Output ready to copy and use.
          </p>
        </div>

        {/* Quick Action Pills */}
        <div className="mb-6">
          <p className="font-mono text-[0.65rem] tracking-widest2 text-muted uppercase mb-3">QUICK ACTIONS</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => setPrompt((prev) => a.prompt + (prev && a.prompt.endsWith("\n\n") ? prev : ""))}
                className="rounded-full border border-line px-4 py-1.5 font-mono text-xs text-muted hover:border-lime hover:text-lime transition-colors"
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="mb-4">
          <label className="font-mono text-[0.65rem] tracking-widest2 text-muted uppercase block mb-2">
            YOUR COMMAND TO GEMINI
          </label>
          <textarea
            rows={6}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Write a compelling project description for a nightclub brand identity and website I designed in London..."
            className="w-full bg-surface border border-line rounded-lg p-4 text-sm text-paper placeholder:text-muted/50 focus:border-lime transition-colors resize-y font-body leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="rounded-full bg-lime text-lime-ink px-7 py-3 font-mono text-xs tracking-widest2 font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
          >
            {loading ? "GENERATING…" : "✨ GENERATE WITH GEMINI"}
          </button>
          {output && (
            <button
              type="button"
              onClick={() => setPrompt("")}
              className="font-mono text-xs text-muted hover:text-paper transition-colors"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-lg border border-red-500/30 bg-red-500/10">
            <p className="font-mono text-xs text-red-400">{error}</p>
          </div>
        )}

        {/* Generated Output */}
        {output && (
          <div className="rounded-xl border border-lime/30 bg-surface overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-line bg-lime/5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
                <p className="font-mono text-[0.65rem] tracking-widest2 text-lime uppercase">
                  GEMINI OUTPUT
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className={`font-mono text-xs px-4 py-1.5 rounded-full transition-all ${
                  copied
                    ? "bg-lime text-lime-ink"
                    : "border border-line text-muted hover:border-lime hover:text-lime"
                }`}
              >
                {copied ? "✓ COPIED!" : "COPY"}
              </button>
            </div>
            <div className="p-5 max-h-[560px] overflow-y-auto">
              <pre className="text-paper/90 text-sm leading-relaxed whitespace-pre-wrap font-body">
                {output}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

