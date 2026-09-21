import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hasValidSession } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const revalidate = 0;

export interface Brand {
  id: number;
  name: string;
  category: string;
  logo_url: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
}

// GET /api/admin/brands — list all brands
export async function GET() {
  try {
    const brands = await query<Brand>(
      "SELECT * FROM brands ORDER BY display_order ASC, id ASC"
    );
    return NextResponse.json(brands);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "DB error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/admin/brands — create new brand
export async function POST(req: Request) {
  if (!hasValidSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { name, category = "", logo_url = null, display_order = 0, active = true } = body;
    if (!name?.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    const rows = await query<Brand>(
      `INSERT INTO brands (name, category, logo_url, display_order, active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name.trim(), category.trim(), logo_url || null, display_order, active]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "DB error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
