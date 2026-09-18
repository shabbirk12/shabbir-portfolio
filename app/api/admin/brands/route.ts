import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/adminAuth";
import { getBrands, createBrand } from "@/lib/brandsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const brands = await getBrands();
    return NextResponse.json(brands);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!hasValidSession()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Brand name is required." }, { status: 400 });
    }

    const brand = await createBrand({
      name: body.name.trim(),
      category: body.category?.trim() || "",
      logo_url: body.logo_url?.trim() || "",
      sort_order: body.sort_order ?? 0,
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
