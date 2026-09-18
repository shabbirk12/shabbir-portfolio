import "server-only";
import { query } from "@/lib/db";
import type { WorkItem } from "@/lib/types";
import defaultProjects from "@/data/projects.json";

export async function getProjects(): Promise<WorkItem[]> {
  try {
    const rows = await query<{ data: WorkItem }>(
      "SELECT data FROM projects ORDER BY sort_order ASC, id ASC"
    );
    if (rows.length > 0) {
      return rows.map((r) => r.data);
    }
  } catch (err) {
    console.warn("[projectsStore] Could not read projects from database, using fallback data:", err);
  }
  return defaultProjects as unknown as WorkItem[];
}

export async function getProject(slug: string): Promise<WorkItem | undefined> {
  try {
    const rows = await query<{ data: WorkItem }>(
      "SELECT data FROM projects WHERE slug = $1",
      [slug]
    );
    if (rows.length > 0 && rows[0]?.data) {
      return rows[0].data;
    }
  } catch (err) {
    console.warn(`[projectsStore] Could not read project "${slug}" from database, using fallback data:`, err);
  }
  return (defaultProjects as unknown as WorkItem[]).find((p) => p.slug === slug);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) && slug.length > 0 && slug.length <= 80;
}

export { slugify };

export async function createProject(item: WorkItem): Promise<void> {
  const existing = await query("SELECT 1 FROM projects WHERE slug = $1", [item.slug]);
  if (existing.length > 0) {
    throw new Error(`A project with slug "${item.slug}" already exists.`);
  }
  const [{ min_sort }] = await query<{ min_sort: number | null }>(
    "SELECT MIN(sort_order) AS min_sort FROM projects"
  );
  const newSortOrder = (min_sort ?? 0) - 1; // new projects appear first, like unshift() did
  await query("INSERT INTO projects (slug, sort_order, data) VALUES ($1, $2, $3)", [
    item.slug,
    newSortOrder,
    JSON.stringify(item),
  ]);
}

export async function updateProject(slug: string, item: WorkItem): Promise<void> {
  const existing = await query("SELECT sort_order FROM projects WHERE slug = $1", [slug]);

  if (existing.length === 0) {
    // Project is in the JSON fallback but not yet in DB — insert it now (upsert)
    // Also check if the new slug clashes with another DB row
    if (item.slug !== slug) {
      const clash = await query("SELECT 1 FROM projects WHERE slug = $1", [item.slug]);
      if (clash.length > 0) {
        throw new Error(`A project with slug "${item.slug}" already exists.`);
      }
    }
    // Get a sort order that puts it at the end
    const [{ max_sort }] = await query<{ max_sort: number | null }>(
      "SELECT MAX(sort_order) AS max_sort FROM projects"
    );
    await query(
      "INSERT INTO projects (slug, sort_order, data) VALUES ($1, $2, $3)",
      [item.slug, (max_sort ?? 0) + 1, JSON.stringify(item)]
    );
    return;
  }

  // Project is in DB — update it (slug may have changed)
  if (item.slug !== slug) {
    const clash = await query("SELECT 1 FROM projects WHERE slug = $1", [item.slug]);
    if (clash.length > 0) {
      throw new Error(`A project with slug "${item.slug}" already exists.`);
    }
  }
  await query(
    "UPDATE projects SET slug = $1, data = $2, updated_at = now() WHERE slug = $3",
    [item.slug, JSON.stringify(item), slug]
  );
}

export async function deleteProject(slug: string): Promise<void> {
  const result = await query("DELETE FROM projects WHERE slug = $1 RETURNING 1", [slug]);
  if (result.length === 0) {
    throw new Error(`No project found with slug "${slug}".`);
  }
}
