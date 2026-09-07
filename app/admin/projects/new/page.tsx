import { redirect } from "next/navigation";
import { hasValidSession } from "@/lib/adminAuth";
import ProjectForm from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  if (!hasValidSession()) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-ink px-6 md:px-10 py-10">
      <p className="font-mono text-[0.65rem] tracking-widest2 text-mint mb-2">ADMIN</p>
      <h1 className="font-display text-3xl uppercase text-paper mb-10">New Project</h1>
      <ProjectForm mode="create" />
    </main>
  );
}
