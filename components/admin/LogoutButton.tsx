"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={onLogout}
      className="font-mono text-xs tracking-widest2 text-muted hover:text-mint transition-colors"
    >
      LOG OUT
    </button>
  );
}
