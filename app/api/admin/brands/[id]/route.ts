import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/adminAuth";
import { updateBrand, deleteBrand } from "@/lib/brandsStore";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!hasValidSession()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid brand ID." }, { status: 400 });
  }

  try {
    const body = await req.json();
    const updated = await updateBrand(id, {
      name: body.name,
      category: body.category,
      logo_url: body.logo_url,
      sort_order: body.sort_order,
    });

    if (!updated) {
      return NextResponse.json({ error: "Brand not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!hasValidSession()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid brand ID." }, { status: 400 });
  }

  try {
    const deleted = await deleteBrand(id);
    if (!deleted) {
      return NextResponse.json({ error: "Brand not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
