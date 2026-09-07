"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Network error — try again.");
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm border border-line p-8">
        <p className="font-mono text-[0.65rem] tracking-widest2 text-lime mb-2">ADMIN</p>
        <h1 className="font-display text-2xl uppercase text-paper mb-6">Reset password</h1>

        {status === "sent" ? (
          <p className="text-muted text-sm leading-relaxed">
            If an account exists for that email, a reset link has been sent —
            it expires in 1 hour. Check your inbox.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">EMAIL</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="bg-transparent border-b border-line py-3 text-paper focus-visible:outline-none outline-none focus:border-lime transition-colors"
              />
            </label>

            {error && <p className="font-mono text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={status === "sending"}
              className="border border-line px-6 py-3 font-mono text-xs tracking-widest2 text-paper hover:border-lime hover:text-lime transition-colors disabled:opacity-50"
            >
              {status === "sending" ? "SENDING…" : "SEND RESET LINK →"}
            </button>
          </form>
        )}

        <Link
          href="/admin/login"
          className="mt-6 block font-mono text-xs text-muted hover:text-lime transition-colors"
        >
          ← Back to sign in
        </Link>
      </div>
    </main>
  );
}
