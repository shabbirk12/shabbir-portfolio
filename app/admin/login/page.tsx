"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Login failed.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error — try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-ink px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm border border-line p-8 flex flex-col gap-6"
      >
        <div>
          <p className="font-mono text-[0.65rem] tracking-widest2 text-lime mb-2">ADMIN</p>
          <h1 className="font-display text-2xl uppercase text-paper">Sign in</h1>
        </div>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">USERNAME</span>
          <input
            name="username"
            required
            autoComplete="username"
            className="bg-transparent border-b border-line py-3 text-paper focus-visible:outline-none outline-none focus:border-lime transition-colors"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">PASSWORD</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="bg-transparent border-b border-line py-3 text-paper focus-visible:outline-none outline-none focus:border-lime transition-colors"
          />
        </label>

        {error && <p className="font-mono text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 border border-line px-6 py-3 font-mono text-xs tracking-widest2 text-paper hover:border-lime hover:text-lime transition-colors disabled:opacity-50"
        >
          {loading ? "SIGNING IN…" : "SIGN IN →"}
        </button>

        <Link
          href="/admin/forgot-password"
          className="text-center font-mono text-xs text-muted hover:text-lime transition-colors"
        >
          Forgot password?
        </Link>
      </form>
    </main>
  );
}
