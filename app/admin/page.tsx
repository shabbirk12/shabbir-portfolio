import { redirect } from "next/navigation";
import Link from "next/link";
import { hasValidSession } from "@/lib/adminAuth";
import { getProjects } from "@/lib/projectsStore";
import DeleteButton from "@/components/admin/DeleteButton";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!hasValidSession()) redirect("/admin/login");

  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-ink px-6 md:px-10 py-10">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="font-mono text-[0.65rem] tracking-widest2 text-mint mb-2">ADMIN</p>
          <h1 className="font-display text-3xl uppercase text-paper">Projects</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="font-mono text-xs tracking-widest2 text-muted hover:text-mint transition-colors"
          >
            VIEW SITE ↗
          </Link>
          <Link
            href="/admin/projects/new"
            className="rounded-full bg-mint text-mint-ink px-5 py-2.5 font-mono text-xs tracking-widest2"
          >
            + NEW PROJECT
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="border border-line">
        {projects.length === 0 && (
          <p className="p-8 text-muted font-mono text-sm">No projects yet.</p>
        )}
        {projects.map((p) => (
          <div
            key={p.slug}
            className="flex items-center justify-between gap-4 border-b border-line last:border-b-0 p-5"
          >
            <div className="min-w-0">
              <p className="font-mono text-xs text-muted mb-1">
                {p.index} · {p.year} · {p.tag}
              </p>
              <p className="font-display text-lg uppercase text-paper truncate">{p.title}</p>
              <p className="text-muted text-sm truncate max-w-lg">{p.summary}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/work/${p.slug}`}
                target="_blank"
                className="font-mono text-xs text-muted hover:text-mint transition-colors"
              >
                PREVIEW
              </Link>
              <Link
                href={`/admin/projects/${p.slug}/edit`}
                className="border border-line px-4 py-2 font-mono text-xs tracking-widest2 text-paper hover:border-mint hover:text-mint transition-colors"
              >
                EDIT
              </Link>
              <DeleteButton slug={p.slug} title={p.title} />
          </div>
        </div>
        ))}
      </div>

      <div className="mt-14">
        <p className="font-mono text-[0.65rem] tracking-widest2 text-muted mb-4">
          SITE CONTENT
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { href: "/admin/content/skills", label: "Skills / Tools", desc: "The scrolling ticker under the hero" },
            { href: "/admin/content/services", label: "Services", desc: "The 5 rows in the Services section" },
            { href: "/admin/content/lab", label: "Experiment Lab", desc: "The 3 experiments in the Lab section" },
            { href: "/admin/content/toolkit/edit", label: "Toolkit", desc: "Design / Engineering columns" },
            { href: "/admin/content/stats", label: "Stats", desc: "The 4 big numbers below About" },
            { href: "/admin/content/about-details", label: "About Details", desc: "Role / Status / Focus rows" },
            { href: "/admin/settings", label: "Site Settings", desc: "Title, logo, and About profile picture" },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="border border-line p-5 hover:border-mint transition-colors group"
            >
              <p className="font-display text-lg uppercase text-paper group-hover:text-mint transition-colors">
                {c.label}
              </p>
              <p className="text-muted text-xs mt-1">{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
