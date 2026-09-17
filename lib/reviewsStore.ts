import "server-only";
import { query } from "@/lib/db";

export type Review = {
  id: number;
  name: string;
  role: string | null;
  company: string | null;
  rating: number;
  content: string;
  logo_url?: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export async function getApprovedReviews(): Promise<Review[]> {
  try {
    const rows = await query<Review>(
      "SELECT id, name, role, company, rating, content, logo_url, status, created_at FROM reviews WHERE status = 'approved' ORDER BY created_at DESC"
    );
    return rows;
  } catch (err) {
    console.error("Error fetching approved reviews:", err);
    return [];
  }
}

export async function getAllReviews(): Promise<Review[]> {
  try {
    const rows = await query<Review>(
      "SELECT id, name, role, company, rating, content, logo_url, status, created_at FROM reviews ORDER BY created_at DESC"
    );
    return rows;
  } catch (err) {
    console.error("Error fetching all reviews:", err);
    return [];
  }
}

export async function createReview(data: {
  name: string;
  role?: string | null;
  company?: string | null;
  rating?: number;
  content: string;
  logo_url?: string | null;
  status?: "pending" | "approved";
}): Promise<Review> {
  const rating = Math.min(5, Math.max(1, data.rating || 5));
  const status = data.status || "pending";

  const rows = await query<Review>(
    `INSERT INTO reviews (name, role, company, rating, content, logo_url, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, role, company, rating, content, logo_url, status, created_at`,
    [
      data.name.trim(),
      data.role?.trim() || null,
      data.company?.trim() || null,
      rating,
      data.content.trim(),
      data.logo_url?.trim() || null,
      status,
    ]
  );
  return rows[0];
}

export async function updateReviewStatus(
  id: number,
  status: "approved" | "rejected" | "pending"
): Promise<void> {
  await query("UPDATE reviews SET status = $1 WHERE id = $2", [status, id]);
}

export async function deleteReview(id: number): Promise<void> {
  await query("DELETE FROM reviews WHERE id = $1", [id]);
}
