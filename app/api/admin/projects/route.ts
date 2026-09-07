import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/adminAuth";
import { getProjects, createProject, isValidSlug } from "@/lib/projectsStore";
import type { WorkItem } from "@/lib/types";

export const runtime = "nodejs";

function validateProject(body: unknown): { ok: true; item: WorkItem } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid body." };
  const item = body as Partial<WorkItem>;

  if (!item.title || typeof item.title !== "string") return { ok: false, error: "Title is required." };
  if (!item.slug || typeof item.slug !== "string" || !isValidSlug(item.slug)) {
    return { ok: false, error: "Slug must be lowercase letters, numbers and hyphens only." };
  }
  if (!item.image || typeof item.image !== "string") return { ok: false, error: "Image URL is required." };
  if (!item.caseStudy || typeof item.caseStudy !== "object") {
    return { ok: false, error: "Case study details are required." };
  }

  return { ok: true, item: item as WorkItem };
}

export async function GET() {
  if (!hasValidSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const projects = await getProjects();
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  if (!hasValidSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const body = await req.json();
    const result = validateProject(body);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

    await createProject(result.item);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
