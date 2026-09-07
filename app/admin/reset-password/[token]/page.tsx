"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirm = (form.elements.namedItem("confirm") as HTMLInputElement).value;

    if (password !== confirm) {
      setError("Passwords don't match.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params.token, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("done");
      setTimeout(() => router.push("/admin/login"), 1800);
    } catch {
      setError("Network error — try again.");
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm border border-line p-8">
        <p className="font-mono text-[0.65rem] tracking-widest2 text-lime mb-2">ADMIN</p>
        <h1 className="font-display text-2xl uppercase text-paper mb-6">Set a new password</h1>

        {status === "done" ? (
          <p className="font-mono text-sm text-lime">Password updated — redirecting to sign in…</p>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">NEW PASSWORD</span>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="bg-transparent border-b border-line py-3 text-paper focus-visible:outline-none outline-none focus:border-lime transition-colors"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">CONFIRM PASSWORD</span>
              <input
                name="confirm"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="bg-transparent border-b border-line py-3 text-paper focus-visible:outline-none outline-none focus:border-lime transition-colors"
              />
            </label>

            {error && <p className="font-mono text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={status === "sending"}
              className="border border-line px-6 py-3 font-mono text-xs tracking-widest2 text-paper hover:border-lime hover:text-lime transition-colors disabled:opacity-50"
            >
              {status === "sending" ? "SAVING…" : "SET PASSWORD →"}
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
