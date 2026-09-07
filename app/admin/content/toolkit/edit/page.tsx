import { redirect } from "next/navigation";
import Link from "next/link";
import { hasValidSession } from "@/lib/adminAuth";
import ToolkitEditor from "@/components/admin/ToolkitEditor";

export const dynamic = "force-dynamic";

export default function ToolkitEditPage() {
  if (!hasValidSession()) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-ink px-6 md:px-10 py-10">
      <Link href="/admin" className="font-mono text-xs text-muted hover:text-mint transition-colors">
        ← BACK TO DASHBOARD
      </Link>
      <p className="font-mono text-[0.65rem] tracking-widest2 text-mint mb-2 mt-6">ADMIN</p>
      <h1 className="font-display text-3xl uppercase text-paper mb-10">Toolkit</h1>

      <ToolkitEditor />
    </main>
  );
}
