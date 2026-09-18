import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hasValidSession } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const revalidate = 0;

interface Brand {
  id: number;
  name: string;
  category: string;
  logo_url: string | null;
  display_order: number;
  active: boolean;
}

// PUT /api/admin/brands/[id] — update a brand
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!hasValidSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const body = await req.json();
    const { name, category = "", logo_url, display_order, active } = body;
    const rows = await query<Brand>(
      `UPDATE brands
       SET name=$1, category=$2, logo_url=$3, display_order=$4, active=$5
       WHERE id=$6
       RETURNING *`,
      [
        name?.trim() ?? "",
        category?.trim() ?? "",
        logo_url ?? null,
        display_order ?? 0,
        active ?? true,
        id,
      ]
    );
    if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "DB error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/admin/brands/[id] — delete a brand
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!hasValidSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    await query("DELETE FROM brands WHERE id=$1", [id]);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "DB error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
