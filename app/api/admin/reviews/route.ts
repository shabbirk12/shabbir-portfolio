import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/adminAuth";
import { getAllReviews, createReview } from "@/lib/reviewsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasValidSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const reviews = await getAllReviews();
  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  if (!hasValidSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const body = await req.json();
    const { name, role, company, rating, content, logo_url, status } = body;
    if (!name || !content) {
      return NextResponse.json({ error: "Name and review content are required." }, { status: 400 });
    }
    const review = await createReview({
      name,
      role,
      company,
      rating: rating || 5,
      content,
      logo_url,
      status: status || "approved",
    });
    return NextResponse.json({ ok: true, review });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create review." }, { status: 500 });
  }
}
