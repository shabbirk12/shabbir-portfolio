import "server-only";
import { query } from "@/lib/db";
import defaultSkills from "@/data/skills.json";
import defaultServices from "@/data/services.json";
import defaultLab from "@/data/lab.json";
import defaultStats from "@/data/stats.json";
import defaultAboutDetails from "@/data/about-details.json";
import defaultToolkit from "@/data/toolkit.json";

export type Collection = "skills" | "services" | "lab" | "stats" | "about-details" | "toolkit";

const VALID: readonly Collection[] = [
  "skills",
  "services",
  "lab",
  "stats",
  "about-details",
  "toolkit",
];

export function isValidCollection(name: string): name is Collection {
  return (VALID as readonly string[]).includes(name);
}

const DEFAULTS: Record<Collection, unknown> = {
  skills: defaultSkills,
  services: defaultServices,
  lab: defaultLab,
  stats: defaultStats,
  "about-details": defaultAboutDetails,
  toolkit: defaultToolkit,
};

export async function readCollection<T = unknown>(name: Collection): Promise<T> {
  try {
    const rows = await query<{ data: T }>(
      "SELECT data FROM content_collections WHERE name = $1",
      [name]
    );
    if (rows.length > 0 && rows[0].data) {
      return rows[0].data;
    }
  } catch (err) {
    console.warn(`[contentStore] Could not read "${name}" from database, using fallback data:`, err);
  }
  return DEFAULTS[name] as T;
}

export async function writeCollection(name: Collection, data: unknown): Promise<void> {
  await query(
    `INSERT INTO content_collections (name, data, updated_at)
     VALUES ($1, $2, now())
     ON CONFLICT (name) DO UPDATE SET data = $2, updated_at = now()`,
    [name, JSON.stringify(data)]
  );
}

// Typed convenience getters used by the site's server components.
export type ServiceItem = { index: string; title: string; detail: string };
export type LabItem = { index: string; tags: string[]; title: string; detail: string; link: string };
export type StatItem = { value: string; label: string };
export type AboutDetailItem = { label: string; value: string };
export type ToolkitCategory = { heading: string; tag: string; items: { name: string; tag: string }[] };

export const getSkills = () => readCollection<string[]>("skills");
export const getServices = () => readCollection<ServiceItem[]>("services");
export const getLab = () => readCollection<LabItem[]>("lab");
export const getStats = () => readCollection<StatItem[]>("stats");
export const getAboutDetails = () => readCollection<AboutDetailItem[]>("about-details");
export const getToolkitCategories = () => readCollection<ToolkitCategory[]>("toolkit");
