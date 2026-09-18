import "server-only";
import { query } from "@/lib/db";

export type Brand = {
  id: number;
  name: string;
  category: string;
  logo_url: string;
  sort_order: number;
  created_at: string;
};

export async function getBrands(): Promise<Brand[]> {
  return query<Brand>("SELECT * FROM brands ORDER BY sort_order ASC, id ASC");
}

export async function getBrand(id: number): Promise<Brand | null> {
  const rows = await query<Brand>("SELECT * FROM brands WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function createBrand(data: {
  name: string;
  category?: string;
  logo_url?: string;
  sort_order?: number;
}): Promise<Brand> {
  const rows = await query<Brand>(
    `INSERT INTO brands (name, category, logo_url, sort_order)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.name, data.category || "", data.logo_url || "", data.sort_order ?? 0]
  );
  return rows[0];
}

export async function updateBrand(
  id: number,
  data: {
    name?: string;
    category?: string;
    logo_url?: string;
    sort_order?: number;
  }
): Promise<Brand | null> {
  const current = await getBrand(id);
  if (!current) return null;

  const rows = await query<Brand>(
    `UPDATE brands
     SET name = $1, category = $2, logo_url = $3, sort_order = $4
     WHERE id = $5
     RETURNING *`,
    [
      data.name ?? current.name,
      data.category ?? current.category,
      data.logo_url ?? current.logo_url,
      data.sort_order ?? current.sort_order,
      id,
    ]
  );
  return rows[0] ?? null;
}

export async function deleteBrand(id: number): Promise<boolean> {
  const rows = await query("DELETE FROM brands WHERE id = $1 RETURNING id", [id]);
  return rows.length > 0;
}
