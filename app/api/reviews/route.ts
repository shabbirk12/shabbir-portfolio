import { NextResponse } from "next/server";
import { getApprovedReviews, createReview } from "@/lib/reviewsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reviews = await getApprovedReviews();
    return NextResponse.json({ reviews });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, company, rating, content } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Your name is required." }, { status: 400 });
    }
    if (!content || typeof content !== "string" || content.trim().length < 5) {
      return NextResponse.json({ error: "Please provide a brief review (at least 5 characters)." }, { status: 400 });
    }

    const review = await createReview({
      name: name.trim(),
      role: role ? String(role).trim() : null,
      company: company ? String(company).trim() : null,
      rating: typeof rating === "number" ? rating : 5,
      content: content.trim(),
      status: "pending",
    });

    return NextResponse.json({
      ok: true,
      review,
      message: "Thank you for putting your trust in my craft! Your review has been received with sincere gratitude and will appear live on the site as soon as it's verified.",
    });
  } catch (err: any) {
    console.error("Review submit error:", err);
    return NextResponse.json({ error: "Something went wrong while saving your review." }, { status: 500 });
  }
}
